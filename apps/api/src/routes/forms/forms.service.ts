import { HttpException, Injectable } from '@nestjs/common';
import { z } from 'zod';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { res } from 'src/utils/response';
import { ResultsSchema, submitFormSchema } from '@iglesiasbc/schemas';

@Injectable()
export class FormsService {
  constructor(private readonly req: ContextProvider) {}

  async get(form: string) {
    const [church] =
      await sql`select id, form, name from churches where form = ${form}`;
    if (!church) throw new HttpException('', 404);

    return res(200, church);
  }

  async submit(body: z.infer<typeof submitFormSchema>) {
    const result = await this.get(body.id);
    delete body.id;

    const data = { ...body, churchId: result?.body?.id };
    return res(200, await sql`insert into formresults ${sql(data)}`);
  }

  async getResults() {
    const results =
      await sql`select * from formresults where "churchId" = ${this.req.getChurchId()} order by id desc`;

    return res(200, results);
  }

  async updateUrl() {
    const [form] =
      await sql`update churches set form = gen_random_uuid() where id = ${this.req.getChurchId()} returning form`;
    return res(200, form.form);
  }

  async getUrl() {
    const [form] =
      await sql`select form from churches where id = ${this.req.getChurchId()}`;
    return res(200, form.form);
  }

  async acceptResults(body: z.infer<typeof ResultsSchema>) {
    await sql.begin(async (sql) => {
      await sql`insert into members (name, "churchId", "positionId", "cellphone", "email", "birthday", "genre", "civilStatus" , "joinDate")
        select name, "churchId", "positionId", "cellphone", "email", "birthday", "genre", "civilStatus" , "joinDate"
        from formresults where id in ${sql(body)} and "churchId" = ${this.req.getChurchId()}`;
    });

    await sql`delete from formresults where id in ${sql(body)} and "churchId" = ${this.req.getChurchId()}`;

    return res(200, body);
  }

  async rejectResults(body: z.infer<typeof ResultsSchema>) {
    await sql`delete from formresults where id in ${sql(body)} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, null);
  }
}
