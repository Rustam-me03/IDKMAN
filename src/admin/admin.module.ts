import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from 'src/common/strategies';
import { TeacherService } from 'src/teacher/teacher.service';
import { SuperAdminGuard } from 'src/common/guards/super-admin.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }) // Ensure ConfigModule is global
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtService, RefreshJwtStrategy, TeacherService, SuperAdminGuard],
  exports: [AdminService, TeacherService, SuperAdminGuard]
})
export class AdminModule {}
