import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
    handleRequest(err, user, info, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log("Cookies:", request.cookies);
        console.log("Authorization Header:", request.headers.authorization);
        
        if (err || !user) {
            throw new UnauthorizedException("Invalid or missing refresh token");
        }
        return user;
    }
}

