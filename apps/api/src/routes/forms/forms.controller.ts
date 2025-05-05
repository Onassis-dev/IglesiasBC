import { Controller, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { formsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @TsRestHandler(formsContract.get)
  get() {
    return tsRestHandler(formsContract.get, async ({ params }) =>
      this.formsService.get(params.form),
    );
  }

  @TsRestHandler(formsContract.submit)
  submit() {
    return tsRestHandler(formsContract.submit, async ({ body }) =>
      this.formsService.submit(body),
    );
  }

  @UseGuards(new AuthGuard('members'))
  @TsRestHandler(formsContract.getResults)
  getResults() {
    return tsRestHandler(formsContract.getResults, async () =>
      this.formsService.getResults(),
    );
  }

  @UseGuards(new AuthGuard('members'))
  @TsRestHandler(formsContract.updateUrl)
  updateUrl() {
    return tsRestHandler(formsContract.updateUrl, async () =>
      this.formsService.updateUrl(),
    );
  }

  @UseGuards(new AuthGuard('members'))
  @TsRestHandler(formsContract.getUrl)
  getUrl() {
    return tsRestHandler(formsContract.getUrl, async () =>
      this.formsService.getUrl(),
    );
  }

  @UseGuards(new AuthGuard('members'))
  @TsRestHandler(formsContract.importResults)
  importResults() {
    return tsRestHandler(formsContract.importResults, async ({ body }) =>
      this.formsService.importResults(body),
    );
  }
}
