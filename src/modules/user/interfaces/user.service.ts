import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user-entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user';
import { PrismaService } from 'src/common/services/prisma.service';


@Injectable()
export class UserService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    private prisma: PrismaService,
  ) {}

  public async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const user = await this.prisma.user.findMany({ 
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true
      }
    });
    return user;
  }

  public async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        createdAt: true
      }
    });
    return user;
  }

  public async insertUser(task: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({ data: task });
    return newUser;
  }

  public async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
    });
    return user;
  }

  public async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }
}