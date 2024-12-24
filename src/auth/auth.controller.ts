import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // 通过邮箱登录
  @Post('login/email')
  loginEmail(@Body() authEmailLoginDto: AuthEmailLoginDto) {
    // return this.authService.validateLogin(authEmailLoginDto);
    return this.authService.loginEmail(authEmailLoginDto);
  }

  /* 忘记密码 */
  @SkipAuth()
  @Post('forgot/password')
  forgotPassword(@Body() authForgotPasswordDto: AuthForgotPasswordDto) {
    return 'forgot password';
  }

  // 退出登录
  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return req.logout(); // TODO: 需要 token 吗？
  }
}
