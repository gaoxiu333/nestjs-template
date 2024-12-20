import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

type OrNeverType<T> = T | never;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // TODO: ConfigService 的泛型参数是any，我们需要将其更改为我们的配置类型
  constructor(configService: ConfigService<any>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  // TODO:payload 的类型是any，我们需要将其更改为JwtPayloadType
  public validate(payload: any): OrNeverType<any> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
