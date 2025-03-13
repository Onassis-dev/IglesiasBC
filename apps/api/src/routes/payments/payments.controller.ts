import { Controller, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { paymentsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @TsRestHandler(paymentsContract.checkout)
  checkout() {
    return tsRestHandler(
      paymentsContract.checkout,
      async ({ body, headers }) => {
        return this.paymentsService.checkout(body, headers);
      },
    );
  }

  @TsRestHandler(paymentsContract.portal)
  portal() {
    return tsRestHandler(paymentsContract.portal, async ({ headers }) => {
      return this.paymentsService.portal(headers);
    });
  }
}
