import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  DeleteSchema,
  EditTransactionSchema,
  PostTransactionSchema,
  StatsSchema,
  getTransactionsSchema,
} from '@iglesiasbc/schemas';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(new AuthGuard('finances'))
export class TransactionsController {
  constructor(private readonly financesService: TransactionsService) {}

  @Get()
  read(@Query(new ZodPiPe(getTransactionsSchema)) query) {
    return this.financesService.read(query);
  }

  @Post()
  create(@Body(new ZodPiPe(PostTransactionSchema)) body) {
    return this.financesService.post(body);
  }

  @Put()
  edit(@Body(new ZodPiPe(EditTransactionSchema)) body) {
    return this.financesService.edit(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(DeleteSchema)) params) {
    return this.financesService.delete(params);
  }

  @Get('stats/:id')
  getStats(@Param(new ZodPiPe(StatsSchema)) params) {
    return this.financesService.getStats(params);
  }
}
