import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

    public async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, encryptedPassword: string) {
        return await bcrypt.compare(password, encryptedPassword);
    }

}