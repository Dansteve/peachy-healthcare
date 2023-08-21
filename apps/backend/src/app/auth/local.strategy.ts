import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@peachy-healthcare/app-interface';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    console.log('validate', username, password);
    const user = await this.authService.validateUser(username, password);
    console.log('validate', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
