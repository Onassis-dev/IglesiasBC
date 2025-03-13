import { Controller, UseGuards } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { churchesContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @TsRestHandler(churchesContract.getChurch)
  getChurch() {
    return tsRestHandler(churchesContract.getChurch, async () =>
      this.churchesService.getChurch(),
    );
  }

  @TsRestHandler(churchesContract.createChurch)
  createChurch() {
    return tsRestHandler(churchesContract.createChurch, async ({ body }) => {
      return this.churchesService.createChurch(body);
    });
  }

  @TsRestHandler(churchesContract.editChurch)
  editChurch() {
    return tsRestHandler(churchesContract.editChurch, async ({ body }) => {
      return this.churchesService.editChurch(body);
    });
  }
}
