import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService], // Export TeacherService
})
export class TeacherModule {}
