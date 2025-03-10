import { Injectable } from '@nestjs/common';
import { CreateParentAndPresschoolerDto } from './dto/create-parent_and_presschooler.dto';
import { UpdateParentAndPresschoolerDto } from './dto/update-parent_and_presschooler.dto';

@Injectable()
export class ParentAndPresschoolerService {
  create(createParentAndPresschoolerDto: CreateParentAndPresschoolerDto) {
    return 'This action adds a new parentAndPresschooler';
  }

  findAll() {
    return `This action returns all parentAndPresschooler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parentAndPresschooler`;
  }

  update(id: number, updateParentAndPresschoolerDto: UpdateParentAndPresschoolerDto) {
    return `This action updates a #${id} parentAndPresschooler`;
  }

  remove(id: number) {
    return `This action removes a #${id} parentAndPresschooler`;
  }
}
