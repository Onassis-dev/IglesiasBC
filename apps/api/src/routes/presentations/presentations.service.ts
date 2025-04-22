import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  IdSchema,
  EditPresentationSchema,
  PostPresentationSchema,
  getPresentationSchema,
  bibleVerseSchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { res } from 'src/utils/response';
import bible from '../../../resources/bibles/RV1909.json';

@Injectable()
export class PresentationsService {
  constructor(private readonly req: ContextProvider) {}

  async read(query: z.infer<typeof getPresentationSchema>) {
    const rows = await sql`
    SELECT id, title, background, text, COUNT(*) OVER () AS count
    FROM presentations
    WHERE "churchId" = ${this.req.getChurchId()}
    AND (${query.title ? sql`LOWER(title) LIKE LOWER('%' || ${query.title} || '%')` : sql`TRUE`})
    ORDER BY id DESC
    LIMIT 12 OFFSET ${12 * (parseInt(query.page) - 1)}
  `;

    return res(200, { rows, count: rows[0]?.count || 0 });
  }

  async getOne(dto: z.infer<typeof IdSchema>) {
    const data =
      await sql`select * from presentations where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`;

    if (data.length === 0) throw new HttpException('', 404);
    return res(200, data[0]);
  }

  async post(body: z.infer<typeof PostPresentationSchema>) {
    await sql`insert into presentations ${sql({ ...body, churchId: this.req.getChurchId() })}`;
    return res(200, null);
  }

  async edit(body: z.infer<typeof EditPresentationSchema>) {
    const result =
      await sql`update presentations set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async delete(body: z.infer<typeof IdSchema>) {
    await sql`delete from presentations where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, null);
  }

  async getVerse(query: z.infer<typeof bibleVerseSchema>) {
    let verse = null;
    try {
      verse = (bible as Record<string, string>)[query.book][query.chapter - 1][
        query.verse - 1
      ];
    } catch (error) {
      throw new HttpException('', 404);
    }
    if (!verse) throw new HttpException('', 404);
    return res(200, verse);
  }

  // async getStats() {
  //   const income = (
  //     await sql`select SUM(amount) from transactions
  //     join financescategories on financescategories.id = transactions."categoryId"
  //     join presentations on presentations.id = transactions."treasuryId"
  //     WHERE financescategories."isIncome" = true
  //     AND presentations."churchId" = ${this.req.getChurchId()}`
  //   )[0].sum;

  //   const expense = (
  //     await sql`select SUM(amount) from transactions
  //     join financescategories on financescategories.id = transactions."categoryId"
  //     join presentations on presentations.id = transactions."treasuryId"
  //     WHERE financescategories."isIncome" = false
  //     AND presentations."churchId" = ${this.req.getChurchId()}`
  //   )[0].sum;

  //   const balance: string =
  //     income - expense ? (income - expense).toFixed(2) : '0';

  //   return res(200, {
  //     income: income || '0',
  //     expense: expense || '0',
  //     balance: balance,
  //   });
  // }
}
