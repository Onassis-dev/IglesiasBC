import { Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { SelectChurchSchema, UserSchema } from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { cookieConfig } from 'src/utils/cookiesConfig';
import { getUserData } from 'src/utils/getUserData';
import { res, error } from 'src/utils/response';

@Injectable()
export class UsersService {
  constructor(private readonly req: ContextProvider) {}

  async getOne() {
    const [user] =
      await sql`select username, email, (select true from churches where "ownerId" = users.id) as "isOwner" from users where id = ${this.req.getUserId()}`;

    const [result] =
      await sql`select "churchId" from permissions where "userId" = ${this.req.getUserId()} and selected = true`;
    const churchId = result ? result.churchId : null;

    const churches =
      await sql`select permissions."churchId" as id, permissions.selected, churches.name, users.plan
        from permissions
        join users on users.id = permissions."userId"
        join churches on churches.id = permissions."churchId"      
      where users.id = ${this.req.getUserId()}`;

    return res(200, { user: { ...user, churchId }, churches });
  }

  async checkPlan(response) {
    if (this.req.getPlan() < 1) {
      return error('Aun no estas suscrito.', 400);
    }

    response.cookie('plan', this.req.getPlan(), cookieConfig);
    return res(200, null);
  }

  async edit(body: z.infer<typeof UserSchema>) {
    const [usernameExists] =
      await sql`select 1 from "users" where "username" = ${body.username} and id <> ${this.req.getUserId()}`;

    if (usernameExists) {
      return error('Ya existe un usuario registrado con ese nombre', 400);
    }

    await sql.begin(async (sql) => {
      await sql`update "users" set "username" = ${body.username} where "id" = ${this.req.getUserId()}`;
      await sql`update permissions set selected = false where "userId" = ${this.req.getUserId()}`;
      await sql`update permissions set selected = true where "userId" = ${this.req.getUserId()} and "churchId" = ${body.churchId}`;
    });

    const data = await getUserData(this.req.getUserId());
    return res(200, data);
  }

  async selectChurch(body: z.infer<typeof SelectChurchSchema>) {
    await sql.begin(async (sql) => {
      await sql`update permissions set selected = false where "userId" = ${this.req.getUserId()}`;
      await sql`update permissions set selected = true where "userId" = ${this.req.getUserId()} and "churchId" = ${body.churchId}`;
    });

    const data = await getUserData(this.req.getUserId());
    return res(200, data);
  }

  async getData() {
    const userId = this.req.getUserId();
    const data = await getUserData(userId);
    return res(200, data);
  }
}
