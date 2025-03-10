import {  IsInt, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateTeacherReviewDto {
  @IsNumber()
  teacher_id: bigint;

  @IsNumber()
  parent_id: bigint;

  @IsString()
  message: string;

  @IsInt()
  rating: number;

  @IsDate()
  written_at: Date;
}
