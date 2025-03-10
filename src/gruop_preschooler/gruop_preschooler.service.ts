import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGruopPreschoolerDto } from './dto';

@Injectable()
export class GroupPreschoolerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGruopPreschoolerDto) {
    return this.prisma.groupPreschooler.create({ data: dto });
  }

  async findAll() {
    return this.prisma.groupPreschooler.findMany();
  }

  async findOne(id: number) {
    return this.prisma.groupPreschooler.findUnique({ where: { id } });
  }


  async delete(id: number) {
    return this.prisma.groupPreschooler.delete({ where: { id } });
  }
}
