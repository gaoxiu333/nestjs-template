import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { SecurityConfig } from 'src/config/app-config.type';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

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
  // 验证密码
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
