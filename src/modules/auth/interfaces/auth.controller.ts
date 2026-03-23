import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.authSvc.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
    }

    if (await this.authSvc.checkPassword(password, user.password)) {
      //Obtener la informacion del usuario (payload)
      const {password, username, ...payload} = user;

      //Generar el JWT
      const access_token = await this.authSvc.generateJWT(payload);

      //Generar el refresh Token
      const refresh_token = await this.authSvc.generateJWT(payload, '7d');

      //Devolver el JWT encriptado
      return {
        access_token,
        refresh_token
      }

    } else{
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
    }

  }
  
}