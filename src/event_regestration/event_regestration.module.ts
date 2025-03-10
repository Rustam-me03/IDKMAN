import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventRegistrationService } from './event_regestration.service';
import { EventRegistrationController } from './event_regestration.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
})
export class EventRegestrationModule {}
