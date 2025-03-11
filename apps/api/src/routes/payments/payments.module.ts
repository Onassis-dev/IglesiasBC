import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ContextProvider],
})
export class PaymentsModule {}
