import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { TeacherService } from 'src/teacher/teacher.service';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';
import { JwtRefreshStrategy } from 'src/common/strategies';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }) // Ensure ConfigModule is global
  ],
  controllers: [AdminController],
  providers: [
    {
      provide: AdminService,
      useFactory: async (prismaService: PrismaService, jwtService: JwtService) => {
        try {
          return new AdminService(prismaService, jwtService);
        } catch (error) {
          console.error('Error creating AdminService:', error);
          throw error;
        }
      },
      inject: [PrismaService, JwtService],
    },
    JwtService,
    JwtRefreshStrategy,
    TeacherService,
    JwtStrategy,
    SuperAdminGuard
  ],
  exports: [
    JwtService,
    AdminService,
    TeacherService,
    SuperAdminGuard
  ]
})
export class AdminModule {}
