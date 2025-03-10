import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePreschoolerDto } from './dto';

@Injectable()
export class PreschoolerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePreschoolerDto) {
    return this.prisma.preschooler.create({ data: dto });
  }

  async findAll() {
    return this.prisma.preschooler.findMany();
  }

  async findOne(id: number) {
    return this.prisma.preschooler.findUnique({ where: { id } });
  }

  async update(id: number, dto: Partial<CreatePreschoolerDto>) {
    return this.prisma.preschooler.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.preschooler.delete({ where: { id } });
  }
}
