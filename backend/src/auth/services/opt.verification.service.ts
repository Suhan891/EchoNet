import { Injectable } from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class OtpVerificationService {
  constructor(
    private readonly cacheService: AppCacheService,
    private readonly mailService: EmailService,
  ) {}

  private readonly OTP_EXPIRATION_TIME = 5* 60;
  
}
