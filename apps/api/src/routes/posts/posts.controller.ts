import {
  Controller,
  UseGuards,
  Post,
  Put,
  Get,
  Delete,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  DeleteSchema,
  EditPostSchema,
  PostPostSchema,
  getPostSchema,
  GetOnePostSchema,
} from '@iglesiasbc/schemas';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(new AuthGuard('blog'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  read(@Query(new ZodPiPe(getPostSchema)) query) {
    return this.postsService.get(query);
  }

  @Get(':id')
  readOne(@Param(new ZodPiPe(GetOnePostSchema)) param) {
    return this.postsService.getOne(param);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(800))
  create(
    @Query(new ZodPiPe(PostPostSchema)) query,
    @UploadedFile() file: File,
  ) {
    return this.postsService.post(query, file);
  }

  @Put()
  @UseInterceptors(FileInterceptor('image'), new ImageHandler(800))
  edit(@Query(new ZodPiPe(EditPostSchema)) query, @UploadedFile() file: File) {
    return this.postsService.edit(query, file);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.postsService.delete(param);
  }

  @Get('stats')
  getStats() {
    return this.postsService.getStats();
  }
}
