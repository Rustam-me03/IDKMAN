import { IsNumber } from 'class-validator';

export class CreateGruopPreschoolerDto {
  @IsNumber()
  group_id: number;

  @IsNumber()
  preschooler_id: number;
}
