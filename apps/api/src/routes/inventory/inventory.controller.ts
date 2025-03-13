import { Controller, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';

import { inventoryContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard('inventory'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @TsRestHandler(inventoryContract.getOne)
  getInventoryItem() {
    return tsRestHandler(inventoryContract.getOne, async ({ params }) =>
      this.inventoryService.readOne({ id: params.id }),
    );
  }

  @TsRestHandler(inventoryContract.get)
  getInventory() {
    return tsRestHandler(inventoryContract.get, async ({ query }) =>
      this.inventoryService.read(query),
    );
  }

  @TsRestHandler(inventoryContract.export)
  exportInventory() {
    return tsRestHandler(inventoryContract.export, async () =>
      this.inventoryService.export(),
    );
  }

  @TsRestHandler(inventoryContract.post)
  createInventoryItem() {
    return tsRestHandler(inventoryContract.post, async ({ body }) =>
      this.inventoryService.post(body),
    );
  }

  @TsRestHandler(inventoryContract.put)
  editInventoryItem() {
    return tsRestHandler(inventoryContract.put, async ({ body }) =>
      this.inventoryService.edit(body),
    );
  }

  @TsRestHandler(inventoryContract.delete)
  deleteInventoryItem() {
    return tsRestHandler(inventoryContract.delete, async ({ params }) =>
      this.inventoryService.delete({ id: params.id }),
    );
  }

  @TsRestHandler(inventoryContract.getStats)
  getInventoryStats() {
    return tsRestHandler(inventoryContract.getStats, async () =>
      this.inventoryService.getStats(),
    );
  }
}
