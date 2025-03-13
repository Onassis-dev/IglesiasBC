import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { usersContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TsRestHandler(usersContract.getUser)
  getUser() {
    return tsRestHandler(usersContract.getUser, async () => {
      return this.usersService.getOne();
    });
  }

  @TsRestHandler(usersContract.getData)
  getData() {
    return tsRestHandler(usersContract.getData, async () => {
      return this.usersService.getData();
    });
  }

  @TsRestHandler(usersContract.editUser)
  editUser() {
    return tsRestHandler(usersContract.editUser, async ({ body }) => {
      return this.usersService.edit(body);
    });
  }

  @TsRestHandler(usersContract.selectChurch)
  selectChurch() {
    return tsRestHandler(usersContract.selectChurch, async ({ body }) => {
      return this.usersService.selectChurch(body);
    });
  }
}
