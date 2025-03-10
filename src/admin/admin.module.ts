import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from 'src/common/strategies';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }) // Ensure ConfigModule is global
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtService, RefreshJwtStrategy],
  exports: [AdminService]
})
export class AdminModule {}
