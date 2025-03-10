import { PartialType } from '@nestjs/swagger';
import { CreateGruopPreschoolerDto } from './create-gruop_preschooler.dto';

export class UpdateGruopPreschoolerDto extends PartialType(CreateGruopPreschoolerDto) {}
