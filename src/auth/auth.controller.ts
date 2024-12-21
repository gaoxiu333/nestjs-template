import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private logger = new Logger();
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('signInDto', signInDto);
    this.logger.debug('aaa', AuthController.name);
    this.logger.error('bbb', AuthController.name);
    this.logger.log('ccc', AuthController.name);
    this.logger.verbose('ddd', AuthController.name);
    this.logger.warn('eee', AuthController.name);
    return {};
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
