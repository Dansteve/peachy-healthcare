import { Body, Controller, Get, Param, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getUsers(@Res({ passthrough: true }) res: Response) {
        const result = await this.usersService.getUsers();
        res.status(result.status);

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUser(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
        const result = await this.usersService.getUser(id);
        res.status(result.status);

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string, @Res({ passthrough: true }) res: Response) {
      const result = await this.usersService.getUserByUsername(username);
        res.status(result.status);

        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Res({ passthrough: true }) res: Response, @Body() payload: any) {
        console.log(payload);
        const result = await this.usersService.updateUser(id, payload);
        res.status(result.status);

        return result;
    }
}
