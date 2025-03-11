import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { BuilderController } from './builder.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [BuilderController],
  providers: [BuilderService, ContextProvider],
})
export class BuilderModule {}
