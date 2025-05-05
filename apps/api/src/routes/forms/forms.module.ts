import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [FormsController],
  providers: [FormsService, ContextProvider],
})
export class FormsModule {}
