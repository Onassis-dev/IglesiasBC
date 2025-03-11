import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  DeleteSchema,
  EditTreasurySchema,
  PostTreasurySchema,
  getTreasurySchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';

@Injectable()
export class TreasuriesService {
  constructor(private readonly req: ContextProvider) {}

  async read(query: z.infer<typeof getTreasurySchema>) {
    const rows = await sql`
    SELECT *, COUNT(*) OVER () AS count
    FROM treasuries
    WHERE "churchId" = ${this.req.getChurchId()}
    AND (${query.name ? sql`LOWER(name) LIKE LOWER('%' || ${query.name} || '%')` : sql`1=1`})
    ORDER BY id
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}
  `;

    return { rows, count: rows[0]?.count || 0 };
  }

  async getOne(dto: z.infer<typeof DeleteSchema>) {
    const data =
      await sql`select id, name from treasuries where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`;

    if (data.length === 0) throw new HttpException('', 404);
    return data[0];
  }

  async post(body: z.infer<typeof PostTreasurySchema>) {
    const data = { ...body, churchId: this.req.getChurchId() };
    return await sql`insert into treasuries ${sql(data)}`;
  }

  async edit(body: z.infer<typeof EditTreasurySchema>) {
    return await sql`update treasuries set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async delete(body: z.infer<typeof DeleteSchema>) {
    await sql.begin(async (sql) => {
      await sql`delete from transactions where "treasuryId" = ${body.id} AND (select "churchId" from treasuries where id = "treasuryId") = ${this.req.getChurchId()}`;

      await sql`delete from treasuries where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
    });
    return;
  }

  async getStats() {
    const income = (
      await sql`select SUM(amount) from transactions
      join financescategories on financescategories.id = transactions."categoryId"
      join treasuries on treasuries.id = transactions."treasuryId"
      WHERE financescategories."isIncome" = true
      AND treasuries."churchId" = ${this.req.getChurchId()}`
    )[0].sum;

    const expense = (
      await sql`select SUM(amount) from transactions
      join financescategories on financescategories.id = transactions."categoryId"
      join treasuries on treasuries.id = transactions."treasuryId"
      WHERE financescategories."isIncome" = false
      AND treasuries."churchId" = ${this.req.getChurchId()}`
    )[0].sum;

    const balance: string =
      income - expense ? (income - expense).toFixed(2) : '0';

    return {
      income: income || '0',
      expense: expense || '0',
      balance: balance,
    };
  }
}
