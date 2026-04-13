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

  public async getAllUsers(): Promise<Omit<User, 'password' | 'refreshToken'>[]> {
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

  public async getUserById(id: number): Promise<Omit<User, 'password' | 'refreshToken'> | null> {
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

  public async insertUser(user: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
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

  public async updateUser(id: number, userUpdate: UpdateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
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

  public async deleteUser(id: number): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (user?.tasks && user.tasks.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );
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