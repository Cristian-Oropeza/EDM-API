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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user';
import { User } from '../entities/user-entity';
import { UtilService } from 'src/common/services/util.service';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService,
    private utilSvc: UtilService
  ) {}

  @Get('')
  async getAllUsers(): Promise<Omit<User, "password">[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, "password">> {
    const result = await this.userService.getUserById(id);

    if (result == undefined) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    const result = this.userService.insertUser(user);

    if (!result) {
      throw new HttpException(
        'Error al insertar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const encryptedPassword = await this.utilSvc.hashPassword(user.password);
    user.password = encryptedPassword;

    return result;
  }

  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, task);
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el usuario con ID ${id}, no se puede eliminar`,
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}