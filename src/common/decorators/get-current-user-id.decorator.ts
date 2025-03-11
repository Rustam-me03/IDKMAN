import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { JwtPayload } from "../types";

export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number | null => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;

        console.log("user: ", user);
        return user?.id || null; // Вместо ошибки возвращаем `null`
    }
);

