import { Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [PresentationsController],
  providers: [PresentationsService, ContextProvider],
})
export class PresentationsModule {}
