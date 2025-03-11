import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res, UseGuards, UnauthorizedException, Req, ForbiddenException } from '@nestjs/common';
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
import { TeacherService } from 'src/teacher/teacher.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly teacherService: TeacherService
  ) { }

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
  async signout(
      @GetCurrentUserId() teacherId: number | null,
      @Res({ passthrough: true }) res: Response
  ) {
      if (!teacherId) {
          return { message: "No user to log out" };
      }
  
      const teacher = await this.teacherService.findOne(teacherId);
      if (!teacher || !teacher.hashed_refresh_token) {
          throw new ForbiddenException("Invalid or missing refresh token");
      }
  
      await this.teacherService.updateRefreshToken(teacher.id, null);
      res.clearCookie("refresh_token");
  
      return { message: "Teacher logged out successfully" };
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

  @Post("admin/sign-out")
  async adminSignOut(@Req() req: any, @Res() res: Response) { // Changed type of req to any
    const adminId = req.user?.id;
    console.log("Admin ID from request:", adminId);

    if (!adminId || isNaN(adminId)) { // Added check for valid adminId
      throw new UnauthorizedException("Invalid admin ID");
    }

    return this.authService.AdminSignOut(adminId, res);
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
