import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { LogsModule } from '../../logs/interfaces/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, UtilService, AuthGuard],
  exports: [TaskService],
})
export class TaskModule {}