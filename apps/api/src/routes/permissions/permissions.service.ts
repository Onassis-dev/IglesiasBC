import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { z } from 'zod';
import sql from 'src/utils/db';
import {
  DeleteSchema,
  EditSchema,
  PostSchema,
} from 'schemas/dist/permissions.schema';

const permissionsLimits = [2, 10, 20];

@Injectable()
export class PermissionsService {
  constructor(private readonly req: ContextProvider) {}

  async getPermissions() {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission)
      throw new HttpException('No cuentas con los permisos necesarios', 403);

    const rows = await sql`
    SELECT users.username, permissions.*
    FROM permissions JOIN users
    ON permissions."userId" = users.id
    where "churchId" = ${this.req.getChurchId()}`;

    return rows;
  }

  async createPermission(body: z.infer<typeof PostSchema>) {
    const permissionsCount = (
      await sql`select count(*) from permissions where "churchId" = ${this.req.getChurchId()}`
    )[0].count;

    if (permissionsCount >= permissionsLimits[this.req.getPlan()])
      throw new HttpException(
        'Haz alcanzado el limite de miembros, elimina miembros inactivos o cambia a un plan superior',
        400,
      );

    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission)
      throw new HttpException('No cuentas con los permisos necesarios', 403);

    const [user] = await sql`select * from users where email = ${body.email}`;
    if (!user)
      throw new HttpException(
        'No se encontró un usuario con ese correo electrónico',
        400,
      );

    const [userRegistered] =
      await sql`select 1 from permissions where "userId" = (select id from users where email = ${body.email}) and "churchId" = ${this.req.getChurchId()}`;
    if (userRegistered)
      throw new HttpException('Ese usuario ya esta registrado', 400);

    return await sql`insert into permissions ${sql({ userId: user.id, churchId: this.req.getChurchId() })}`;
  }

  async editPermission(body: z.infer<typeof EditSchema>) {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission)
      throw new HttpException('No cuentas con los permisos necesarios', 403);

    const [{ ownerId }] =
      await sql`select "ownerId" from churches where id = ${this.req.getChurchId()}`;
    const [{ userId }] =
      await sql`select "userId" from permissions where id =${body.id}`;

    if (ownerId === userId)
      throw new HttpException(
        'No puedes modificar los permisos del dueño',
        400,
      );

    return await sql`update permissions set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async deletePermission(params: z.infer<typeof DeleteSchema>) {
    const [permission] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()} and id = ${this.req.getChurchId()}`;
    if (!permission)
      throw new HttpException('No cuentas con los permisos necesarios', 403);

    const [{ ownerId }] =
      await sql`select "ownerId" from churches where id = ${this.req.getChurchId()}`;
    const [{ userId }] =
      await sql`select "userId" from permissions where id =${params.id}`;
    if (ownerId === userId)
      throw new HttpException('No puedes eliminar al dueño', 400);

    return await sql`delete from permissions where id = ${params.id} and "churchId" = ${this.req.getChurchId()}`;
  }
}
