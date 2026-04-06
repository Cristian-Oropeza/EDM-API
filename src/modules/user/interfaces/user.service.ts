import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { UtilService } from 'src/common/services/util.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private util: UtilService,
  ) {}

  public async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
        tasks: true,
      },
    });
    return users;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
        tasks: true,
      },
    });
    return user;
  }

  public async insertUser(user: CreateUserDto): Promise<User> {
    /* const existUser = await this.prisma.user.getUserByUserName({
      where: { username: user.username },
    });

    if (existUser) {
      throw new HttpException(
        'El nombre de usuario ya exist',
        HttpStatus.BAD_REQUEST,
      );
    } */

    const encryptedPassword = await this.util.hash(user.password);
    user.password = encryptedPassword;
    const newUser = await this.prisma.user.create({ data: user });
    return newUser;
  }

  public async updateUser(
    id: number,
    userUpdate: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
    });
    return user;
  }

  public async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (user?.tasks && user.tasks.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );
    }

    return await this.prisma.user.delete({ where: { id } });
  }
}