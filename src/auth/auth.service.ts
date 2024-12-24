import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SecurityConfig } from 'src/config/app-config.type';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // 用户注册
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return {
      access_token: this.generateAccessToken({ username: user.username }),
      refresh_token: this.generateRefreshToken({ username: user.username }),
    };
  }

  // 验证用户
  // TODO: 这里使用的是纯文本明文密码，但是您可以使用bcrypt之类的库，使用加盐单向哈希算法
  async validateUser(id: string): Promise<any> {
    return this.usersService.findById(id);
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
    const isValidPassword = await compare(loginDto.password, user.password);
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
      refreshToken,
      tokenExpiresIn,
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
    const passwordValid = await this.validatePassword(
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

  /**
   * 密码
   */

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }

  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  private generateAccessToken(payload: { username: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { username: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
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
}
