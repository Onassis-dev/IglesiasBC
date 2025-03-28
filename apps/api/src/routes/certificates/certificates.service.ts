import { HttpException, Injectable } from '@nestjs/common';
import { ContextProvider } from 'src/interceptors/contextProvider';
import {
  IdSchema,
  PostCertificateSchema,
  getCertificateSchema,
} from '@iglesiasbc/schemas';
import { z } from 'zod';
import sql from 'src/utils/db';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs';
import * as path from 'path';
import { deleteImage, uploadImage } from 'src/utils/spaceStorageUtils';
import {
  drawAlignedLine,
  drawAlignedText,
  drawCenteredText,
  getCertificateText,
} from './utils';
import { res } from 'src/utils/response';
import { File } from '@nest-lab/fastify-multer';

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
    AND (${query.name ? sql`LOWER("memberName") LIKE LOWER('%' || ${query.name} || '%')` : sql`1=1`})
    ORDER BY created DESC, certificates.id DESC
    LIMIT 10 OFFSET ${10 * (parseInt(query.page) - 1)}`;

    return res(200, { rows, count: rows[0]?.count || 0 });
  }

  async post(body: z.infer<typeof PostCertificateSchema>) {
    const church =
      await sql`select name from churches where id = ${this.req.getChurchId()}`;

    const data = {
      memberName: body.member,
      member2Name: body.member2,
      pastorName: body.pastor,
      pastor2Name: body.pastor2,
      churchName: church[0]?.name,
      churchId: this.req.getChurchId(),
      certificateTypeId: body.certificateTypeId,
      expeditionDate: body.expeditionDate,
    };

    if (!data.member2Name) delete data.member2Name;
    if (!data.pastor2Name) delete data.pastor2Name;

    return res(200, await sql`insert into certificates ${sql(data)}`);
  }

  async delete(body: z.infer<typeof IdSchema>) {
    return res(
      200,
      await sql`delete from certificates where id = ${body.id} and "churchId" = ${this.req.getChurchId()}`,
    );
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

  async download(body: z.infer<typeof IdSchema>) {
    const [certificateInfo] =
      await sql`select certificates.*, certificatetypes.name as type
      from certificates
      join certificatetypes on certificates."certificateTypeId" = certificatetypes.id
      where certificates.id = ${parseInt(body.id)} and certificates."churchId" = ${this.req.getChurchId()} `;

    const img = (
      await sql`select logo from churches where id = ${this.req.getChurchId()}`
    )[0]?.logo;

    const text = getCertificateText(
      certificateInfo.type,
      certificateInfo.expeditionDate,
      certificateInfo.churchName,
    );

    const existingPDF = fs.readFileSync(
      path.join(__dirname, `../../../resources/pdf/Basico.pdf`),
    );

    const pdfDoc = await PDFDocument.load(existingPDF);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    if (img) {
      let imageBytes;
      try {
        imageBytes = await fetch(img).then((res) => res.arrayBuffer());
      } catch (err) {}

      let image;

      if (imageBytes) {
        if (img.slice(-3) === 'jpg' || img.slice(-3) === 'jpeg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (img.slice(-3) === 'png') {
          image = await pdfDoc.embedPng(imageBytes);
        }

        if (image) {
          const imgDimensions = image.scale(0.5);

          const height = 80;
          const width = height * (imgDimensions.width / imgDimensions.height);

          firstPage.drawImage(image, {
            x: firstPage.getWidth() / 2 - width / 2,
            y: 480,
            width: width,
            height: height,
          });
        }
      }
    }

    const members =
      certificateInfo.memberName +
      ((certificateInfo.member2Name && ` y ${certificateInfo.member2Name}`) ||
        '');

    pdfDoc.registerFontkit(fontkit);
    const baseFontBytes = fs.readFileSync(
      path.join(__dirname, '../../../resources/fonts/playfair.ttf'),
    );
    const customFontBytes = fs.readFileSync(
      path.join(__dirname, '../../../resources/fonts/Allura-Regular.ttf'),
    );
    const baseFont = await pdfDoc.embedFont(baseFontBytes);
    const customFont = await pdfDoc.embedFont(customFontBytes);

    drawCenteredText({
      text: `Certificado de ${certificateInfo.type}`.toUpperCase(),
      page: firstPage,
      y: 430,
      size: 20,
      font: baseFont,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: 0.9,
    });

    drawCenteredText({
      text: members,
      page: firstPage,
      y: 360,
      size: 50,
      font: customFont,
      color: rgb(0, 0, 0),
      maxWidth: 0.82,
      optionalOffset: 40,
    });

    drawCenteredText({
      text: text,
      page: firstPage,
      y: 230,
      size: 15,
      font: baseFont,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: 0.7,
    });

    if (certificateInfo.pastorName && certificateInfo.pastor2Name) {
      drawAlignedText({
        text: certificateInfo.pastorName,
        page: firstPage,
        y: 80,
        size: 15,
        font: baseFont,
        color: rgb(0.3, 0.3, 0.3),
        centerX: 200,
      });
      drawAlignedLine({
        page: firstPage,
        y: 100,
        size: 200,
        color: rgb(0.3, 0.3, 0.3),
        centerX: 200,
      });
    }

    if (certificateInfo.pastor2Name) {
      drawAlignedText({
        text: certificateInfo.pastor2Name,
        page: firstPage,
        y: 80,
        size: 15,
        font: baseFont,
        color: rgb(0.3, 0.3, 0.3),
        centerX: -200,
      });
      drawAlignedLine({
        page: firstPage,
        y: 100,
        size: 200,
        color: rgb(0.3, 0.3, 0.3),
        centerX: -200,
      });
    }

    if (certificateInfo.pastorName && !certificateInfo.pastor2Name) {
      drawAlignedText({
        text: certificateInfo.pastorName,
        page: firstPage,
        y: 80,
        size: 15,
        font: baseFont,
        color: rgb(0.3, 0.3, 0.3),
        centerX: firstPage.getWidth() / 2,
      });
      drawAlignedLine({
        page: firstPage,
        y: 100,
        size: 200,
        color: rgb(0.3, 0.3, 0.3),
        centerX: firstPage.getWidth() / 2,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return res(200, pdfBytes);
  }
}
