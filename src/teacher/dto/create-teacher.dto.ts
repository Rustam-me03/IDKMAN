import { IsString, IsInt, IsOptional, IsBoolean, IsDate, IsEmail } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsString()
  old_work?: string;

  @IsString()
  phone_number: string;

  @IsDate()
  hire_date: Date;

  @IsEmail()
  email: string;

  @IsString()
  gender: string;

  @IsString()
  password: string;

  @IsString()
  confirm_password: string;

  @IsOptional()
  @IsString()
  hashed_refresh_token?: string;

  @IsOptional()
  @IsInt()
  avg_rating?: number;

  @IsBoolean()
  is_main: boolean;
}
