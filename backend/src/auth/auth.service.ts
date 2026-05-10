import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { EmailService } from 'src/common/email/email.service';
import { JwtCreate, JwtVerify } from './tokens/token.service';
import { CreateProfileDto } from 'src/profile/dto/profile.dto';
import { verifyDto } from './dto/verify-email.dto';
import { ProfileService } from 'src/profile/profile.service';
import { LoginDto, RefreshAccessDto, resetDto } from './dto/login.dto';
import { authUserDto } from './tokens/token.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { EmailEvent } from './dto/async.work';
import EventEmitter2 from 'eventemitter2';
import { OtpVerificationService } from './services/opt.verification.service';
import { NewPassDto, OtpVerifyDto, TokenDto } from './dto/password.reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: EmailService,
    private jwtCreate: JwtCreate,
    private jwtVerify: JwtVerify,
    private profileService: ProfileService,
    private cacheService: AppCacheService,
    private eventEmitter: EventEmitter2,
    private otpService: OtpVerificationService,
  ) {}

  async register(registerData: RegisterDto) {
    const email = registerData.email;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = this.hashPassword(registerData.password);

    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        username: registerData.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    const token = this.jwtCreate.emailVerifyToken({ sub: user.id });
    const url = `http://localhost:3000/verify?token=${token}`;
    // await this.mailService.sendEmail({
    //   receipents: user.email,
    //   text: `Welcome ${user.username} to Social Media App`,
    //   html: `<p>Please click this below link to verify: <br/>${url}</p>`,
    //   subject: 'Email verification',
    // });
    const eventData = {
      name: user.username,
      email: user.email,
      url,
    } as EmailEvent;

    this.eventEmitter.emit('email.verify', eventData);

    return {
      ...user,
      id: null,
    };
  }

  async verifyEmail(
    user: verifyDto,
    profileData: CreateProfileDto,
    avatar: Express.Multer.File,
  ) {
    const reqUser = {
      userId: user.id,
      role: user.role,
      name: user.username,
    };
    await this.profileService.createProfile(reqUser, profileData, avatar);

    return await this.prisma.user.update({
      where: { id: reqUser.userId },
      data: { isEmailVerified: true },
      select: {
        isEmailVerified: true,
        email: true,
        username: true,
        isActive: true,
      },
    });
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
      select: { id: true, password: true },
    });
    if (!user) throw new NotFoundException('No such user exists');

    const isValidPass = bcrypt.compareSync(data.password, user.password);
    if (!isValidPass)
      throw new ForbiddenException('Please provide a valid password');

    return await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
      select: {
        id: true,
        role: true,
        tokenVersion: true,
      },
    });
  }

  async myself(user: authUserDto) {
    const key = `user:${user.userId}`;
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return cachedData;

    const authUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profile: {
          select: {
            isActive: true,
            id: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
    });
    const activeProfile = authUser?.profile.find(
      (profile) => profile.isActive === true,
    );
    const profileKey = `profile:${activeProfile?.id}`;
    await this.cacheService.delete(profileKey); // Delete specific profile cache if needed, but user cache is primary
    await this.cacheService.set<typeof authUser>(key, authUser, 1000 * 60 * 20);
    return authUser;
  }

  async refreshHandler(user: RefreshAccessDto) {
    const key = `user:${user.id}`;
    await this.cacheService.delete(key);
    return await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        tokenVersion: true,
      },
    });
  }

  async logout(user: authUserDto) {
    console.log('User: ', user);
    const key = `user:${user.userId}`;
    await this.cacheService.delete(key);
    await this.prisma.user.update({
      where: { id: user.userId },
      data: { isActive: false },
      select: {
        id: true,
        profile: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async reset(data: resetDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        username: true,
        email: true,
        isEmailVerified: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      // If this email is not registered => to make the user feel like it is present
      const token = this.jwtCreate.forgotPassToken({
        email: data.email,
        isValidUser: false,
        name: undefined,
        tokenVersion: 0,
      });
      return token;
    }

    if (!user.isEmailVerified)
      throw new BadRequestException('Validate your email before reset');

    const otp = await this.otpService.requestOTP(user.email);
    const eventData = {
      name: user.username,
      email: user.email,
      url: otp,
    } as EmailEvent;

    this.eventEmitter.emit('email.forgot-pass', eventData);
    const token = this.jwtCreate.forgotPassToken({
      email: user.email,
      isValidUser: true,
      name: user.username,
      tokenVersion: user.tokenVersion,
    });
    return token;
  }

  async reEmail(data: TokenDto) {
    const payload = this.jwtVerify.forgotPassToken(data.token);
    if (!payload) throw new ForbiddenException('Invalid token');
    if (!payload.isValidUser) return; // Not a valid user
    const isVerified = await this.cacheService.get<boolean>(
      `${payload.email}:verification`,
    );
    if (isVerified === null)
      throw new BadRequestException('Your session has expired');

    const otp = await this.otpService.requestOTP(payload.email);

    const eventData = {
      name: payload.name,
      email: payload.email,
      url: otp,
    } as EmailEvent;

    this.eventEmitter.emit('email.forgot-pass', eventData);
  }

  async verifyOtp(data: OtpVerifyDto) {
    const { token, otp } = data;
    const payload = this.jwtVerify.forgotPassToken(token);
    if (!payload) throw new ForbiddenException('Invalid token');
    const { email, isValidUser } = payload;
    if (!isValidUser) throw new BadRequestException('Invalid otp'); // For those which is a wrong email => If attacker cannot guess the email

    const isValidOtp = await this.otpService.verifyOtp(email, otp.toString());

    return isValidOtp;
  }

  async newPassword(data: NewPassDto) {
    const { token, password } = data;
    const payload = this.jwtVerify.forgotPassToken(token);
    if (!payload) throw new ForbiddenException('Invalid token');

    const { email, isValidUser, tokenVersion } = payload;
    if (!isValidUser)
      throw new BadRequestException('Verification still not completed');

    const isVerified = await this.cacheService.get<boolean>(
      `${email}:verification`,
    );

    if (isVerified === null)
      throw new BadRequestException('Verification time has expired');
    if (!isVerified)
      throw new BadRequestException('Verification still not completed');

    const hashedPassword = this.hashPassword(password);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, tokenVersion: tokenVersion + 1 },
    });
    await this.cacheService.delete(`${email}:verification`);
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
