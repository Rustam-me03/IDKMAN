import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private adminService: AdminService) {} // Corrected service injection

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Foydalanuvchi topilmadi');
        }

        const refreshedUser = await this.refreshUser(user);

        if (!refreshedUser || !refreshedUser.is_creator) {
            throw new ForbiddenException("Sizda ruxsat yo'q");
        }

        return true;
    }

    private async refreshUser(user: any): Promise<any> {
        const foundUser = await this.adminService.findOne(user.id); // Corrected service method call
        if (!foundUser) {
            throw new UnauthorizedException("Foydalanuvchi ma'lumotlari yangilanmadi");
        }
        return foundUser;
    }
}
