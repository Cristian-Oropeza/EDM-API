import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, UtilService],
})
export class TaskModule {}