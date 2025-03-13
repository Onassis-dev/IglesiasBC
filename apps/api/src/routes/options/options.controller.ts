import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import sql from 'src/utils/db';
import { optionsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { res } from 'src/utils/response';

@Controller()
@UseGuards(new AuthGuard())
export class OptionsController {
  @TsRestHandler(optionsContract.getPositions)
  getPositions() {
    return tsRestHandler(optionsContract.getPositions, async () => {
      const positions = await sql`select id, name as value from positions`;
      return res(200, positions);
    });
  }

  @TsRestHandler(optionsContract.getCategories)
  getCategories() {
    return tsRestHandler(optionsContract.getCategories, async () => {
      const categories =
        await sql`select id, name as value, "isIncome" from financescategories`;
      return res(200, categories);
    });
  }

  @TsRestHandler(optionsContract.getCertificateTypes)
  getCertificateTypes() {
    return tsRestHandler(optionsContract.getCertificateTypes, async () => {
      const certificateTypes =
        await sql`select id, name as value from certificatetypes`;
      return res(200, certificateTypes);
    });
  }
}
