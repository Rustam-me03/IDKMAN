import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";
import { Teacher } from '@prisma/client'; // Import Teacher type

@Injectable()
export class TeacherService {
    constructor(private readonly prismaService: PrismaService) { }
    async create(createteacherDto: CreateTeacherDto) {
        if (createteacherDto.password != createteacherDto.confirm_password) {
            throw new BadRequestException("parollar mos emas");
        }
        const hashedPassword = await bcrypt.hash(createteacherDto.password, 7);
        const birthday = new Date(createteacherDto.birthday);
        if (isNaN(birthday.getTime())) {
            throw new BadRequestException("Invalid birthday format");
        }
        const data = {
            first_name: createteacherDto.first_name,
            last_name: createteacherDto.last_name,
            birthday,
            phone_number: createteacherDto.phone_number,
            gender: createteacherDto.gender,
            email: createteacherDto.email,
            password: hashedPassword,
            confirm_password: createteacherDto.confirm_password,
            hire_date: new Date(),
        };
        const newteacher = await this.prismaService.teacher.create({ data });
        return newteacher;
    }

    findAll() {
        return this.prismaService.teacher.findMany(); // Corrected property access
    }

    async findOne(id: number) {
        const teacher = await this.prismaService.teacher.findUnique({
            where: { id },
        });
        if (!teacher) {
            throw new NotFoundException("Bunday yo'q");
        }
        return teacher;
    }
    async findByEmail(email: string): Promise<Teacher | null> {
        return this.prismaService.teacher.findUnique({
            where: { email },
        });
    }

    async update(id: number, updateteacherDto: UpdateTeacherDto) {
        this.findOne(id);
        return this.prismaService.teacher.update({
            where: { id },
            data: { ...updateteacherDto },
        });
    }

    async remove(id: number) {
        const teacher = await this.findOne(id);
        return this.prismaService.teacher.delete({ where: { id } });
    }

    async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
        const updatedteacher = await this.prismaService.teacher.update(
            {
                where: { id },
                data: { hashed_refresh_token: hashed_refresh_token },
            }
        );

        return updatedteacher;
    }
}
