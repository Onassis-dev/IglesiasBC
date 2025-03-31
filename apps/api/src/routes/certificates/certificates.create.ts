import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs';
import * as path from 'path';
import {
  drawAlignedLine,
  drawAlignedText,
  drawCenteredText,
  Font,
  getCertificateText,
  loadFont,
} from './certificates.lib';
import { PostCertificateSchema } from '@iglesiasbc/schemas';
import sql from 'src/utils/db';
import z from 'zod';

type Parameters = {
  imagePosition: number;
  baseFont: Font;
  customFont: Font;
};

const parameters: Parameters[] = [
  {
    imagePosition: 470,
    baseFont: 'playfair',
    customFont: 'Allura-Regular',
  },
  {
    imagePosition: 470,
    baseFont: 'playfair',
    customFont: 'Allura-Regular',
  },
  {
    imagePosition: 470,
    baseFont: 'playfair',
    customFont: 'Allura-Regular',
  },
  {
    imagePosition: 470,
    baseFont: 'playfair',
    customFont: 'Allura-Regular',
  },
];

const createCertificate = async (
  body: z.infer<typeof PostCertificateSchema> & { churchId: number },
) => {
  console.log(body.design);
  const [type] =
    await sql`select name from certificatetypes where id = ${body.certificateTypeId}`;
  const [church] =
    await sql`select name from churches where id = ${body.churchId}`;

  const certificateInfo = {
    ...body,
    type: type.name,
    church: church.name,
  };
  const img = (
    await sql`select logo from churches where id = ${body.churchId}`
  )[0]?.logo;

  const text = getCertificateText(
    certificateInfo.type,
    new Date(certificateInfo.expeditionDate),
    certificateInfo.church,
  );

  const existingPDF = fs.readFileSync(
    path.join(
      __dirname,
      `../../../resources/pdf/${certificateInfo.design}.pdf`,
    ),
  );

  const pdfDoc = await PDFDocument.load(existingPDF);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  if (img) {
    let imageBytes;
    try {
      imageBytes = await fetch(img).then(async (res) => ({
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
          y: parameters[certificateInfo.design].imagePosition,
          width: width,
          height: height,
        });
      }
    }
  }

  const members =
    certificateInfo.member +
    ((certificateInfo.member2 && ` y ${certificateInfo.member2}`) || '');

  pdfDoc.registerFontkit(fontkit);

  const baseFont = await pdfDoc.embedFont(
    loadFont(parameters[certificateInfo.design].baseFont),
  );
  const customFont = await pdfDoc.embedFont(
    loadFont(parameters[certificateInfo.design].customFont),
  );

  drawCenteredText({
    text: `Certificado de ${certificateInfo.type}`.toUpperCase(),
    page: page,
    y: 430,
    size: 20,
    font: baseFont,
    color: rgb(0.3, 0.3, 0.3),
    maxWidth: 0.9,
  });

  drawCenteredText({
    text: members,
    page: page,
    y: 360,
    size: 50,
    font: customFont,
    color: rgb(0, 0, 0),
    maxWidth: 0.82,
    optionalOffset: 40,
  });

  drawCenteredText({
    text: text,
    page: page,
    y: 230,
    size: 15,
    font: baseFont,
    color: rgb(0.3, 0.3, 0.3),
    maxWidth: 0.7,
  });

  if (certificateInfo.pastor && certificateInfo.pastor2) {
    drawAlignedText({
      text: certificateInfo.pastor,
      page: page,
      y: 80,
      size: 15,
      font: baseFont,
      color: rgb(0.3, 0.3, 0.3),
      centerX: 250,
    });
    drawAlignedLine({
      page: page,
      y: 100,
      size: 220,
      color: rgb(0.3, 0.3, 0.3),
      centerX: 250,
    });
  }

  if (certificateInfo.pastor2) {
    drawAlignedText({
      text: certificateInfo.pastor2,
      page: page,
      y: 80,
      size: 15,
      font: baseFont,
      color: rgb(0.3, 0.3, 0.3),
      centerX: -250,
    });
    drawAlignedLine({
      page: page,
      y: 100,
      size: 220,
      color: rgb(0.3, 0.3, 0.3),
      centerX: -250,
    });
  }

  if (certificateInfo.pastor && !certificateInfo.pastor2) {
    drawAlignedText({
      text: certificateInfo.pastor,
      page: page,
      y: 80,
      size: 15,
      font: baseFont,
      color: rgb(0.3, 0.3, 0.3),
      centerX: page.getWidth() / 2,
    });
    drawAlignedLine({
      page: page,
      y: 100,
      size: 200,
      color: rgb(0.3, 0.3, 0.3),
      centerX: page.getWidth() / 2,
    });
  }

  return Buffer.from((await pdfDoc.save()).buffer);
};

export default createCertificate;
