import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { z } from 'zod';
import sql from 'src/utils/db';
import {
  IdSchema,
  EditTransactionSchema,
  PostTransactionSchema,
  StatsSchema,
  getTransactionsSchema,
} from '@iglesiasbc/schemas';
import { res } from 'src/utils/response';

@Injectable()
export class TransactionsService {
  constructor(private readonly req: ContextProvider) {}

  async read(query: z.infer<typeof getTransactionsSchema>) {
    const rows = await sql`
    SELECT transactions.id, date, concept, amount, "categoryId", notes, "treasuryId"
    FROM transactions
    JOIN treasuries on treasuries.id = transactions."treasuryId"
    WHERE treasuries."churchId" = ${this.req.getChurchId()}
    AND (${query.name ? sql`LOWER(transactions.concept) LIKE LOWER('%' || ${query.name} || '%')` : sql`TRUE`})
    AND treasuries.id = ${query.id}
    ORDER BY transactions.id DESC
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}
  `;

    const [treasury] = await sql`
    SELECT name FROM treasuries where id = ${query.id}`;

    return res(200, { rows, count: rows[0]?.count || 0, name: treasury.name });
  }

  async post(body: z.infer<typeof PostTransactionSchema>) {
    const treasuryCheck =
      await sql`SELECT 1 FROM treasuries WHERE id = ${body.treasuryId} AND "churchId" = ${this.req.getChurchId()} LIMIT 1`;

    if (!treasuryCheck.count)
      throw new HttpException(
        'El treasuryId no pertenece al churchId actual.',
        400,
      );

    const result = await sql`INSERT INTO transactions ${sql({ ...body })}`;
    return res(200, result);
  }

  async edit(body: z.infer<typeof EditTransactionSchema>) {
    const result =
      await sql`UPDATE transactions SET ${sql(body)} FROM treasuries
      WHERE transactions."treasuryId" = treasuries.id
      AND transactions.id = ${body.id}
      AND treasuries."churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async delete(body: z.infer<typeof IdSchema>) {
    const result =
      await sql`delete from transactions where id = ${body.id} and (select "churchId" from treasuries where id = "treasuryId") = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async getStats(body: z.infer<typeof StatsSchema>) {
    const income = (
      await sql`select SUM(amount) from transactions
      join financescategories on financescategories.id = transactions."categoryId"
      join treasuries on treasuries.id = transactions."treasuryId"
      WHERE financescategories."isIncome" = true
      AND treasuries.id = ${body.id}
      AND treasuries."churchId" = ${this.req.getChurchId()}`
    )[0].sum;

    const expense = (
      await sql`select SUM(amount) from transactions
      join financescategories on financescategories.id = transactions."categoryId"
      join treasuries on treasuries.id = transactions."treasuryId"
      WHERE financescategories."isIncome" = false
      AND treasuries.id = ${body.id}
      AND treasuries."churchId" = ${this.req.getChurchId()}`
    )[0].sum;

    const balance: string =
      income - expense ? (income - expense).toFixed(2) : '0';

    return res(200, {
      income: income || '0',
      expense: expense || '0',
      balance: balance,
    });
  }
}
