import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  DeleteSchema,
  EditClassSchema,
  PostClassSchema,
  PostStudentSchema,
  PostSubjectSchema,
  getSchema,
} from './classes.schema';
import { z } from 'zod';
import sql from 'src/utils/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable()
export class ClassesService {
  constructor(private readonly req: ContextProvider) {}

  async read(query: z.infer<typeof getSchema>) {
    //Ambos filtros deben de ser iguales
    const rows = await sql`
    SELECT *, COUNT(*) OVER () AS count
    FROM classes
    WHERE "churchId" = ${this.req.getChurchId()} 
    AND (${query.name ? sql`LOWER(title) LIKE LOWER('%' || ${query.name} || '%')` : sql`1=1`})
    ORDER BY id
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}`;

    return { rows, count: rows[0]?.count || 0 };
  }

  async readOne(dto: z.infer<typeof DeleteSchema>) {
    const data =
      await sql`select id, title from classes where id = ${dto.id} and "churchId" = ${this.req.getChurchId()}`;

    if (data.length === 0) throw new HttpException('', 404);
    return data[0];
  }

  async readData(params: z.infer<typeof DeleteSchema>) {
    const subjects =
      await sql`select * from subjects where "classId" = ${parseInt(params.id)} and (select "churchId" from classes where id = "classId") = ${this.req.getChurchId()}`;

    const students = await sql`select members.name, students.id from
      students join members
      on students."memberId" = members.id
      where students."classId" = ${parseInt(params.id)}
      and (select "churchId" from classes where id = students."classId") = ${this.req.getChurchId()}`;

    return { subjects, students };
  }

  async getMembers() {
    const members =
      await sql`select id, name from members where "churchId" = ${this.req.getChurchId()} order by name`;
    return members;
  }

  async post(body: z.infer<typeof PostClassSchema>) {
    const data = { ...body, churchId: this.req.getChurchId() };
    return await sql`insert into classes ${sql(data)}`;
  }

  async edit(body: z.infer<typeof EditClassSchema>) {
    return await sql`update classes set ${sql(body)} where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async postSubject(body: z.infer<typeof PostSubjectSchema>) {
    const classId = (
      await sql`select id from classes where id = ${body.classId} and "churchId" = ${this.req.getChurchId()}`
    )[0]?.id;
    return await sql`insert into subjects ${sql({ classId, title: body.title })}`;
  }

  async postStudent(body: z.infer<typeof PostStudentSchema>) {
    const classId = (
      await sql`select id from classes where id = ${body.classId} and "churchId" = ${this.req.getChurchId()}`
    )[0]?.id;
    const memberId = (
      await sql`select id from members where id = ${body.memberId} and "churchId" = ${this.req.getChurchId()}`
    )[0]?.id;

    return await sql`insert into students ${sql({ memberId, classId })}`;
  }

  async delete(body: z.infer<typeof DeleteSchema>) {
    await sql`delete from students where "classId" = ${body.id} and (select "churchId" from classes where id = "classId") = ${this.req.getChurchId()}`;
    await sql`delete from subjects where "classId" = ${body.id} and (select "churchId" from classes where id = "classId") = ${this.req.getChurchId()}`;

    return await sql`delete from classes where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`;
  }

  async deleteStudent(body: z.infer<typeof DeleteSchema>) {
    return await sql`delete from students where id = ${body.id} and (select "churchId" from classes where id = "classId") = ${this.req.getChurchId()}`;
  }

  async deleteSubject(body: z.infer<typeof DeleteSchema>) {
    return await sql`delete from subjects where id = ${body.id} and (select "churchId" from classes where id = "classId") = ${this.req.getChurchId()}`;
  }

  async downloadAssistanceList(params: z.infer<typeof DeleteSchema>) {
    const classInfo = (
      await sql`select title, (select name from churches where id = "churchId") as "churchName" from classes where id = ${params.id} and "churchId" = ${this.req.getChurchId()}`
    )[0];

    const students = await sql`select members.name, students.id from
      students join members
      on students."memberId" = members.id
      where students."classId" = ${parseInt(params.id)}
      and (select "churchId" from classes where id = students."classId") = ${this.req.getChurchId()}`;

    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.setTextColor('#333');
    doc.text(classInfo.churchName, 14, 15);

    doc.setTextColor('#000');
    doc.setFontSize(16);
    doc.text(classInfo.title, 15, 22);

    doc.line(14, 33, 114, 33);

    const studentsCols: any[] = students.map((v, i) => ({
      number: i + 1,
      name: v.name,
    }));

    const studentsLength = studentsCols.length;
    for (let i = 0; i < 5; i++) {
      studentsCols.push({ number: studentsLength + i + 1 });
    }

    autoTable(doc, {
      startY: 36,
      styles: { lineWidth: 0.1, lineColor: 0, fontSize: 10 },
      columnStyles: {
        number: { cellWidth: 9 },
        '11': { cellWidth: 7 },
        '22': { cellWidth: 7 },
        '33': { cellWidth: 7 },
        '44': { cellWidth: 7 },
        '55': { cellWidth: 7 },
        '66': { cellWidth: 7 },
        '77': { cellWidth: 40 },
      },
      headStyles: {
        fillColor: '#e7e7e7',
        minCellHeight: 20,
        valign: 'bottom',
        textColor: '#000000',
      },

      body: studentsCols,
      columns: [
        { header: 'No.', dataKey: 'number' },
        { header: 'Nombre', dataKey: 'name' },
        { header: '', dataKey: '11' },
        { header: '', dataKey: '22' },
        { header: '', dataKey: '33' },
        { header: '', dataKey: '44' },
        { header: '', dataKey: '55' },
        { header: '', dataKey: '66' },
        { header: 'Comentarios', dataKey: '77' },
      ],
    });

    const buffer = Buffer.from(doc.output('arraybuffer'));

    return buffer;
  }

  async getStats() {
    const classes = (
      await sql`select count(*) from classes  WHERE "churchId" = ${this.req.getChurchId()} `
    )[0].count;

    const subjects = (
      await sql`select count(*) from subjects 
      join classes on subjects."classId" = classes.id
      WHERE classes."churchId" = ${this.req.getChurchId()}`
    )[0].count;

    const students = (
      await sql`SELECT COUNT(DISTINCT students."memberId")
      FROM students
      JOIN classes ON students."classId" = classes.id
      WHERE classes."churchId" = ${this.req.getChurchId()}`
    )[0].count;

    return { classes, subjects, students };
  }
}
