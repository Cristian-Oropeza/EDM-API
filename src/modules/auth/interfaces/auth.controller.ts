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
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
    }

    if (!(await this.utilSvc.checkPassword(password, user.password))) {
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
    }

    const { password: _pwd, username: _usr, refreshToken: _rt, ...payload } = user;

    const access_token = await this.utilSvc.generateJWT(payload, '1h');
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
    const hashRT = await this.utilSvc.hashPassword(refresh_token);

    await this.authSvc.updateHash(user.id, hashRT);

    // devolver refresh_token (JWT), no hashRT (bcrypt)
    return { access_token, refresh_token };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    return request['user'];
  }

  @Post('/refresh')
  // sin AuthGuard, el refresh_token viene en el body
  public async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    // Verificar que el refresh_token sea un JWT válido
    let payload: any;
    try {
      payload = await this.utilSvc.getPayload(body.refreshToken);
    } catch {
      throw new ForbiddenException('Refresh token inválido o expirado');
    }

    // Buscar el usuario y verificar que tenga refreshToken guardado
    const user = await this.authSvc.getUserById(payload.id);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acceso denegado');
    }

    // Fix: comparar el JWT del body contra el hash guardado en BD con bcrypt
    const rtValido = await this.utilSvc.checkPassword(body.refreshToken, user.refreshToken);
    if (!rtValido) {
      throw new ForbiddenException('Refresh token inválido');
    }

    const { password: _pwd, username: _usr, refreshToken: _rt, ...newPayload } = user;

    const access_token = await this.utilSvc.generateJWT(newPayload, '1h');
    const refresh_token = await this.utilSvc.generateJWT(newPayload, '7d');
    const hashRT = await this.utilSvc.hashPassword(refresh_token);

    await this.authSvc.updateHash(user.id, hashRT);

    return { access_token, refresh_token };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const session = request['user'];
    await this.authSvc.updateHash(session.id, null);
  }
}