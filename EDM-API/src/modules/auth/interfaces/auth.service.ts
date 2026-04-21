import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilSvc: UtilService,
  ) {}

  public async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: true,
        refreshToken: true,
        role: true,
        createdAt: true,
      },
    });
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
            select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: true,
        refreshToken: true,
        role: true,
        createdAt: true,
      },
    });
  }

  public async updateHash(userId: number, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  public async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await this.utilSvc.checkPassword(password, hashedPassword);
  }

  public async generateJWT(payload: any, expiresIn: string = '1h'): Promise<string> {
    return await this.utilSvc.generateJWT(payload, expiresIn);
  }
}