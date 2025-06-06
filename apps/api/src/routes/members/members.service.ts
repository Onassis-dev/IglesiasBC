import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  PutMemberSchema,
  PostMemberSchema,
  getMembersSchema,
  IdSchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { File } from '@nest-lab/fastify-multer';
import * as excelJS from 'exceljs';
import { res } from 'src/utils/response';

const memberLimits = [50, 150, 300];

@Injectable()
export class MembersService {
  constructor(private readonly req: ContextProvider) {}

  async get(dto: z.infer<typeof getMembersSchema>) {
    const rows = await sql`
    SELECT id, name, cellphone, email, baptized, email, birthday, "joinDate", "countryCode", "positionId", genre, "civilStatus", count(*) OVER() as count
    FROM members
    WHERE "churchId" = ${this.req.getChurchId()}
    AND (${dto.name ? sql`LOWER(name) LIKE LOWER('%' || ${dto.name} || '%')` : sql`TRUE`})
    ORDER BY id desc
    LIMIT 10 OFFSET ${10 * (parseInt(dto.page) - 1)}
  `;

    return res(200, { rows, count: rows[0]?.count || 0 });
  }

  async getSingle(dto: z.infer<typeof IdSchema>) {
    const data =
      await sql`select * from members where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`;

    if (data.length === 0) throw new HttpException('', 404);
    return res(200, data[0]);
  }

  async getBirthdays() {
    const rows = await sql`
    SELECT id, name, cellphone, email, baptized, email, birthday, "joinDate", "countryCode", "positionId", genre, "civilStatus",
    EXTRACT(MONTH FROM birthday) as month
    FROM members
    WHERE "churchId" = ${this.req.getChurchId()} 
    AND EXTRACT(MONTH FROM birthday) = ${new Date().getMonth() + 1}
    ORDER BY birthday`;

    return res(200, rows);
  }

  async post(dto: z.infer<typeof PostMemberSchema>) {
    const membersCount = (
      await sql`select count(*) from members where "churchId" = ${this.req.getChurchId()}`
    )[0].count;

    if (membersCount >= memberLimits[this.req.getPlan()])
      throw new HttpException(
        'Haz alcanzado el limite de miembros, elimina miembros inactivos o cambia a un plan superior',
        400,
      );

    const data = { ...dto, churchId: this.req.getChurchId() };
    return res(200, await sql`insert into members ${sql(data)}`);
  }

  async put(dto: z.infer<typeof PutMemberSchema>) {
    return res(
      200,
      await sql`update members set ${sql({ ...dto })} where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`,
    );
  }

  async delete(dto: z.infer<typeof IdSchema>) {
    return res(
      200,
      await sql`delete from members where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`,
    );
  }

  async getStats() {
    const total = (
      await sql`select count(*) from members  WHERE "churchId" = ${this.req.getChurchId()} `
    )[0].count;

    const active = (
      await sql`select count(*) from members  WHERE "churchId" = ${this.req.getChurchId()} and "positionId" not in (2, 7)`
    )[0].count;

    const birthdays = (
      await sql`select count(*) from members WHERE "churchId" = ${this.req.getChurchId()} AND EXTRACT(MONTH FROM birthday) = ${new Date().getMonth() + 1}`
    )[0].count;

    return res(200, { active, total, birthdays });
  }

  async import(file: File) {
    const workbook = new excelJS.Workbook();

    let worksheet: excelJS.Worksheet;
    try {
      await workbook.xlsx.load(file.buffer);
      worksheet = workbook.getWorksheet(1);
    } catch (err) {
      throw new HttpException('Error al procesar el archivo', 400);
    }

    const members: z.infer<typeof PostMemberSchema>[] = [];

    const positionsList = await sql`select * from positions`;
    const positions = positionsList.reduce((acc, position) => {
      acc[position.name.toUpperCase()] = position.id?.toString();
      return acc;
    }, {});

    const civilStatus = {
      CASADO: 'Casado',
      SOLTERO: 'Soltero',
      DIVORCIADO: 'Divorciado',
      COMPROMETIDO: 'Comprometido',
      'UNION LIBRE': 'Union libre',
      VIUDA: 'Viuda',
    };

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      if (
        !row.values[1] &&
        !row.values[2] &&
        !row.values[3] &&
        !row.values[4] &&
        !row.values[5] &&
        !row.values[6] &&
        !row.values[7] &&
        !row.values[8] &&
        !row.values[9]
      )
        return;

      members.push({
        name: row.values[1],
        cellphone: row.values[2] || null,
        baptized: row.values[3] === 'si' ? 'true' : 'false',
        email: row.values[4]?.text || row.values[4] || null,
        genre: row.values[5]?.toUpperCase(),
        civilStatus: civilStatus[row.values[6]?.toUpperCase() || ''],
        positionId: positions[row.values[7]?.toUpperCase() || ''],
        birthday: row.values[8]?.toISOString
          ? row.values[8]?.toISOString()
          : row.values[8] || '',
        joinDate: row.values[9]?.toISOString
          ? row.values[9]?.toISOString()
          : row.values[9] || '',
      });

      const member = members.at(-1);

      if (!member.positionId)
        throw new HttpException(
          `Error en la fila ${rowNumber}: El cargo seleccionado no existe`,
          400,
        );

      if (!member.civilStatus)
        throw new HttpException(
          `Error en la fila ${rowNumber}: El estado civil seleccionado no existe`,
          400,
        );

      if (!(member.genre === 'M' || member.genre === 'F'))
        throw new HttpException(
          `Error en la fila ${rowNumber}: El genero debe ser 'F' o 'M'`,
          400,
        );

      if (isNaN(new Date(member.birthday).getTime()))
        throw new HttpException(
          `Error en la fila ${rowNumber}: Formato de fecha (nacimiento) incorrecto`,
          400,
        );

      if (isNaN(new Date(member.joinDate).getTime()))
        throw new HttpException(
          `Error en la fila ${rowNumber}: Formato de fecha (membresia) incorrecto`,
          400,
        );

      member.cellphone = member.cellphone?.toString() || null;
      member.email = member.email?.toString() || null;
      member.birthday = new Date(member.birthday);
      member.joinDate = new Date(member.joinDate);

      PostMemberSchema.parse(member);
    });

    await sql.begin(async (sql) => {
      const membersCount = Number(
        (
          await sql`select count(*) from members where "churchId" = ${this.req.getChurchId()}`
        )[0].count,
      );

      if (membersCount + members.length > memberLimits[this.req.getPlan()])
        throw new HttpException(
          'Haz alcanzado el limite de miembros, elimina miembros o cambia a un plan superior',
          400,
        );

      for (const member of members) {
        const data = { ...member, churchId: this.req.getChurchId() };
        await sql`insert into members ${sql(data)}`;
      }
    });

    return res(200, '');
  }
}
