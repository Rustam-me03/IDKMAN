import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, IsDate } from "class-validator";

export class CreateEventDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    admin_id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string; 

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    max_preschooler: number;
}
