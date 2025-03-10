import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentsController],
  providers: [
    {
      provide: ParentsService,
      useFactory: async () => {
        try {
          return new ParentsService();
        } catch (error) {
          console.error('Error creating ParentsService:', error);
          throw error;
        }
      },
    },
  ],
})
export class ParentsModule {}
