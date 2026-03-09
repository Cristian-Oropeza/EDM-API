import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto): string {
    const { username, password } = loginDto;

    // Verificar el usuario y contraseña

    // Obtener informacion del usuario (payload)

    // Generar el token JWT

    // Devolver el token encriptado
    
    return this.authSvc.login();
  }

  @Get("/me")
  public getProfile(){

  }

  @Post("/refresh")
  public refreshToken(){

  }

  @Post("/logout")
  public logout(){
  }
}