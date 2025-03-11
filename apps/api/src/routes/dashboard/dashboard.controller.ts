import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(new AuthGuard())
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('owner')
  async getOwner() {
    return this.dashboardService.getOwner();
  }

  @Get('user')
  async getUser() {
    return this.dashboardService.getUser();
  }
}
