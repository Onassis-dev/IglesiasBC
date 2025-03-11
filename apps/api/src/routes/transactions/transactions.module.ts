import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, ContextProvider],
})
export class TransactionsModule {}
