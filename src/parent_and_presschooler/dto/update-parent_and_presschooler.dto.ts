import { PartialType } from '@nestjs/swagger';
import { CreateParentAndPresschoolerDto } from './create-parent_and_presschooler.dto';

export class UpdateParentAndPresschoolerDto extends PartialType(CreateParentAndPresschoolerDto) {}
