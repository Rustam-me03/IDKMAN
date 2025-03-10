import { Injectable } from '@nestjs/common';
import { CreateTeacherReviewDto, UpdateTeacherReviewDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherReviewDto: CreateTeacherReviewDto) {
    const data = {
      ...createTeacherReviewDto,
      teacher_id: Number(createTeacherReviewDto.teacher_id),
      parent_id: Number(createTeacherReviewDto.parent_id),
    };
    return this.prisma.teacherReview.create({ data });
  }

  async findAll() {
    return this.prisma.teacherReview.findMany();
  }

  async findOne(id: number) {
    return this.prisma.teacherReview.findUnique({ where: { id } });
  }

  async update(id: number, updateTeacherReviewDto: Partial<UpdateTeacherReviewDto>) {
    const data = {
      ...updateTeacherReviewDto,
      teacher_id: updateTeacherReviewDto.teacher_id !== undefined ? Number(updateTeacherReviewDto.teacher_id) : undefined,
      parent_id: updateTeacherReviewDto.parent_id !== undefined ? Number(updateTeacherReviewDto.parent_id) : undefined,
    };
    return this.prisma.teacherReview.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.teacherReview.delete({ where: { id } });
  }
}