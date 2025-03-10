import { Module } from '@nestjs/common';
import { ParentAndPresschoolerService } from './parent_and_presschooler.service';
import { ParentAndPresschoolerController } from './parent_and_presschooler.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentAndPresschoolerController],
  providers: [ParentAndPresschoolerService],
})
export class ParentAndPresschoolerModule {}
