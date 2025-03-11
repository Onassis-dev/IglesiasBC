import { Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  EditMemberSchema,
  IdSchema,
  PostMemberSchema,
  getSchema,
} from 'schemas/dist/inventory.schema';
import { z } from 'zod';
import sql from 'src/utils/db';
import * as excelJS from 'exceljs';

@Injectable()
export class InventoryService {
  constructor(private readonly req: ContextProvider) {}
  async readOne(params: z.infer<typeof IdSchema>) {
    return (
      await sql`select * from inventory where id = ${params.id} and "churchId" = ${this.req.getChurchId()}`
    )[0];
  }

  async read(query: z.infer<typeof getSchema>) {
    //Ambos filtros deben de ser iguales
    const rows = await sql`
    SELECT id, name, amount, price, brand, COUNT(*) OVER () AS count
    FROM inventory
    WHERE "churchId" = ${this.req.getChurchId()} 
    AND (${query.name ? sql`LOWER(name) LIKE LOWER('%' || ${query.name} || '%')` : sql`1=1`})
    ORDER BY id
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}`;

    return { rows, count: rows[0]?.count || 0 };
  }

  async post(body: z.infer<typeof PostMemberSchema>) {
    const data = { ...body, churchId: this.req.getChurchId() };
    return await sql`insert into inventory ${sql(data)}`;
  }

  async edit(body: z.infer<typeof EditMemberSchema>) {
    return await sql`update inventory set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async delete(param: z.infer<typeof IdSchema>) {
    return await sql`delete from inventory where id = ${param.id} and "churchId" = ${this.req.getChurchId()}`;
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

    return { items: items || '0', money: money || '0', total: total || '0' };
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
    return buffer;
  }
}
