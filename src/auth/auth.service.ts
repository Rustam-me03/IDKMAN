import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Response } from "express";
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
        private readonly userService: TeacherService,
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async getTokens(teacher: Teacher): Promise<Tokens> {
        const payload = {
            id: teacher.id,
            email: teacher.email,
        };
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

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async signUp(createTeacherDto: CreateTeacherDto) {
        const candidate = await this.userService.findByEmail(
            createTeacherDto.email
        );
        if (candidate) {
            throw new BadRequestException("Bunday foydalanuvchi mavjud");
        }
        const newUser = await this.userService.create(createTeacherDto);

        const response = {
            message:
                "Tabriklayman tizimga qo'shildingin",
            userId: newUser.id,
        };

        return response;
    }

    async signIn(teacherSignInDto: TeacherSignInDto, res: Response): Promise<ResponseFields> {
        const { email, password } = teacherSignInDto;

        if (!email || !password) {
            throw new BadRequestException();
        }

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Invalid Email or password");
        }
        const validPassword = await bcrypt.compare(
            teacherSignInDto.password,
            user.hashedPassword
        );
        if (!validPassword) {
            throw new UnauthorizedException("Invalid Email or password");
        }

        const tokens = await this.getTokens(user);

        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        const updateUser = await this.userService.updateRefreshToken(
            user.id,
            hashed_refresh_token
        );
        if (!updateUser) {
            throw new InternalServerErrorException("Tokenni saqlashda xatolik");
        }
        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });
        const response = {
            id: user.id,
            access_token: tokens.access_token,
        };

        return response;
    }

    async signOut(userId : number, res: Response) {

        const user = await this.prismaService.user.updateMany({
            where: {
                id: userId,
                hashedToken: {
                    not: null,
                },
            },
            data: {
                hashedToken: null,
            },
        });
        
        if(!user){
            throw new ForbiddenException("Access Deied")
        }

        res.clearCookie("refresh_token");

        const response = {
            message: "User logged out successfully",
        };
        return response;
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
            maxAge: 15 * 24 * 60 * 60 * 100,
            httpOnly: true
        })
        const response = {
            id: admin.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };

        return response
    }
    async AdminSignOut(refreshToken: string, res: Response) {
        const adminData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });
        if (!adminData) {
            throw new ForbiddenException("Admin not verified");
        }
        const hashed_refresh_token = null;
        await this.adminService.updateRefreshToken(
            adminData.id,
            hashed_refresh_token
        );

        res.clearCookie("refresh_token");

        const response = {
            message: "Admin logged out successfully",
        };
        return response;
    }


    async AdminRefreshToken(id: number, refreshToken: string, res: Response): Promise<ResponseFields> {
        const decodedToken = await this.jwtService.decode(refreshToken);

        if (id != decodedToken["id"]) {
            throw new BadRequestException("Ruxsat etilmagan");
        }

        const admin = await this.adminService.findOne(+id);
        if (!admin || !admin.hashed_refreshToken) {
            throw new BadRequestException("Admin not found");
        }

        const tokenMatch = await bcrypt.compare(refreshToken, admin.hashed_refreshToken);

        if (!tokenMatch) {
            throw new ForbiddenException("Forbidden");
        }

        const tokens = await this.adminService.getToken(admin);

        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        await this.adminService.updateRefreshToken(
            admin.id,
            hashed_refresh_token
        );

        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true,
        });
        const response = {
            id: admin.id,
            access_token: tokens.access_token,
        };
        return response;
    }

    async refreshToken(id: number, refreshToken: string, res: Response): Promise<ResponseFields> {
        const decodedToken = await this.jwtService.decode(refreshToken);
        
        if (id != decodedToken["id"]) {
            throw new BadRequestException("Ruxsat etilmagan");
        }

        const user = await this.userService.findOne(+id);
        if (!user || !user.hashedToken) {
            throw new BadRequestException("user not found");
        }

        const tokenMatch = await bcrypt.compare(refreshToken, user.hashedToken);

        if (!tokenMatch) {
            throw new ForbiddenException("Forbidden");
        }

        const tokens = await this.getTokens(user);

        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

        await this.userService.updateRefreshToken(
            user.id,
            hashed_refresh_token
        );

        res.cookie("refresh_token", tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true,
        });
        const response = {
            id: user.id,
            access_token: tokens.access_token,
        };
        return response;
    }
}
