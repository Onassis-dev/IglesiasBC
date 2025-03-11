import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, ContextProvider],
})
export class PermissionsModule {}
