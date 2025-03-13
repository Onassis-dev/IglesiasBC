import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { paymentsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/payments/webhook')
  webhooks(@Req() req) {
    return this.paymentsService.webhooks(req);
  }

  @UseGuards(new AuthGuard())
  @TsRestHandler(paymentsContract.checkout)
  checkout() {
    return tsRestHandler(
      paymentsContract.checkout,
      async ({ body, headers }) => {
        return this.paymentsService.checkout(body, headers);
      },
    );
  }

  @UseGuards(new AuthGuard())
  @TsRestHandler(paymentsContract.portal)
  portal() {
    return tsRestHandler(paymentsContract.portal, async ({ headers }) => {
      return this.paymentsService.portal(headers);
    });
  }
}
