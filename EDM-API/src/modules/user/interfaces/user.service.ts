import { Injectable, BadRequestException } from '@nestjs/common';
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

  public async getAllUsers(): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>[]> {
    return await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });
  }

  public async getUserById(id: number): Promise<Omit<User, 'password' | 'refreshToken' | 'role'> | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });
  }

  public async insertUser(user: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    const existing = await this.prisma.user.findFirst({ where: { username: user.username } });
    if (existing) {
      throw new BadRequestException({
        message: `El username "${user.username}" ya está en uso`,
        errorCode: 'USERNAME_TAKEN',
      });
    }

    const encryptedPassword = await this.util.hashPassword(user.password);
    return await this.prisma.user.create({
      data: { ...user, password: encryptedPassword },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });
  }

  public async updateUser(
    id: number,
    userUpdate: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    if (userUpdate.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: userUpdate.username, NOT: { id } },
      });
      if (existing) {
        throw new BadRequestException({
          message: `El username "${userUpdate.username}" ya está en uso`,
          errorCode: 'USERNAME_TAKEN',
        });
      }
    }

    if (userUpdate.password) {
      userUpdate.password = await this.util.hashPassword(userUpdate.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: userUpdate,
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });
  }

  public async deleteUser(id: number): Promise<Omit<User, 'password' | 'refreshToken' | 'role'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (user?.tasks && user.tasks.length > 0) {
      throw new BadRequestException({
        message: 'No se puede eliminar el usuario porque tiene tareas asignadas',
        errorCode: 'USER_HAS_TASKS',
      });
    }

    return await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true,
      },
    });
  }
}