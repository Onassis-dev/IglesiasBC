import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, ContextProvider],
})
export class ClassesModule {}
