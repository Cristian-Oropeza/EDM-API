import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from 'src/common/services/util.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController], //puede tener mas de 1 controlador
  providers: [AuthService, PrismaService, UtilService], //el proveedor es el servicio
})
export class AuthModule {}