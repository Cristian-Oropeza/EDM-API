import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../common/services/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { LogsModule } from '../../logs/interfaces/logs.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'edm_super_secret_change_me',
      signOptions: { expiresIn: '1h' },
    }),
    LogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService, AuthGuard],
  exports: [AuthService, UtilService, AuthGuard],
})
export class AuthModule {}