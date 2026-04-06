import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
  ) {}

  // POST /auth/register - 201 Created

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    //es importante especificar que tipo de dato se esta retornando
    const { username, password } = loginDto;

    // Verificar el usuario y contraseña
    const user = await this.authSvc.getUserByUsername(username);
    if (!user)
      throw new UnauthorizedException(
        'El usuario y/o contraseña es incorrecto',
      );

    if (await this.utilSvc.checkPassword(password, user.password!)) {
      // Obtener la informacion del usuario (payload)
      const { password, username, ...payload } = user; //segmentacion dee que recibira el payload

      // Generar el JWT
      const access_token = await this.utilSvc.generateJWT(payload, '1h');

      // Generar el refresh token
      const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
      const hashRT = await this.utilSvc.hash(refresh_token);

      // Agregar el hash al usuario
      await this.authSvc.updateHash(user.id, hashRT);
      payload.hash = hashRT;

      // devolver el JWT encriptado
      return {
        access_token,
        refresh_token: hashRT,
      };
    } else {
      throw new UnauthorizedException(
        'El usuario y/o contraseña son incorrectos',
      );
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    const user = request['user'];
    return user;
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    // Obtener el usuario en sesion
    const sessionUser = request['user'];
    const user = await this.authSvc.getUserById(sessionUser.id);
    if (!user || !user.hash) throw new ForbiddenException('Acceso Denegado');

    //Comparar el token recibido con el token guardado
    if (sessionUser.hash != user.hash)
      throw new ForbiddenException('Token invalido');

    const { password, username, ...payload } = user;
    const access_token = await this.utilSvc.generateJWT(payload, '1h');
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
    const hashRT = await this.utilSvc.hash(refresh_token);
    await this.authSvc.updateHash(user.id, hashRT);

    return { access_token, refresh_token: hashRT };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const session = request['user'];
    const user = await this.authSvc.updateHash(session.id, null);
    return user;
  }
}