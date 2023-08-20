import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { initialUsers } from '@peachy-healthcare/app-constant';
import { Address, User } from '@peachy-healthcare/app-interface';
import { Repository } from 'typeorm';
import { responseData } from '../util';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private jwtService: JwtService
  ) {
  }

  async initializeDb() {
    this.logger.log('Initializing User DB');
    const users = await this.userRepository.count();

    if (users === 0) {
      const initialUser = initialUsers[0];
      this.createUser(initialUser);
    }
  }

  async getUsers() {
    this.logger.log('Getting users');
    const users = await this.userRepository.find();
    return responseData<User[]>(users, 'Users retrieved successfully', HttpStatus.OK);
  }


  async getUser(id: string) {
    this.logger.log(`Getting user with id: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return responseData<null>(null, 'User not found', HttpStatus.NOT_FOUND);
    }

    const address = await this.addressRepository.findOne({
      where: { userId: user.id },
    });

    user.address = address;

    return responseData<User>(user, 'User retrieved successfully', HttpStatus.OK);
  }

  async getUserByUsername(username: string) {
    this.logger.log(`Getting user with username: ${username}`);
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      return responseData<null>(null, 'User not found', HttpStatus.NOT_FOUND);
    }

    const address = await this.addressRepository.findOne({
      where: { userId: user.id },
    });

    user.address = address;

    return responseData<Partial<User>>(user, 'User retrieved successfully', HttpStatus.OK);
  }

  async createUser(user: User | Partial<User>) {
    this.logger.log(`Creating user: `, user);
    const userRecord = await this.userRepository.save(user);

    const userAddress = await this.addressRepository.save({
      userId: userRecord.id,
      ...user.address
    });

    userRecord.address = userAddress;

    return responseData<User>(userRecord, 'User created successfully', 201);
  }

  async updateUser(userId: string, user: User | Partial<User>) {
    this.logger.log(`Updating user with id: ${userId}`);
    delete user.username;

    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!findUser) {
      return responseData<null>(null, 'User not found', HttpStatus.NOT_FOUND);
    }

    // update the user
    await this.userRepository.update({ id: userId }, user);

    const afterUpdateUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    const token = this.jwtService.sign({ ...afterUpdateUser });

    return responseData({ token, user: afterUpdateUser }, 'User updated successfully', HttpStatus.OK);
  }

  async deleteUser(userId: string) {
    this.logger.log(`Deleting user with id: ${userId}`);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return responseData<null>(null, 'User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete({ id: userId });

    return responseData<User>(null, 'User deleted successfully', HttpStatus.OK);
  }

  async login(username: string, password: string) {
    this.logger.log(`Logging in user with username: ${username}`);
    const users = await this.userRepository.findOne({
      where: { username : username.toLowerCase(), password },
    });

    if (!users) {
      return responseData<null>(null, 'Invalid username or password', HttpStatus.BAD_REQUEST);
    }

    const address = await this.addressRepository.findOne({
      where: { userId: users.id },
    });

    users.address = address;

    return responseData<User>(users, 'User logged in successfully', HttpStatus.OK);
  }


}
