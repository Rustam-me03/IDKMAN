import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
        private readonly configService: ConfigService,
        private readonly adminService: AdminService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { id: number }) {
        console.log("Admin JWT Payload:", payload); // 🔍 Логируем что приходит в токене

        const admin = await this.adminService.findOne(payload.id);
        if (!admin) {
            throw new UnauthorizedException('Admin not found or authentication failed');
        }
        return admin; // Доступен как `req.user`
    }
}
