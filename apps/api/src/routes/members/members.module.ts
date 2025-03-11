import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [MembersController],
  providers: [MembersService, ContextProvider],
})
export class MembersModule {}
