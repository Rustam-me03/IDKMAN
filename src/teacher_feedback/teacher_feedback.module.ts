import { Module } from '@nestjs/common';
import { TeacherFeedbackService } from './teacher_feedback.service';
import { TeacherFeedbackController } from './teacher_feedback.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherFeedbackController],
  providers: [TeacherFeedbackService],
})
export class TeacherFeedbackModule { }
