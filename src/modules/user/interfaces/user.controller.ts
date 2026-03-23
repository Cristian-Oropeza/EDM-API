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
import { UpdateUserDto } from '../dto/update-user';
import { User } from '../entities/user-entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  public async getAllUsers(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const result = await this.userService.getUserById(id);

    if (!result) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public async insertUser(
    @Body() user: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    try {
      return await this.userService.insertUser(user);
    } catch (error) {
      throw new HttpException(
        'Error al insertar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdate: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    try {
      return await this.userService.updateUser(id, userUpdate);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    try {
      await this.userService.deleteUser(id);
      return true;
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el usuario con ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}