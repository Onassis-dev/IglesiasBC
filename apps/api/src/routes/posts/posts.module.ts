import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ContextProvider } from 'src/interceptors/contextProvider';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ContextProvider],
})
export class PostsModule {}
