import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }
  @UseGuards(AccessTokenGuard)

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }
  @UseGuards(AccessTokenGuard)

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
