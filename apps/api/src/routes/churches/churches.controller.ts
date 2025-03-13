import { Controller, UseGuards } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { churchesContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @TsRestHandler(churchesContract.get)
  getChurch() {
    return tsRestHandler(churchesContract.get, async () =>
      this.churchesService.getChurch(),
    );
  }

  @TsRestHandler(churchesContract.create)
  createChurch() {
    return tsRestHandler(churchesContract.create, async ({ body }) => {
      return this.churchesService.createChurch(body);
    });
  }

  @TsRestHandler(churchesContract.edit)
  editChurch() {
    return tsRestHandler(churchesContract.edit, async ({ body }) => {
      return this.churchesService.editChurch(body);
    });
  }
}
