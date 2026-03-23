import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user-entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    private readonly prisma: PrismaService,
    private readonly utilSvc: UtilService,
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

  public async insertUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const hashedPassword = await this.utilSvc.hashPassword(createUserDto.password);

    return await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
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
    if (userUpdate.password) {
      userUpdate.password = await this.utilSvc.hashPassword(userUpdate.password);
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