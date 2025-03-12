import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { CreateAdminDto, AdminSignInDto } from "../admin/dto";
import { AdminService } from "../admin/admin.service";
import { ResponseFields, Tokens } from "../common/types";
import { PrismaService } from "../prisma/prisma.service";
import { TeacherService } from "src/teacher/teacher.service";
import { CreateTeacherDto } from "src/teacher/dto/create-teacher.dto";
import { TeacherSignInDto } from "src/teacher/dto/sign_in-teacher.dto";
import { Teacher } from "@prisma/client";


@Injectable()
export class AuthService {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    async getTokens(teacher: Teacher): Promise<Tokens> {
        if (!process.env.ACCESS_TOKEN_KEY || !process.env.REFRESH_TOKEN_KEY) {
            throw new InternalServerErrorException("JWT secrets are missing!");
        }

        const payload = { id: teacher.id, email: teacher.email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME,
            }),
        ]);

        return { access_token: accessToken, refresh_token: refreshToken };
    }


    async signUp(createTeacherDto: CreateTeacherDto) {
        const candidate = await this.teacherService.findByEmail(
            createTeacherDto.email
        );
        if (candidate) {
            throw new BadRequestException("Bunday foydalanuvchi mavjud");
        }
        const newteacher = await this.teacherService.create(createTeacherDto);

        const response = {
            message:
                "Tabriklayman tizimga qo'shildingin",
            teacherId: newteacher.id,
        };

        return response;
    }

    async signIn(teacherSignInDto: TeacherSignInDto, res: Response): Promise<ResponseFields> {
        const { email, password } = teacherSignInDto;

        if (!email || !password) {
            throw new BadRequestException();
        }

        const teacher = await this.teacherService.findByEmail(email);

        if (!teacher) {
            throw new UnauthorizedException("Invalid Email or password");
        }
        const validPassword = await bcrypt.compare(
            teacherSignInDto.password,
            teacher.password
        );
        if (!validPassword) {
            throw new UnauthorizedException("Invalid Email or password");
        }

        const tokens = await this.getTokens(teacher);

        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        const updateteacher = await this.teacherService.updateRefreshToken(
            teacher.id,
            hashed_refresh_token
        );
        if (!updateteacher) {
            throw new InternalServerErrorException("Tokenni saqlashda xatolik");
        }
        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: Number(process.env.COOKIE_TIME) || 15 * 24 * 60 * 60 * 1000, // Ensure maxAge is a valid number
            httpOnly: true,
        });
        const response = {
            id: teacher.id,
            access_token: tokens.access_token,
            reshresh_token: tokens.refresh_token
        };

        return response;
    }

    async signOut(req: Request, res: Response): Promise<{ message: string }> {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException("No refresh token provided");
        }

        const decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_KEY });
        const teacherId = decodedToken.id;

        const teacher = await this.teacherService.findOne(teacherId);
        if (!teacher || !teacher.hashed_refresh_token) {
            throw new ForbiddenException("Invalid or missing refresh token");
        }

        await this.teacherService.updateRefreshToken(teacher.id, null);
        res.clearCookie("refresh_token");

        return { message: "Teacher logged out successfully" };
    }

    async adminSignUp(createAdminDto: CreateAdminDto) {
        const candidate = await this.adminService.findByEmail(createAdminDto.email);
        if (candidate) {
            throw new BadRequestException("Bunday Admin mavjud")
        }
        const newAdmin = await this.adminService.create(createAdminDto);

        const response = {
            message: "Tabriklayman tizimga qo'shildingin",
            adminId: newAdmin.id
        }

        return response
    }


    async adminSignIn(adminSignInDto: AdminSignInDto, res: Response): Promise<ResponseFields> {

        const { email, password } = adminSignInDto

        if (!email || !password) {
            throw new BadRequestException()
        }

        const admin = await this.adminService.findByEmail(email)

        if (!admin) {
            throw new UnauthorizedException('Invalid Email or password')
        }
        // if (!admin.is_active) {
        //     throw new UnauthorizedException('admin is not activate')
        // }
        const validPassword = await bcrypt.compare(adminSignInDto.password, admin.hashed_password)
        if (!validPassword) {
            throw new UnauthorizedException('Invalid Email or password')
        }

        const tokens = await this.adminService.getToken(admin);

        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7)

        const updateAdmin = await this.adminService.updateRefreshToken(
            admin.id,
            hashed_refresh_token
        )
        if (!updateAdmin) {
            throw new InternalServerErrorException("Tokenni saqlashda xatolik")
        }
        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: Number(process.env.COOKIE_TIME) || 15 * 24 * 60 * 60 * 1000, // Ensure maxAge is a valid number
            httpOnly: true
        })
        const response = {
            id: admin.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };

        return response
    }


    async adminSignOut(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken) {
                throw new BadRequestException("No refresh token provided");
            }

            const decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_KEY });

            console.log("Decoded token:", decodedToken);

            const adminId = decodedToken.id;
            if (!adminId || isNaN(adminId)) { // Added check for valid adminId
                throw new UnauthorizedException("Invalid admin ID");
            }

            const admin = await this.adminService.findOne(adminId);
            if (!admin) {
                throw new NotFoundException("Admin not found");
            }

            // Clear refresh token in DB
            await this.adminService.updateRefreshToken(admin.id, null);

            // Clear refresh token from cookies
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            return { message: "Admin logged out successfully" };
        } catch (error) {
            console.error("Admin sign-out error:", error);
            throw new ForbiddenException("Logout failed");
        }
    }





    async AdminRefreshToken(p0: number, refreshToken: string, res: Response): Promise<ResponseFields> {
        if (!refreshToken) {
            throw new UnauthorizedException("No refresh token provided");
        }

        let decodedToken;
        try {
            decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_KEY });
        } catch (error) {
            throw new UnauthorizedException("Invalid token");
        }

        const adminId = decodedToken.id;
        if (!adminId) {
            throw new BadRequestException("Invalid token structure");
        }

        const admin = await this.adminService.findOne(adminId);
        if (!admin || !admin.hashed_refreshToken) {
            throw new BadRequestException("Admin not found");
        }

        const tokenMatch = await bcrypt.compare(refreshToken, admin.hashed_refreshToken);
        if (!tokenMatch) {
            throw new ForbiddenException("Forbidden");
        }

        const tokens = await this.adminService.getToken(admin);
        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        await this.adminService.updateRefreshToken(admin.id, hashed_refresh_token);

        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return {
            id: admin.id,
            access_token: tokens.access_token,
        };
    }


    async refreshToken(id: number, refreshToken: string, res: Response): Promise<ResponseFields> {
        const decodedToken = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_KEY });

        if (Number(id) !== decodedToken["id"]) {
            throw new BadRequestException("Ruxsat etilmagan");
        }

        const teacher = await this.teacherService.findOne(Number(id));
        if (!teacher || !teacher.hashed_refresh_token) {
            throw new BadRequestException("teacher not found");
        }

        const tokenMatch = await bcrypt.compare(refreshToken, teacher.hashed_refresh_token);
        if (!tokenMatch) {
            throw new ForbiddenException("Forbidden");
        }

        const tokens = await this.getTokens(teacher);
        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        await this.teacherService.updateRefreshToken(teacher.id, hashed_refresh_token);

        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return { id: teacher.id, access_token: tokens.access_token };
    }
}