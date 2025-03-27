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
      await sql`select ("ownerId" = ${this.req.getUserId()}) as "isOwner" from churches where id = ${this.req.getChurchId() || 0}`;

    const [result] =
      await sql`select "churchId" from permissions where "userId" = ${this.req.getUserId()} and selected = true`;
    const churchId = result ? result.churchId : null;

    const churches =
      await sql`select permissions."churchId" as id, permissions.selected, churches.name, churches.plan
        from permissions
        join churches on churches.id = permissions."churchId"      
      where permissions."userId" = ${this.req.getUserId()}`;

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
    await sql.begin(async (sql) => {
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
    const data = await getUserData(this.req.getUserId());
    return res(200, data);
  }
}
