import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, IsDate } from "class-validator";

export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    min_age: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    max_age: number;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    created_at: Date;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    main_teacher_id: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    support_teacher_id: number;
}
