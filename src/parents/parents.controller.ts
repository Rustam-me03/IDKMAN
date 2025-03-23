import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(+id);
  }
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(+id, updateParentDto);
  }
  @UseGuards(AccessTokenGuard)

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentsService.remove(+id);
  }
}
