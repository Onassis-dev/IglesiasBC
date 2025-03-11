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
import { TreasuriesService } from './treasuries.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import {
  DeleteSchema,
  EditSchema,
  PostSchema,
  getSchema,
} from 'schemas/dist/treasuries.schema';

@ApiTags('Treasuries')
@Controller('treasuries')
@UseGuards(new AuthGuard('finances'))
export class TreasuriesController {
  constructor(private readonly financesService: TreasuriesService) {}

  @Get()
  read(@Query(new ZodPiPe(getSchema)) query) {
    return this.financesService.read(query);
  }

  @Get(':id')
  readOne(@Param(new ZodPiPe(DeleteSchema)) param) {
    return this.financesService.getOne(param);
  }

  @Post()
  create(@Body(new ZodPiPe(PostSchema)) body) {
    return this.financesService.post(body);
  }

  @Put()
  edit(@Body(new ZodPiPe(EditSchema)) body) {
    return this.financesService.edit(body);
  }

  @Delete(':id')
  delete(@Param(new ZodPiPe(DeleteSchema)) params) {
    return this.financesService.delete(params);
  }

  @Get('stats')
  getTotal() {
    return this.financesService.getStats();
  }
}
