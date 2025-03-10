import {  IsString, IsDate, IsEnum, IsNumber } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class CreatePreschoolerDto {
  @IsNumber()
  id: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDate()
  registration_date: Date;

  @IsDate()
  born_date: Date;

  @IsEnum(Gender)
  gender: Gender;
}
