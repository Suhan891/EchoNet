import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { UserExistsPipe } from './pipes/user-exists';
import type { verifyDto } from './dto/verify-email.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileDto } from 'src/profile/dto/profile.dto';
import { ActivateMe, NoAccount } from './decorators/no-account';
import { LoginDto, RefreshAccessDto, resetDto } from './dto/login.dto';
import { TokenCreation } from './token.interceptor';
import { RefreshGaurd } from './gaurds/refresh-access.gaurd';
import { CurrentUser } from './gaurds/refresh.decorator';
import type { authUserDto } from './tokens/token.dto';
import { Throttle } from '@nestjs/throttler';
import { NotActive } from 'src/profile/decorator/no-profile';

@Controller('auth')
@NoAccount(true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60 * 60 * 1000, limit: 20 } })
  @Post('register')
  @ResponseMessage('User Registered. Please Verify Your Email')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @Post('verify-email')
  @ResponseMessage('User Verification Successfull')
  @UseInterceptors(FileInterceptor('avatar'))
  async verifyEmail(
    @Query('token', UserExistsPipe) user: verifyDto,
    @Body() createProfile: CreateProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg|jpeg|png',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar: Express.Multer.File,
  ) {
    if (user.isEmailVerified === true) {
      return {
        url: 'http://localhost:3000/login',
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      };
    }
    return await this.authService.verifyEmail(user, createProfile, avatar);
  }

  @Post('login')
  @UseInterceptors(TokenCreation)
  @ResponseMessage('Login Successfull')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('me')
  @ActivateMe(false)
  @NotActive()
  @ResponseMessage('Received all user details')
  async me(@CurrentUser() user: authUserDto) {
    return this.authService.myself(user);
  }

  @Post('refresh-token')
  @UseGuards(RefreshGaurd)
  @ResponseMessage('New access and refresh token created')
  async refreshHandler(@CurrentUser() user: RefreshAccessDto) {
    return this.authService.refreshHandler(user);
  }

  @Post('logout')
  @UseGuards(RefreshGaurd)
  @ResponseMessage('Logged out successfully')
  async logout(@CurrentUser() user: RefreshAccessDto) {
    return this.authService.logout(user);
  }

  @Post('reset')
  @ResponseMessage('Reset Password session started.Please check your inbox')
  async reset(@Body() data: resetDto) {
    return this.authService.reset(data);
  }
}
