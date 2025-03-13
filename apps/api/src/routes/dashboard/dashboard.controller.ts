import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { DashboardService } from './dashboard.service';
import { dashboardContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @TsRestHandler(dashboardContract.getOwner)
  getOwner() {
    return tsRestHandler(dashboardContract.getOwner, async () => {
      return this.dashboardService.getOwner();
    });
  }

  @TsRestHandler(dashboardContract.getUser)
  getUser() {
    return tsRestHandler(dashboardContract.getUser, async () => {
      return this.dashboardService.getUser();
    });
  }
}
