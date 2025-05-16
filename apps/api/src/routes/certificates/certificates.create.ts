import { PDFDocument, PDFPage } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs';
import * as path from 'path';
import QRCode from 'qrcode';
import {
  CertificateParams,
  drawAlignedLine,
  drawAlignedText,
  drawCenteredText,
  getCertificateText,
  loadFont,
} from './certificates.lib';
import { PostCertificateSchema } from '@iglesiasbc/schemas';
import sql from 'src/utils/db';
import z from 'zod';
import { designs } from './certificates.designs';

const createCertificate = async (
  body: z.infer<typeof PostCertificateSchema> & {
    churchId: number;
    code: string;
  },
) => {
  const [type] =
    await sql`select name from certificatetypes where id = ${body.certificateTypeId}`;
  const [church] =
    await sql`select name from churches where id = ${body.churchId}`;

  const img = (
    await sql`select logo from churches where id = ${body.churchId}`
  )[0]?.logo;

  const members = body.member + ((body.member2 && ` y ${body.member2}`) || '');

  const text = getCertificateText(
    type.name,
    new Date(body.expeditionDate),
    church.name,
  );

  const certificateInfo = {
    ...body,
    type: type.name,
    church: church.name,
    members,
    text,
    img,
  };

  const existingPDF = fs.readFileSync(
    path.join(
      __dirname,
      `../../../resources/pdf/${certificateInfo.design}.pdf`,
    ),
  );

  const pdfDoc = await PDFDocument.load(existingPDF);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  await drawBaseCertificate(
    pdfDoc,
    page,
    certificateInfo,
    designs[certificateInfo.design],
  );

  return Buffer.from((await pdfDoc.save()).buffer);
};

export default createCertificate;

async function drawBaseCertificate(
  pdfDoc: PDFDocument,
  page: PDFPage,
  info: Record<string, any>,
  params: CertificateParams,
) {
  if (info.img) {
    let imageBytes;
    try {
      imageBytes = await fetch(info.img).then(async (res) => ({
        buffer: await res.arrayBuffer(),
        url: res.headers.get('content-type'),
      }));
    } catch (err) {}

    let image;

    if (imageBytes) {
      if (imageBytes.url.includes('image/jp')) {
        image = await pdfDoc.embedJpg(imageBytes.buffer);
      } else if (imageBytes.url.includes('image/png')) {
        image = await pdfDoc.embedPng(imageBytes.buffer);
      }

      if (image) {
        const imgDimensions = image.scale(0.5);

        const height = 80;
        const width = height * (imgDimensions.width / imgDimensions.height);

        page.drawImage(image, {
          x: page.getWidth() / 2 - width / 2,
          y: params.image.y,
          width: width,
          height: height,
        });
      }
    }
  }

  if (info.validate) {
    const code = Buffer.from(info.code.replace(/-/g, ''), 'hex').toString(
      'base64url',
    );
    console.log(code);
    const qrDataUrl = await QRCode.toDataURL(
      'http://iglesiasbc.com/c/' + code,
      {
        errorCorrectionLevel: 'L',
        margin: 0,
        color: {
          dark: params.qr.color,
          light: '#00000000',
        },
      },
    );
    const base64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qr = await pdfDoc.embedPng(Buffer.from(base64, 'base64url'));

    page.drawImage(qr, {
      x:
        params.qr.x === 'center'
          ? page.getWidth() / 2 - params.qr.size / 2
          : params.qr.x,
      y: params.qr.y,
      width: params.qr.size,
      height: params.qr.size,
    });
  }

  pdfDoc.registerFontkit(fontkit);

  const titleFont = await pdfDoc.embedFont(loadFont(params.title.font));
  const membersFont = await pdfDoc.embedFont(loadFont(params.members.font));
  const textFont = await pdfDoc.embedFont(loadFont(params.text.font));
  const signsFont = await pdfDoc.embedFont(loadFont(params.signs.font));

  drawCenteredText({
    text: params.title.text(info.type),
    page: page,
    y: params.title.y,
    size: params.title.size,
    font: titleFont,
    color: params.title.color,
    maxWidth: 1000,
  });

  if (params.subtitle) {
    drawCenteredText({
      text: params.subtitle.text(info.type),
      page: page,
      y: params.subtitle.y,
      size: params.subtitle.size,
      font: titleFont,
      color: params.subtitle.color,
      maxWidth: 1000,
    });
  }

  drawCenteredText({
    text: info.members,
    page: page,
    y: params.members.y,
    size: params.members.size,
    font: membersFont,
    color: params.members.color,
    maxWidth: 0.82,
    optionalOffset: params.members.offset || params.members.size,
  });

  drawCenteredText({
    text: info.text,
    page: page,
    y: params.text.y,
    size: params.text.size,
    font: textFont,
    color: params.text.color,
    maxWidth: params.text.maxWidth,
  });

  if (info.pastor && info.pastor2) {
    drawAlignedText({
      text: info.pastor,
      page: page,
      y: params.signs.y,
      size: params.signs.size,
      font: signsFont,
      color: params.signs.color,
      centerX: params.signs.offset,
    });
    drawAlignedLine({
      page: page,
      y: params.signs.y + params.signs.size + 3,
      size: 200,
      color: params.signs.color,
      centerX: params.signs.offset,
    });
  }

  if (info.pastor2) {
    drawAlignedText({
      text: info.pastor2,
      page: page,
      y: params.signs.y,
      size: params.signs.size,
      font: signsFont,
      color: params.signs.color,
      centerX: -params.signs.offset,
    });
    drawAlignedLine({
      page: page,
      y: params.signs.y + params.signs.size + 3,
      size: 200,
      color: params.signs.color,
      centerX: -params.signs.offset,
    });
  }

  if (info.pastor && !info.pastor2) {
    drawAlignedText({
      text: info.pastor,
      page: page,
      y: params.signs.y,
      size: params.signs.size,
      font: signsFont,
      color: params.signs.color,
      centerX: params.signs.offset,
    });
    drawAlignedLine({
      page: page,
      y: params.signs.y + params.signs.size + 3,
      size: 200,
      color: params.signs.color,
      centerX: params.signs.offset,
    });
  }
}
