import { Module } from '@nestjs/common';
import { PreschoolerService } from './preschooler.service';
import { PreschoolerController } from './preschooler.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PreschoolerController],
  providers: [PreschoolerService],
})
export class PreschoolerModule {}
