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
import { LogsService } from 'src/modules/logs/interfaces/logs.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
    private readonly logsSvc: LogsService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user) {
      await this.logsSvc.createLog({
        status_code: 401,
        path: '/api/auth/login',
        error: 'Credenciales incorrectas',
        error_code: 'INVALID_CREDENTIALS',
        session_id: null,
      });
      throw new UnauthorizedException({
        message: 'El usuario y/o contraseña es incorrecto',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    if (!(await this.utilSvc.checkPassword(password, user.password))) {
      await this.logsSvc.createLog({
        status_code: 401,
        path: '/api/auth/login',
        error: 'Credenciales incorrectas',
        error_code: 'INVALID_CREDENTIALS',
        session_id: null,
      });
      throw new UnauthorizedException({
        message: 'El usuario y/o contraseña son incorrectos',
        errorCode: 'INVALID_CREDENTIALS',
      });
    }

    const { password: _pwd, refreshToken: _rt, ...payload } = user;

    const access_token = await this.utilSvc.generateJWT(payload, '1h');
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
    const hashRT = await this.utilSvc.hashPassword(refresh_token);

    await this.authSvc.updateHash(user.id, hashRT);

    return { access_token, refresh_token };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    return request['user'];
  }

  @Post('/refresh')
  public async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    let payload: any;
    try {
      payload = await this.utilSvc.getPayload(body.refreshToken);
    } catch {
      throw new ForbiddenException({
        message: 'Refresh token inválido o expirado',
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }

    const user = await this.authSvc.getUserById(payload.id);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException({
        message: 'Acceso denegado',
        errorCode: 'ACCESS_DENIED',
      });
    }

    const rtValido = await this.utilSvc.checkPassword(body.refreshToken, user.refreshToken);
    if (!rtValido) {
      throw new ForbiddenException({
        message: 'Refresh token inválido',
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }

    const { password: _pwd, refreshToken: _rt, ...newPayload } = user;

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