import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminModule } from "../admin/admin.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TeacherModule } from "src/teacher/teacher.module";
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from "src/common/strategies/jwt.strategy";
import { AdminRefreshTokenGuard } from "src/common/guards";
import { SuperAdminRefreshTokenCookieStrategy } from "src/common/strategies/admin-refresh-token.strategy copy";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is globally available
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                try {
                    return {
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '15h' },
                    };
                } catch (error) {
                    console.error('Error configuring JWT module:', error);
                    throw error;
                }
            },
            inject: [ConfigService],
            global: true,
        }),
        TeacherModule,
        PrismaModule,
        AdminModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        AdminService, 
        JwtService, 
        PrismaService, 
        JwtStrategy, 
        JwtModule, 
        AdminRefreshTokenGuard, 
        SuperAdminRefreshTokenCookieStrategy
    ],
})
export class AuthModule {}
