import { Controller, Body, Req, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { CheckoutSchema } from 'schemas/dist/payments.schema';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly webhooksService: PaymentsService) {}

  @Post('webhook')
  webhooks(@Req() req) {
    return this.webhooksService.webhooks(req);
  }
  @Post('checkout')
  @UseGuards(new AuthGuard())
  checkout(@Body(new ZodPiPe(CheckoutSchema)) body, @Req() req) {
    return this.webhooksService.checkout(body, req);
  }

  @Post('portal')
  @UseGuards(new AuthGuard())
  portal(@Req() req) {
    return this.webhooksService.portal(req);
  }
}
