import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from '../dto/jwt.dto';
import { AuthService } from '../auth.service';

type OrNeverType<T> = T | never;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // TODO: ConfigService 的泛型参数是any，我们需要将其更改为我们的配置类型
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtDto) {
    const user = await this.authService.validateUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
