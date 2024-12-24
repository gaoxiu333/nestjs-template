import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SecurityConfig } from 'src/config/app-config.type';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { PasswordService } from './password/password.service';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private passwordService: PasswordService,
  ) {}
  // 用户注册
  async register(dto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      access_token: this.generateAccessToken({ id: user.id }),
      refresh_token: this.generateRefreshToken({ id: user.id }),
      user: omit(user, ['password']),
    };
  }

  // 登录
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          username: '用户不存在',
        },
      });
    }

    if (!user.password) {
      throw new UnauthorizedException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: '密码不正确',
        },
      });
    }
    const isValidPassword = await this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: '密码不正确',
        },
      });
    }
    const { token, refreshToken, tokenExpiresIn } = await this.generateToken({
      id: user.id,
    });
    return {
      token,
      user: omit(user, ['password']),
    };
  }

  // 邮箱登录
  async loginEmail(authEmailLoginDto: AuthEmailLoginDto) {
    const user = await this.usersService.findByEmail(authEmailLoginDto.email);
    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: '用户不存在',
        },
      });
    }
    const passwordValid = await this.passwordService.comparePassword(
      authEmailLoginDto.password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: '密码不正确',
        },
      });
    }
    const { token, refreshToken, tokenExpiresIn } = await this.generateToken({
      id: user.id,
    });
    return {
      token,
      refreshToken,
      tokenExpiresIn,
    };
  }

  // 检查登录
  private async generateToken({ id }: { id: string }) {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const tokenExpiresIn = Date.now() + ms(securityConfig.expiresIn);
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync({
        id: id,
      }),
      await this.jwtService.signAsync({}),
    ]);
    return {
      token,
      refreshToken,
      tokenExpiresIn,
    };
  }

  // 忘记密码
  async forgotPassword(authForgotPasswordDto: AuthForgotPasswordDto) {
    const user = await this.usersService.findByUsername(
      authForgotPasswordDto.username,
    );
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          username: '用户不存在',
        },
      });
    }
    // TODO: 30m 需要提取为环境变量
    const tokenExpires = Date.now() + ms('30m');
    const token = await this.jwtService.signAsync(
      {
        username: user.username,
      },
      {
        secret: this.configService.get('JWT_RESET_SECRET'),
        expiresIn: tokenExpires,
      },
    );
    // TODO: 发送邮件
  }

  // 验证用户
  async validateUser(id: string): Promise<any> {
    return this.usersService.findById(id);
  }

  private generateAccessToken(payload: { id: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { id: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
}
