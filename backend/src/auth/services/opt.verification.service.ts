import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpVerificationService {
  constructor(private readonly cacheService: AppCacheService) {}

  private readonly OTP_EXPIRATION_TIME = 10 * 60; // Expiration after 10 min
  private readonly MAX_RETRY_COUNT = 5;
  private readonly SHORT_COOLDOWN_TIME = 60;
  private readonly LONG_COOLDOWN_TIME = 3600;

  private async storeOtp(email: string, hashedOtp: string) {
    await this.cacheService.set<string>(
      `${email}:otp`,
      hashedOtp,
      this.OTP_EXPIRATION_TIME,
    );
    await this.cacheService.set<number>(
      `${email}:otp_retry_count`,
      0,
      this.OTP_EXPIRATION_TIME,
    );
  }

  private async applyCooldown(
    email: string,
    cooldownTime: number,
  ): Promise<void> {
    const currentTime = Math.floor(Date.now() / 1000);
    await this.cacheService.set(
      `${email}:otp_cooldown`,
      (currentTime + cooldownTime).toString(),
      cooldownTime,
    );
  }

  private async isOnCooldown(email: string) {
    const currentTime = Math.floor(Date.now() / 1000);
    const cooldownTimestamp = await this.cacheService.get(
      `${email}:otp_cooldown`,
    );

    if (cooldownTimestamp && currentTime < Number(cooldownTimestamp)) {
      const timeLeft = Number(cooldownTimestamp) - currentTime;
      const minutesLeft = Math.floor(timeLeft / 60);
      const secondsLeft = timeLeft % 60;

      throw new BadRequestException(
        `OTP request is on cooldown. Please wait ${minutesLeft} minutes and ${secondsLeft} seconds.`,
      );
    }
  }

  async requestOTP(email: string) {
    await this.isOnCooldown(email);

    const otp = randomInt(100000, 1000000).toString();
    const hashedOtp = bcrypt.hashSync(otp, 10);

    await this.storeOtp(email, hashedOtp);

    await this.applyCooldown(email, this.SHORT_COOLDOWN_TIME);
    return otp;
  }

  async verifyOtp(email: string, otp: string) {
    const hashedOtp = await this.cacheService.get<string>(`${email}:otp`);
    if (!hashedOtp) throw new BadRequestException('Your otp has expired');

    const retryCount =
      (await this.cacheService.get<number>(`${email}:otp_retry_count`)) ?? 0;

    if (retryCount > this.MAX_RETRY_COUNT) {
      await this.cacheService.delete(`${email}:otp`);
      throw new ForbiddenException('Max retry count attempted');
    }

    const isVerified = await bcrypt.compare(otp, hashedOtp);
    if (!isVerified) {
      await this.cacheService.increment(`${email}:otp_retry_count`);
      if (retryCount + 1 >= this.MAX_RETRY_COUNT) {
        await this.applyCooldown(email, this.LONG_COOLDOWN_TIME);
      }
      throw new BadRequestException('Invalid otp');
    }

    await this.cacheService.delByPattern(`${email}`);
    return isVerified;
  }
}
