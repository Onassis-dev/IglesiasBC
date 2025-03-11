import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, ContextProvider],
})
export class InventoryModule {}
