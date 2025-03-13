import { Controller, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { permissionsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @TsRestHandler(permissionsContract.get)
  getPermissions() {
    return tsRestHandler(permissionsContract.get, async () => {
      return this.permissionsService.getPermissions();
    });
  }

  @TsRestHandler(permissionsContract.create)
  createPermission() {
    return tsRestHandler(permissionsContract.create, async ({ body }) => {
      return this.permissionsService.createPermission(body);
    });
  }

  @TsRestHandler(permissionsContract.edit)
  editPermission() {
    return tsRestHandler(permissionsContract.edit, async ({ body }) => {
      return this.permissionsService.editPermission(body);
    });
  }

  @TsRestHandler(permissionsContract.delete)
  deletePermission() {
    return tsRestHandler(permissionsContract.delete, async ({ params }) => {
      return this.permissionsService.deletePermission(params);
    });
  }
}
