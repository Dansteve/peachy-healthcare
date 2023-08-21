import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@peachy-healthcare/app-interface';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {

  private logger = new Logger('AppController');

  constructor(private readonly appService: AppService,
    private authService: AuthService) { }

  @Get('')
  getWelcome() {
    return this.appService.getWelcome();
  }

  @Post('register')
  async register(@Request() req) {
    const payload: Partial<User> = { ...req.body };
    return this.authService.register(payload);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('login');
    const payload: Partial<User> = { ...req.body };
    return this.authService.login(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // return req.user;
    return this.authService.getProfile(req.user);
  }

}
