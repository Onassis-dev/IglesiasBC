import { Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  PutInventorySchema,
  IdSchema,
  PostInventorySchema,
  getInventorySchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import * as excelJS from 'exceljs';
import { res } from 'src/utils/response';

@Injectable()
export class InventoryService {
  constructor(private readonly req: ContextProvider) {}
  async readOne(params: z.infer<typeof IdSchema>) {
    const data = (
      await sql`select * from inventory where id = ${params.id} and "churchId" = ${this.req.getChurchId()}`
    )[0];

    return res(200, data);
  }

  async read(query: z.infer<typeof getInventorySchema>) {
    //Ambos filtros deben de ser iguales
    const rows = await sql`
    SELECT id, name, amount, price, brand, model, serie, bill, observations
    FROM inventory
    WHERE "churchId" = ${this.req.getChurchId()} 
    AND (${query.name ? sql`LOWER(name) LIKE LOWER('%' || ${query.name} || '%')` : sql`TRUE`})
    ORDER BY id
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}`;

    return res(200, { rows, count: rows[0]?.count || 0 });
  }

  async post(body: z.infer<typeof PostInventorySchema>) {
    const data = { ...body, churchId: this.req.getChurchId() };
    const result = await sql`insert into inventory ${sql(data)}`;
    return res(200, result);
  }

  async edit(body: z.infer<typeof PutInventorySchema>) {
    const result =
      await sql`update inventory set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async delete(param: z.infer<typeof IdSchema>) {
    const result =
      await sql`delete from inventory where id = ${param.id} and "churchId" = ${this.req.getChurchId()}`;
    return res(200, result);
  }

  async getStats() {
    const items = (
      await sql`select count(*) from inventory  WHERE "churchId" = ${this.req.getChurchId()} `
    )[0].count;

    const money = (
      await sql`select SUM(price * amount) as count from inventory  WHERE "churchId" = ${this.req.getChurchId()}`
    )[0].count;

    const total = (
      await sql`select SUM(amount) as count from inventory  WHERE "churchId" = ${this.req.getChurchId()}`
    )[0].count;

    return res(200, {
      items: items || '0',
      money: money || '0',
      total: total || '0',
    });
  }

  async export() {
    const rows =
      await sql`select *, (amount * price) as total from inventory  WHERE "churchId" = ${this.req.getChurchId()} `;

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario');

    worksheet.columns = [
      { header: 'Articulo', key: 'name', width: 25 },
      { header: 'Marca', key: 'brand', width: 16 },
      { header: 'Modelo', key: 'model', width: 16 },
      { header: 'Serie', key: 'serie', width: 16 },
      { header: 'No. factura', key: 'bill', width: 16 },
      { header: 'Precio unitario', key: 'price', width: 16 },
      { header: 'Cantidad', key: 'amount', width: 16 },
      { header: 'Precio total', key: 'total', width: 18 },
    ];

    worksheet.addRows(rows);

    worksheet.getRow(1).eachCell((cell) => {
      cell.style = { font: { bold: true } };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return res(200, buffer);
  }
}
