import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
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
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
    return await this.usersvc.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
    @Req() req: any,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    if (req.user.id !== id) {
      throw new ForbiddenException({
        message: 'No tienes permiso para editar este usuario',
        errorCode: 'FORBIDDEN_USER_UPDATE',
      });
    }

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
  @UseGuards(AuthGuard)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    if (req.user.id !== id) {
      throw new ForbiddenException({
        message: 'No tienes permiso para eliminar este usuario',
        errorCode: 'FORBIDDEN_USER_DELETE',
      });
    }

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