import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/task/interfaces/task.module';
import { UserModule } from './modules/user/interfaces/user.module';
import { LogsModule } from './modules/logs/interfaces/logs.module';

@Module({
  imports: [AuthModule, TaskModule, UserModule, LogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}