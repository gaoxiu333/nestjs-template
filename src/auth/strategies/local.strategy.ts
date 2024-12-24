import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // 如果有其他策略，比如：email、phone等，可以传入参数 https://www.passportjs.org/concepts/authentication/strategies/
  }
  async validate(id: string): Promise<any> {
    console.log('id', id); // 这里的传值就是 login 的body参数，所以可能是一个id
    const user = await this.authService.validateUser(id);
    if (!user) {
      throw new UnauthorizedException(); // TODO: 添加异常层，统一处理：https://docs.nestjs.com/exception-filters
    }
    return user;
  }
}
