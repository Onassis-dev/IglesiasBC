import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  IdSchema,
  PostCertificateSchema,
  getCertificateSchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { deleteImage, uploadImage } from 'src/utils/spaceStorageUtils';
import { res } from 'src/utils/response';
import { File } from '@nest-lab/fastify-multer';
import createCertificate from './certificates.create';
@Injectable()
export class CertificatesService {
  constructor(private readonly req: ContextProvider) {}

  async getMembers() {
    const members =
      await sql`select id, name from members where "churchId" = ${this.req.getChurchId()} order by name`;
    return res(200, members);
  }

  async getPastors() {
    const pastors =
      await sql`select id, name from members where ("positionId" = 3 or "positionId" = 4) and "churchId" = ${this.req.getChurchId()} order by name`;
    return res(200, pastors);
  }

  async uploadLogo(file: File) {
    if (!file) throw new HttpException('Error al subir la imagen', 400);
    const [{ logo }] =
      await sql`select logo from churches where id = ${this.req.getChurchId()}`;
    if (logo) {
      await deleteImage(logo);
    }

    const url = await uploadImage(file);
    await sql`update churches set logo = ${url} where id = ${this.req.getChurchId()}`;
    return res(200, url);
  }

  async get(query: z.infer<typeof getCertificateSchema>) {
    //Ambos filtros deben de ser iguales
    const rows = await sql`
    SELECT certificates.*, certificatetypes.name as type, COUNT(*) OVER () AS count
    FROM certificates
    JOIN certificatetypes ON certificates."certificateTypeId" = certificatetypes.id
    WHERE "churchId" = ${this.req.getChurchId()}
    AND (${query.name ? sql`LOWER("member") LIKE LOWER('%' || ${query.name} || '%')` : sql`TRUE`})
    ORDER BY certificates.id DESC
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}`;

    return res(200, { rows, count: rows[0]?.count || 0 });
  }

  async post(body: z.infer<typeof PostCertificateSchema>) {
    const [church] =
      await sql`select name from churches where id = ${this.req.getChurchId()}`;

    const data = {
      ...body,
      church: church?.name,
      churchId: this.req.getChurchId(),
      certificateTypeId: body.certificateTypeId,
    };

    if (!data.member2) delete data.member2;
    if (!data.pastor2) delete data.pastor2;
    delete data.design;

    await sql.begin(async () => {
      const [certificate] =
        await sql`insert into certificates ${sql(data)} returning id`;

      const buffer = await createCertificate({
        ...body,
        churchId: this.req.getChurchId(),
      });

      const url = await uploadImage({
        buffer,
        originalname: `${certificate.id}.pdf`,
        fieldname: 'image',
        encoding: 'utf-8',
        mimetype: 'application/pdf',
      });

      await sql`update certificates set url = ${url} where id = ${certificate.id}`;
    });

    return res(200, null);
  }

  async delete(body: z.infer<typeof IdSchema>) {
    await sql.begin(async () => {
      const [deleted] =
        await sql`delete from certificates where id = ${body.id} and "churchId" = ${this.req.getChurchId()} returning url`;
      if (deleted?.url) await deleteImage(deleted.url);
    });

    return res(200, null);
  }

  async getStats() {
    const total = (
      await sql`select count(*) from certificates  WHERE "churchId" = ${this.req.getChurchId()} `
    )[0].count;

    const recent = (
      await sql`select count(*) from certificates  WHERE "churchId" = ${this.req.getChurchId()} and "created" > NOW() - INTERVAL '1 month'`
    )[0].count;

    const baptized = (
      await sql`select count(*) from certificates  WHERE "churchId" = ${this.req.getChurchId()} and "certificateTypeId" = 1 `
    )[0].count;

    return res(200, { recent, total, baptized });
  }
}
