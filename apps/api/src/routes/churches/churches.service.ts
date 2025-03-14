import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { ChurchSchema } from '@iglesiasbc/schemas';
import { getUserData } from 'src/utils/getUserData';
import { res, error } from 'src/utils/response';

@Injectable()
export class ChurchesService {
  constructor(private readonly req: ContextProvider) {}

  async getChurch() {
    const [church] =
      await sql`select users.plan, users."expirationDate", churches.name from
      users join churches on users.id = churches."ownerId"
      where churches.id = ${this.req.getChurchId()}`;

    return res(200, church);
  }

  async createChurch(body: z.infer<typeof ChurchSchema>) {
    const [church] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()}`;

    if (church) {
      return error('Ya tienes registrada una iglesia', 400);
    }

    await sql.begin(async (sql) => {
      const [{ id }] =
        await sql`insert into "churches" (name, "ownerId") values (${body.name}, ${this.req.getUserId()}) returning id`;
      await sql`update permissions set selected = false where "userId" = ${this.req.getUserId()}`;
      await sql`insert into permissions ("churchId", "userId", selected, perm_website, perm_inventory, perm_finances, perm_members, perm_classes, perm_blog, perm_certificates)
       values (${id}, ${this.req.getUserId()}, true, true,true,true,true, true, true, true)`;
    });

    const data = await getUserData(this.req.getUserId());
    return res(200, data);
  }

  async editChurch(body: z.infer<typeof ChurchSchema>) {
    await sql`update "churches" set ${sql(body)} where id = ${this.req.getChurchId()} returning 1`;
    return res(200, null);
  }
}
