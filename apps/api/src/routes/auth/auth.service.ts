import { Injectable } from '@nestjs/common';
import { loginSchema, signUpSchema, googleSchema } from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { httpCookieConfig } from 'src/utils/cookiesConfig';
import { getUserData } from 'src/utils/getUserData';
import { res } from 'src/utils/response';

@Injectable()
export class AuthService {
  async login(body: z.infer<typeof loginSchema>, response) {
    let data: any = await getUserData(body.email);

    if (!data?.userId) {
      [data] =
        await sql`select username, id as "userId" from users where email = ${body.email}`;

      data.owner = data.userId === data.ownerId;
    }

    response
      .cookie('session', body.token, httpCookieConfig)
      .cookie('refresh', body.refreshToken, httpCookieConfig)
      .send(data);

    return res(201, null);
  }

  async signup(body: z.infer<typeof signUpSchema>, response) {
    await sql`insert into "users" ("email", "username") values (${body.email}, ${body.username})`;

    return this.login(body, response);
  }

  async logout(response) {
    response
      .cookie('session', '', httpCookieConfig)
      .cookie('refresh', '', httpCookieConfig)
      .send();

    return res(201, null);
  }

  async signInWithGoogle(body: z.infer<typeof googleSchema>, response) {
    let data: any = await getUserData(body.email);

    if (!data?.userId) {
      [data] =
        await sql`select username, id as "userId" from users where email = ${body.email}`;

      if (data) data.owner = data.userId === data.ownerId;
    }

    if (!data?.userId) return this.signup(body, response);
    return this.login(body, response);
  }
}
