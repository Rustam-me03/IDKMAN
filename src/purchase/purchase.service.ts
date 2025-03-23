import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePointsDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePointsDto) {
    return this.prisma.points.create({
      data: {
        ...dto,
        granted_at: new Date(dto.granted_at),
      }
    });
  }

  async findAll() {
    return this.prisma.points.findMany();
  }

  async findOne(id: number) {
    return this.prisma.points.findUnique({ where: { id } });
  }

  async update(id: number, dto: Partial<UpdatePurchaseDto>) {
    return this.prisma.points.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.points.delete({ where: { id } });
  }
}
