import { Injectable } from '@nestjs/common';
import { authSchema, registerSchema } from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { httpCookieConfig } from 'src/utils/cookiesConfig';
import { getUserData } from 'src/utils/getUserData';

@Injectable()
export class AuthService {
  async login(body: z.infer<typeof authSchema>, res) {
    let data: any = await getUserData(body.email);

    if (!data?.userId) {
      [data] =
        await sql`select username, id as "userId" from users where email = ${body.email}`;

      data.owner = data.userId === data.ownerId;
    }

    res
      .cookie('session', body.token, httpCookieConfig)
      .cookie('refresh', body.refreshToken, httpCookieConfig)
      .send(data);
  }

  async signup(body: z.infer<typeof registerSchema>, res) {
    await sql`insert into "users" ("email", "username") values (${body.email}, ${body.username})`;

    return this.login(body, res);
  }

  async logout(res) {
    res
      .cookie('session', '', httpCookieConfig)
      .cookie('refresh', '', httpCookieConfig)
      .send();
  }

  async signInWithGoogle(body: z.infer<typeof authSchema>, res) {
    let data: any = await getUserData(body.email);

    if (!data?.userId) {
      [data] =
        await sql`select username, id as "userId" from users where email = ${body.email}`;

      if (data) data.owner = data.userId === data.ownerId;
    }

    if (!data?.userId) return this.signup(body, res);
    return this.login(body, res);
  }
}
