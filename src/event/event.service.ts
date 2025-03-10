import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';


@Injectable()
export class EventService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createEventDto: CreateEventDto) {
        return await this.prisma.event.create({
            data: createEventDto,
        });
    }

    async findAll() {
        return await this.prisma.event.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.event.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateEventDto: UpdateEventDto) {
        return await this.prisma.event.update({
            where: { id },
            data: updateEventDto,
        });
    }

    async remove(id: number) {
        return await this.prisma.event.delete({
            where: { id },
        });
    }
}
