import { IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsInt()
  check_in_time: number;

  @IsInt()
  check_out_time: number;

  @IsInt()
  preschooler_id: number;
}

