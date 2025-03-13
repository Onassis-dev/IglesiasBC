import { Controller, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/interceptors/auth/authorization.guard';
import { permissionsContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
@UseGuards(new AuthGuard())
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @TsRestHandler(permissionsContract.getPermissions)
  getPermissions() {
    return tsRestHandler(permissionsContract.getPermissions, async () => {
      return this.permissionsService.getPermissions();
    });
  }

  @TsRestHandler(permissionsContract.createPermission)
  createPermission() {
    return tsRestHandler(
      permissionsContract.createPermission,
      async ({ body }) => {
        return this.permissionsService.createPermission(body);
      },
    );
  }

  @TsRestHandler(permissionsContract.editPermission)
  editPermission() {
    return tsRestHandler(
      permissionsContract.editPermission,
      async ({ body }) => {
        return this.permissionsService.editPermission(body);
      },
    );
  }

  @TsRestHandler(permissionsContract.deletePermission)
  deletePermission() {
    return tsRestHandler(
      permissionsContract.deletePermission,
      async ({ params }) => {
        return this.permissionsService.deletePermission(params);
      },
    );
  }
}
