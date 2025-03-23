import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PreschoolerService } from './preschooler.service';
import { CreatePreschoolerDto } from './dto/create-preschooler.dto';
import { UpdatePreschoolerDto } from './dto/update-preschooler.dto';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('preschooler')
export class PreschoolerController {
  constructor(private readonly preschoolerService: PreschoolerService) {}
  @UseGuards(AccessTokenGuard)
  @Post("create")
  create(@Body() createPreschoolerDto: CreatePreschoolerDto) {
    return this.preschoolerService.create(createPreschoolerDto);
  }

  @Get("all")
  findAll() {
    return this.preschoolerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preschoolerService.findOne(Number(id)); // ✅ Преобразуем в `number`
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreschoolerDto: UpdatePreschoolerDto) {
    return this.preschoolerService.update(+id, updatePreschoolerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preschoolerService.remove(+id);
  }
}
