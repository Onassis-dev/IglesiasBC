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
import { InventoryService } from './inventory.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  EditMemberSchema,
  IdSchema,
  PostMemberSchema,
  getSchema,
} from 'schemas/dist/inventory.schema';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(new AuthGuard('inventory'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':id')
  readOne(@Param(new ZodPiPe(IdSchema)) params) {
    return this.inventoryService.readOne(params);
  }

  @Get()
  read(@Query(new ZodPiPe(getSchema)) query) {
    return this.inventoryService.read(query);
  }

  @Get('export')
  export() {
    return this.inventoryService.export();
  }

  @Post()
  create(@Body(new ZodPiPe(PostMemberSchema)) body) {
    return this.inventoryService.post(body);
  }

  @Put()
  edit(@Body(new ZodPiPe(EditMemberSchema)) body) {
    return this.inventoryService.edit(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(IdSchema)) params) {
    return this.inventoryService.delete(params);
  }

  @Get('stats')
  getTotal() {
    return this.inventoryService.getStats();
  }
}
