import { Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { z } from 'zod';
import sql from 'src/utils/db';
import {
  PermissionIdSchema,
  EditPermissionSchema,
  PostPermissionSchema,
} from '@iglesiasbc/schemas';
import { res } from 'src/utils/response';

const permissionsLimits = [2, 10, 20];

@Injectable()
export class PermissionsService {
  constructor(private readonly req: ContextProvider) {}

  async getPermissions() {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission) {
      return res(403, { message: 'No cuentas con los permisos necesarios' });
    }

    const rows = await sql`
    SELECT users.username, permissions.*
    FROM permissions JOIN users
    ON permissions."userId" = users.id
    where "churchId" = ${this.req.getChurchId()}`;

    return res(200, rows);
  }

  async createPermission(body: z.infer<typeof PostPermissionSchema>) {
    const permissionsCount = (
      await sql`select count(*) from permissions where "churchId" = ${this.req.getChurchId()}`
    )[0].count;

    if (permissionsCount >= permissionsLimits[this.req.getPlan()]) {
      return res(400, {
        message:
          'Haz alcanzado el limite de miembros, elimina miembros inactivos o cambia a un plan superior',
      });
    }

    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission) {
      return res(403, { message: 'No cuentas con los permisos necesarios' });
    }

    const [user] = await sql`select * from users where email = ${body.email}`;
    if (!user) {
      return res(400, {
        message: 'No se encontró un usuario con ese correo electrónico',
      });
    }

    const [userRegistered] =
      await sql`select 1 from permissions where "userId" = (select id from users where email = ${body.email}) and "churchId" = ${this.req.getChurchId()}`;
    if (userRegistered) {
      return res(400, { message: 'Ese usuario ya esta registrado' });
    }

    const result =
      await sql`insert into permissions ${sql({ userId: user.id, churchId: this.req.getChurchId() })}`;
    return res(201, result);
  }

  async editPermission(body: z.infer<typeof EditPermissionSchema>) {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission) {
      return res(403, { message: 'No cuentas con los permisos necesarios' });
    }

    const [{ ownerId }] =
      await sql`select "ownerId" from churches where id = ${this.req.getChurchId()}`;
    const [{ userId }] =
      await sql`select "userId" from permissions where id =${body.id}`;

    if (ownerId === userId) {
      return res(400, {
        message: 'No puedes modificar los permisos del dueño',
      });
    }

    const result =
      await sql`update permissions set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async deletePermission(params: z.infer<typeof PermissionIdSchema>) {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission) {
      return res(403, { message: 'No cuentas con los permisos necesarios' });
    }

    const [{ ownerId }] =
      await sql`select "ownerId" from churches where id = ${this.req.getChurchId()}`;
    const [{ userId }] =
      await sql`select "userId" from permissions where id =${params.id}`;
    if (ownerId === userId) {
      return res(400, { message: 'No puedes eliminar al dueño' });
    }

    const result =
      await sql`delete from permissions where id = ${params.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }
}
