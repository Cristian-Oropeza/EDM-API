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
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private usersvc: UserService) {}

  @Get('')
  async getAllUsers(): Promise<User[]> {
    return await this.usersvc.getAllUsers();
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    const result = await this.usersvc.getUserById(id);

    if (result == undefined) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public insertUser(@Body() user: CreateUserDto): Promise<User> {
    const result = this.usersvc.insertUser(user);

    if (!result) {
      throw new HttpException(
        'Error al insertar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.usersvc.updateUser(id, user);
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    await this.usersvc.deleteUser(id);
    return true;
  }
}