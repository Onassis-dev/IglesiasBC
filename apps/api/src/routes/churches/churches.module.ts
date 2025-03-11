import { Module } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { ChurchesController } from './churches.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [ChurchesController],
  providers: [ChurchesService, ContextProvider],
})
export class ChurchesModule {}
