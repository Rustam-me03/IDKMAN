import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private teacherService: TeacherService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Foydalanuvchi topilmadi');
        }

        try {
            // Refresh user data
            const refreshedUser = await this.refreshUser(user);

            if (!refreshedUser.is_creator) {
                throw new ForbiddenException("Sizda ruxsat yo'q");
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException('Foydalanuvchi ma\'lumotlarini yangilashda xatolik yuz berdi');
        }
    }

    private async refreshUser(user: any): Promise<any> {
        // Logic to refresh user data
        return this.teacherService.findOne(user.id); // Adjust the method as necessary
    }
}
