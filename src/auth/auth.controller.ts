import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminSignInDto, CreateAdminDto } from '../admin/dto';
import { ResponseFields } from '../common/types';
import { RefreshTokenGuard } from '../common/guards';
import { AdminRefreshTokenGuard } from '../common/guards/admin-refresh-token.guard';
import { CookieGetter } from 'src/decorators/cookie-getter.decorator';
import { CreateTeacherDto } from 'src/teacher/dto/create-teacher.dto';
import { UpdateTeacherDto } from 'src/teacher/dto/update-teacher.dto';
import { TeacherSignInDto } from 'src/teacher/dto/sign_in-teacher.dto';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Yangi foydalanuvchilarni ro'yxatdan o'tkazish" })
  @Post('sign-up')
  signUp(@Body() createTeacherDto: CreateTeacherDto) {
    return this.authService.signUp(createTeacherDto)
  }

  @ApiOperation({ summary: "Tizimga kirish" })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(
    @Body() teacherSignInDto: TeacherSignInDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.signIn(teacherSignInDto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("sign-out")
  signout(
    @GetCurrentUserId() teacherId : number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(+teacherId, res)
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  refresh(
    @GetCurrentUserId() teacherId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshToken(+teacherId, refreshToken, res);
  }
  
  
  @ApiOperation({ summary: "Yangi admin ro'yxatdan o'tkazish" })
  @Post('admin/sign-up')
  signUpAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.adminSignUp(createAdminDto)
  }
  
  @ApiOperation({ summary: "Admin tizimga kirish" })
  @HttpCode(HttpStatus.OK)
  @Post('admin/sign-in') // Changed from '/admin/sign-in' to 'admin/sign-in'
  adminSignIn(
    @Body() adminSignInDto: AdminSignInDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.adminSignIn(adminSignInDto, res);
  }
  
  @UseGuards(AdminRefreshTokenGuard)
  @Get("admin/sign-out")
  AdminSignout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.AdminSignOut(refreshToken, res)
  }
  
  
  @UseGuards(AdminRefreshTokenGuard)
  @Get("admin/refresh")
  AdminRefresh(
    @GetCurrentUserId() id: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.AdminRefreshToken(+id, refreshToken, res);
  }
  
}
