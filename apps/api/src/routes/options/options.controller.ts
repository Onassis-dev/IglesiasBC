import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import sql from 'src/utils/db';

@ApiTags('Options')
@Controller('options')
@UseGuards(new AuthGuard())
export class OptionsController {
  @Get('positions')
  async getPositions() {
    return await sql`select id, name as value from positions`;
  }

  @Get('categories')
  async getCategories() {
    return await sql`select id, name as value, "isIncome" from financescategories`;
  }

  @Get('certificates')
  async getCertificateTypes() {
    return await sql`select id, name as value from certificatetypes`;
  }
}
