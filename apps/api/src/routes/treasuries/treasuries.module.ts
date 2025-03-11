import { Module } from '@nestjs/common';
import { TreasuriesService } from './treasuries.service';
import { TreasuriesController } from './treasuries.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [TreasuriesController],
  providers: [TreasuriesService, ContextProvider],
})
export class TreasuriesModule {}
