import { Controller, UseGuards } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { presentationsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard('presentations'))
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) {}

  @TsRestHandler(presentationsContract.get)
  getPresentations() {
    return tsRestHandler(presentationsContract.get, async ({ query }) =>
      this.presentationsService.read(query),
    );
  }

  @TsRestHandler(presentationsContract.getOne)
  getPresentation() {
    return tsRestHandler(presentationsContract.getOne, async ({ params }) =>
      this.presentationsService.getOne(params),
    );
  }

  @TsRestHandler(presentationsContract.post)
  createPresentation() {
    return tsRestHandler(presentationsContract.post, async ({ body }) =>
      this.presentationsService.post(body),
    );
  }

  @TsRestHandler(presentationsContract.put)
  editPresentation() {
    return tsRestHandler(presentationsContract.put, async ({ body }) =>
      this.presentationsService.edit(body),
    );
  }

  @TsRestHandler(presentationsContract.delete)
  deletePresentation() {
    return tsRestHandler(presentationsContract.delete, async ({ params }) =>
      this.presentationsService.delete(params),
    );
  }

  // @TsRestHandler(presentationsContract.getStats)
  // getPresentationStats() {
  //   return tsRestHandler(presentationsContract.getStats, async () =>
  //     this.presentationsService.getStats(),
  //   );
  // }
}
