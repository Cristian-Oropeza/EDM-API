import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UtilService } from "../services/util.service";

export class AuthGuard implements CanActivate {
    constructor(private readonly utilSvc: UtilService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.utilSvc.getPayLoad(token);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }
    
}