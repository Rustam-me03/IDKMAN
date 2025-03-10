import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const data = {
      ...createAttendanceDto,
      check_in_time: new Date(createAttendanceDto.check_in_time),
      check_out_time: createAttendanceDto.check_out_time !== undefined ? new Date(createAttendanceDto.check_out_time) : undefined,
    };
    return this.prisma.attendance.create({ data });
  }

  async findAll() {
    return this.prisma.attendance.findMany();
  }

  async findOne(id: number) {
    return this.prisma.attendance.findUnique({ where: { id } });
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const data = {
      ...updateAttendanceDto,
      check_in_time: updateAttendanceDto.check_in_time !== undefined ? new Date(updateAttendanceDto.check_in_time) : undefined,
      check_out_time: updateAttendanceDto.check_out_time !== undefined ? new Date(updateAttendanceDto.check_out_time) : undefined,
    };
    return this.prisma.attendance.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.attendance.delete({ where: { id } });
  }
}