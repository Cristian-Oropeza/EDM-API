import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/api/user')
// @UseGuards(AuthGuard)
export class UserController {
  constructor(private usersvc: UserService) {}

  @Get('')
  async getAllUsers(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return await this.usersvc.getAllUsers();
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const result = await this.usersvc.getUserById(id);

    if (!result) {
      throw new HttpException(
        { message: `Usuario con ID ${id} no encontrado`, errorCode: 'USER_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public async insertUser(
    @Body() user: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    return await this.usersvc.insertUser(user);
  }

  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const result = await this.usersvc.getUserById(id);

    if (!result) {
      throw new HttpException(
        { message: `Usuario con ID ${id} no encontrado`, errorCode: 'USER_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.usersvc.updateUser(id, user);
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const result = await this.usersvc.getUserById(id);

    if (!result) {
      throw new HttpException(
        { message: `Usuario con ID ${id} no encontrado`, errorCode: 'USER_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersvc.deleteUser(id);
    return true;
  }
}