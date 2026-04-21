import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { LogsModule } from '../../logs/interfaces/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}