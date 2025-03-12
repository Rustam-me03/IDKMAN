import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherController],
  providers: [
    {
      provide: TeacherService,
      useFactory: async (prismaService: PrismaService) => {
        try {
          return new TeacherService(prismaService);
        } catch (error) {
          console.error('Error creating TeacherService:', error);
          throw error;
        }
      },
      inject: [PrismaService],
    },
    AdminService,
  ],
  exports: [TeacherService], // Export TeacherService
})
export class TeacherModule {}
