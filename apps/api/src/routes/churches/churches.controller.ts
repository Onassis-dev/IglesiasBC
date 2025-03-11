import { Controller, Put, Body, UseGuards, Post, Get } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { ApiTags } from '@nestjs/swagger';
import { ChurchSchema } from './churches.schema';

@ApiTags('Churches')
@Controller('churches')
@UseGuards(new AuthGuard())
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @Get()
  getChurch() {
    return this.churchesService.getChurch();
  }

  @Post()
  createChurch(@Body(new ZodPiPe(ChurchSchema)) body) {
    return this.churchesService.createChurch(body);
  }

  @Put()
  editChurch(@Body(new ZodPiPe(ChurchSchema)) body) {
    return this.churchesService.editChurch(body);
  }
}
