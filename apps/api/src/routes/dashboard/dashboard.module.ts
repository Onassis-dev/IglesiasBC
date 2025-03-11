import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [ContextProvider, DashboardService],
})
export class DashboardModule {}
