import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentAndPresschoolerService } from './parent_and_presschooler.service';
import { CreateParentAndPresschoolerDto } from './dto/create-parent_and_presschooler.dto';
import { UpdateParentAndPresschoolerDto } from './dto/update-parent_and_presschooler.dto';

@Controller('parent-and-presschooler')
export class ParentAndPresschoolerController {
  constructor(private readonly parentAndPresschoolerService: ParentAndPresschoolerService) {}

  @Post()
  create(@Body() createParentAndPresschoolerDto: CreateParentAndPresschoolerDto) {
    return this.parentAndPresschoolerService.create(createParentAndPresschoolerDto);
  }

  @Get()
  findAll() {
    return this.parentAndPresschoolerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentAndPresschoolerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentAndPresschoolerDto: UpdateParentAndPresschoolerDto) {
    return this.parentAndPresschoolerService.update(+id, updateParentAndPresschoolerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentAndPresschoolerService.remove(+id);
  }
}
