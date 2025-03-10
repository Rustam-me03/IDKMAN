import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), // Берем refreshToken из тела запроса
            secretOrKey: process.env.JWT_REFRESH_SECRET, // Используем секрет для refresh-токенов
            passReqToCallback: true, // Передаем request в validate
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token отсутствует');
        }
        return { ...payload, refreshToken }; // Возвращаем пользователя и сам токен
    }
}
