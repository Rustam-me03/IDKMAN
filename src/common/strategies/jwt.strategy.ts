import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly teacherService: TeacherService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { id: number }) {
        const user = await this.teacherService.findOne(payload.id);
        if (!user) {
            throw new UnauthorizedException('Foydalanuvchi topilmadi yoki autentifikatsiya muvaffaqiyatsiz');
        }
        return user; // Доступен как `request.user`
    }
}
