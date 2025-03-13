import {
  Controller,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';

import { FileInterceptor } from '@nest-lab/fastify-multer';
import { membersContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard('members'))
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @TsRestHandler(membersContract.get)
  getMembers() {
    return tsRestHandler(membersContract.get, async ({ query }) =>
      this.membersService.get(query),
    );
  }

  @TsRestHandler(membersContract.getOne)
  getMember() {
    return tsRestHandler(membersContract.getOne, async ({ params }) =>
      this.membersService.getSingle({ id: params.id }),
    );
  }

  @TsRestHandler(membersContract.getBirthdays)
  getBirthdays() {
    return tsRestHandler(membersContract.getBirthdays, async () =>
      this.membersService.getBirthdays(),
    );
  }

  @TsRestHandler(membersContract.post)
  postMember() {
    return tsRestHandler(membersContract.post, async ({ body }) =>
      this.membersService.post(body),
    );
  }

  @TsRestHandler(membersContract.put)
  putMember() {
    return tsRestHandler(membersContract.put, async ({ body }) =>
      this.membersService.put(body),
    );
  }

  @TsRestHandler(membersContract.delete)
  deleteMember() {
    return tsRestHandler(membersContract.delete, async ({ params }) =>
      this.membersService.delete({ id: params.id }),
    );
  }

  @TsRestHandler(membersContract.getStats)
  getStats() {
    return tsRestHandler(membersContract.getStats, async () =>
      this.membersService.getStats(),
    );
  }

  @TsRestHandler(membersContract.import)
  @UseInterceptors(FileInterceptor('file'))
  import(@UploadedFile() file) {
    return tsRestHandler(membersContract.import, async () =>
      this.membersService.import(file),
    );
  }
}
