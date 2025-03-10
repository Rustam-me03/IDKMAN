import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherFeedbackDto, UpdateTeacherFeedbackDto } from './dto';


@Injectable()
export class TeacherFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeacherFeedbackDto) {
    return this.prisma.teacherFeedback.create({ data: dto });
  }

  async findAll() {
    return this.prisma.teacherFeedback.findMany();
  }

  async findOne(id: number) {
    return this.prisma.teacherFeedback.findUnique({ where: { id } });
  }

  async update(id: number, dto: Partial<UpdateTeacherFeedbackDto>) {
    return this.prisma.teacherFeedback.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.teacherFeedback.delete({ where: { id } });
  }
}
