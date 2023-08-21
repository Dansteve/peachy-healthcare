import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from '@peachy-healthcare/app-constant';
import { User, Address } from '@peachy-healthcare/app-interface';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    TypeOrmModule.forRoot({
      ...environment.dbConfig,
      entities: [User, Address],
      synchronize: true, //development only
    }),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
