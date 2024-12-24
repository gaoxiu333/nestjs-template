import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import * as ms from 'ms';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/config/app-config.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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
    // TODO: 检查密码是否匹配
    return this.validateLogin(loginDto);
  }

  // 检查登录
  async validateLogin(loginDto: LoginDto): Promise<any> {
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
      username: user.username,
    });
    return {
      token,
      refreshToken,
      tokenExpiresIn,
    };
  }
  private async generateToken({
    id,
    username,
  }: {
    id: string;
    username: string;
  }) {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const tokenExpiresIn = Date.now() + ms(securityConfig.expiresIn);
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync({
        id: id,
        username: username,
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
    const securityConfig =
      this.configService.get<SecurityConfig>('app.security');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  private generateAccessToken(payload: { username: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { username: string }): string {
    const securityConfig =
      this.configService.get<SecurityConfig>('app.security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
}
