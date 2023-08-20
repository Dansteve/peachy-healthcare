import { HttpStatus, Injectable } from '@nestjs/common';

import { responseData } from './util';

@Injectable()
export class AppService {

  constructor() {
    //noop
  }

  getWelcome(): { message: string; } {
    const apiConfig = {
      message: 'Welcome to backend!',
      version: '1.0.0'
    };
    return responseData<any>(apiConfig, 'Success', HttpStatus.OK);
  }
}
