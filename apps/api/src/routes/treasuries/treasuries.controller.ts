import { Controller, UseGuards } from '@nestjs/common';
import { TreasuriesService } from './treasuries.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { treasuriesContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@ApiTags('Treasuries')
@Controller()
@UseGuards(new AuthGuard('finances'))
export class TreasuriesController {
  constructor(private readonly financesService: TreasuriesService) {}

  @TsRestHandler(treasuriesContract.get)
  getTreasuries() {
    return tsRestHandler(treasuriesContract.get, async ({ query }) =>
      this.financesService.read(query),
    );
  }

  @TsRestHandler(treasuriesContract.getOne)
  getTreasury() {
    return tsRestHandler(treasuriesContract.getOne, async ({ params }) =>
      this.financesService.getOne(params),
    );
  }

  @TsRestHandler(treasuriesContract.post)
  createTreasury() {
    return tsRestHandler(treasuriesContract.post, async ({ body }) =>
      this.financesService.post(body),
    );
  }

  @TsRestHandler(treasuriesContract.put)
  editTreasury() {
    return tsRestHandler(treasuriesContract.put, async ({ body }) =>
      this.financesService.edit(body),
    );
  }

  @TsRestHandler(treasuriesContract.delete)
  deleteTreasury() {
    return tsRestHandler(treasuriesContract.delete, async ({ params }) =>
      this.financesService.delete(params),
    );
  }

  @TsRestHandler(treasuriesContract.getStats)
  getTreasuryStats() {
    return tsRestHandler(treasuriesContract.getStats, async () =>
      this.financesService.getStats(),
    );
  }
}
