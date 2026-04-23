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
import { LogsService } from 'src/modules/logs/interfaces/logs.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private usersvc: UserService,
    private readonly logsSvc: LogsService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAllUsers(
    @Req() req: any,
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>[]> {
    if (req.user.role !== 'admin') {
      const self = await this.usersvc.getUserById(req.user.id);
      return self ? [self] : [];
    }
    return await this.usersvc.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException({
        message: 'No tienes permiso para ver este usuario',
        errorCode: 'FORBIDDEN_USER_READ',
      });
    }
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
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    return await this.usersvc.insertUser(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
    @Req() req: any,
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.id === id;

    if (!isAdmin && !isOwner) {
      await this.logsSvc.createLog({
        status_code: 403,
        path: `/api/user/${id}`,
        error: 'Intento de editar usuario ajeno',
        error_code: 'FORBIDDEN_USER_UPDATE',
        session_id: req.user.id,
      });
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

    // El username es inmutable: nadie puede modificarlo, ni siquiera el propio dueño
    const { username: _ignored, ...payload } = user;

    return await this.usersvc.updateUser(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    if (req.user.id !== id && req.user.role !== 'admin') {
      await this.logsSvc.createLog({
        status_code: 403,
        path: `/api/user/${id}`,
        error: 'Intento de eliminar usuario ajeno',
        error_code: 'FORBIDDEN_USER_DELETE',
        session_id: req.user.id,
      });
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