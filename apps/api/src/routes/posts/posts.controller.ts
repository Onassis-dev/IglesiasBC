import {
  Controller,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';

import { FileInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';
import { postsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ImageHandler } from 'src/interceptors/files/image.interceptor';

@Controller()
@UseGuards(new AuthGuard('blog'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @TsRestHandler(postsContract.get)
  read() {
    return tsRestHandler(postsContract.get, async ({ query }) =>
      this.postsService.get(query),
    );
  }

  @TsRestHandler(postsContract.getOne)
  readOne() {
    return tsRestHandler(postsContract.getOne, async ({ params }) =>
      this.postsService.getOne({ id: params.id }),
    );
  }

  @TsRestHandler(postsContract.post)
  @UseInterceptors(FileInterceptor('file'), new ImageHandler(1000))
  create(@UploadedFile() file: File) {
    return tsRestHandler(postsContract.post, async ({ body }) => {
      console.log(body, file);
      return this.postsService.post(body, file);
    });
  }

  @TsRestHandler(postsContract.put)
  @UseInterceptors(FileInterceptor('file'), new ImageHandler(1000))
  edit(@UploadedFile() file: File) {
    return tsRestHandler(postsContract.put, async ({ body }) => {
      return this.postsService.edit(body, file);
    });
  }

  @TsRestHandler(postsContract.delete)
  delete() {
    return tsRestHandler(postsContract.delete, async ({ params }) =>
      this.postsService.delete({ id: params.id }),
    );
  }

  @TsRestHandler(postsContract.getStats)
  getStats() {
    return tsRestHandler(postsContract.getStats, async () =>
      this.postsService.getStats(),
    );
  }
}
