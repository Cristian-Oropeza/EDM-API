import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mysqlProvider } from '../../../common/providers/mysql.provider';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

@Module({
  imports: [
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, mysqlProvider, PrismaService, UtilService],
})
export class UserModule {}