import { Controller, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';

import { transactionsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard('finances'))
export class TransactionsController {
  constructor(private readonly financesService: TransactionsService) {}

  @TsRestHandler(transactionsContract.get)
  getTransactions() {
    return tsRestHandler(transactionsContract.get, async ({ query }) =>
      this.financesService.read(query),
    );
  }

  @TsRestHandler(transactionsContract.post)
  createTransaction() {
    return tsRestHandler(transactionsContract.post, async ({ body }) =>
      this.financesService.post(body),
    );
  }

  @TsRestHandler(transactionsContract.put)
  editTransaction() {
    return tsRestHandler(transactionsContract.put, async ({ body }) =>
      this.financesService.edit(body),
    );
  }

  @TsRestHandler(transactionsContract.delete)
  deleteTransaction() {
    return tsRestHandler(transactionsContract.delete, async ({ params }) =>
      this.financesService.delete(params),
    );
  }

  @TsRestHandler(transactionsContract.getStats)
  getTransactionStats() {
    return tsRestHandler(transactionsContract.getStats, async ({ params }) =>
      this.financesService.getStats(params),
    );
  }
}
