import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, } from '@peachy-healthcare/app-interface';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { responseData } from '../util';

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.usersService.initializeDb();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    console.log('validateUser', 'username', username, 'password', password);
    // const users = await this.usersService.getUserDB.find<User>('/', (user: User) => user.email === email && user.password === password);
    const users = await this.usersService.login(username, password);
    if (!users.data) {
      return null;
    }

    return users.data;
  }

  async login(user: Partial<User>) {
    // Remove password from the response
    const currentUser = await this.validateUser(user.username, user.password);

    if (!currentUser) {
      return responseData(null, 'Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { password, ...result } = currentUser || user;
    const payload = {
      email: user.username,
      sub: user.id,
      ...result
    };
    const token = this.jwtService.sign(payload);
    return responseData({ token, user: result}, 'Login successful', HttpStatus.OK);
  }

  async register(user: Partial<User>) {
    const users = (await this.usersService.getUserByUsername(user.username)).data;
    if (users) {
      return responseData(null, 'User already exists', HttpStatus.CONFLICT);
    }
    const newUser = (await this.usersService.createUser(user)).data;
    const { password, ...result } = newUser;
    const payload = {
      email: user.username,
      sub: user.id,
      ...result
    };
    const token = this.jwtService.sign(payload);

    return responseData({ token, user: result }, 'User created successfully', HttpStatus.CREATED);
  }

  async getProfile(user: Partial<User>) {
    const users = (await this.usersService.getUserByUsername(user.username)).data;
    if (!users) {
      return responseData(null, 'User not found', HttpStatus.NOT_FOUND);
    }

    return responseData(users, 'User profile', HttpStatus.OK);
  }

}
