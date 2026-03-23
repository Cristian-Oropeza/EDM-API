import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

    constructor(private readonly jwtService: JwtService) { }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
    //2 metodos
    public async generateJWT(payload :  any, expiresIn: any = '60s'){ 
        return await this.jwtService.signAsync(payload, {
            expiresIn: expiresIn
        });
    }

    public async getPayLoad(token: string) {
        return await this.jwtService.decode(token);
     }


}