import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { EmailService } from 'src/common/email/email.service';
import { JwtCreate } from './tokens/token.service';
import { CreateProfileDto } from 'src/profile/dto/profile.dto';
import { verifyDto } from './dto/verify-email.dto';
import { ProfileService } from 'src/profile/profile.service';
import { LoginDto, RefreshAccessDto, resetDto } from './dto/login.dto';
import { authUserDto } from './tokens/token.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: EmailService,
    private tokenService: JwtCreate,
    private profileService: ProfileService,
    private cacheService: AppCacheService,
  ) {}

  async register(registerData: RegisterDto) {
    const email = registerData.email;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(registerData.password);

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

    const token = this.tokenService.emailVerifyToken({ sub: user.id });
    const url = `http://localhost:3000/verify-email?token=${token}`;
    await this.mailService.sendEmail({
      receipents: user.email,
      text: `Welcome ${user.username} to Social Media App`,
      html: `<p>Please click this below link to verify: <br/>${url}</p>`,
      subject: 'Email verification',
    });

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
    if (!user) return new NotFoundException('No such user exists');

    const isValidPass = bcrypt.compareSync(data.password, user.password);
    if (!isValidPass)
      return new ForbiddenException('Please provide a valid password');

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
    const authUser = await this.prisma.user.findFirst({
      where: { id: user.userId },
      select: {
        username: true,
        email: true,
        profile: {
          select: {
            isActive: true,
            name: true,
            id: true,
            avatarUrl: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof authUser>(key, authUser, 1000 * 60 * 10); // Save with userId for 10 min
    return authUser;
  }

  async refreshHandler(user: RefreshAccessDto) {
    const key = `user:${user.id}`;
    await this.cacheService.delByPattern(key);
    return await this.prisma.user.findFirst({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        tokenVersion: true,
      },
    });
  }

  async logout(user: RefreshAccessDto) {
    const key = `user:${user.id}`;
    await this.cacheService.delByPattern(key);
    return await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
      select: { isActive: true, email: true },
    });
  }

  async reset(data: resetDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
      select: { id: true, isEmailVerified: true },
    });
    if (!user) return new NotFoundException('No such user exists');

    if (user.isEmailVerified !== true)
      return new UnauthorizedException('Firstly verify your email');

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passResetToken: tokenHash,
        passResetExpTime: new Date(Date.now() + 15 * 60 * 1000),
      },
      select: {
        passResetExpTime: true,
        email: true,
        username: true,
      },
    });

    const token = this.tokenService.forgotPassToken({ sub: user.id });
    const url = `http://localhost:3000/verify-reset?token=${token}`;
    await this.mailService.sendEmail({
      receipents: updatedUser.email,
      text: `Hello ${updatedUser.username} there was a reset password request`,
      html: `<p>Please click this below link to create a new password: <br/>${url}</p>`,
      subject: 'Password Reset',
    });

    return updatedUser;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
