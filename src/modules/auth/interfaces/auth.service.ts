import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public login() {
    return 'Sesión iniciada';
  }
}
