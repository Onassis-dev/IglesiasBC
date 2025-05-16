import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PDFFont, PDFPage, RGB } from 'pdf-lib';

export const getCertificateText = (
  type: string,
  date: Date,
  churchName: string,
) => {
  const dateStr = format(date, 'PPP', { locale: es });

  if (type === 'Bautizo')
    return `Ha recibido el sacramento del bautismo, incorporándose así a la comunidad de la Iglesia y siendo acogido como miembro del cuerpo de Cristo el día ${dateStr} en la iglesia ${churchName}.`;

  if (type === 'Confirmación')
    return `Ha recibido el sacramento de la confirmación, reafirmando su fe y compromiso con Cristo el día ${dateStr} en la iglesia ${churchName}.`;

  if (type === 'Matrimonio')
    return `Han celebrado el sacramento del matrimonio, uniéndose en sagrado vínculo de amor y compromiso el día ${dateStr} en la iglesia ${churchName}.`;

  if (type === 'Membresía')
    return `Ha sido aceptado como miembro de pleno derecho de nuestra comunidad, comprometiéndose a vivir y promover los valores y principios que nos guían el día ${dateStr} en la iglesia ${churchName}.`;

  if (type === 'Quince años')
    return `Ha celebrado su quinceañera, marcando su transición de niña a mujer bajo la bendición de Dios el día ${dateStr} en la iglesia ${churchName}.`;

  if (type === 'Recomendación')
    return `Ha recibido esta recomendación por su testimonio de fe y buen comportamiento cristiano, otorgada el día ${dateStr} en la iglesia ${churchName}.`;

  return '';
};

export const drawCenteredText = (props: {
  page: PDFPage;
  y: number;
  size: number;
  font: PDFFont;
  color: RGB;
  text: string;
  maxWidth: number;
  optionalOffset?: number;
}) => {
  const width = props.page.getWidth();
  const maxWidth = width * props.maxWidth;

  const lines: string[] = [];
  let currentLine = '';

  props.text.split(' ').forEach((word) => {
    const lineWithWord = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = props.font.widthOfTextAtSize(lineWithWord, props.size);

    if (lineWidth <= maxWidth) {
      currentLine = lineWithWord;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  lines.push(currentLine);

  const lineHeight = props.size;
  let currentY = props.y;

  lines.forEach((line) => {
    if (lines.length === 1 && props.optionalOffset)
      currentY -= props.optionalOffset;

    const textWidth = props.font.widthOfTextAtSize(line, props.size);
    props.page.drawText(line, {
      x: (width - textWidth) / 2,
      y: currentY,
      size: props.size,
      font: props.font,
      color: props.color,
    });
    currentY -= lineHeight;
  });
};

export const drawAlignedText = (props: {
  page: PDFPage;
  y: number;
  size: number;
  font: PDFFont;
  color: RGB;
  text: string;
  centerX: number;
}) => {
  let positionX = 0;

  const textWidth = props.font.widthOfTextAtSize(props.text, props.size);

  if (props.centerX >= 0) {
    positionX = props.centerX - textWidth / 2;
  } else {
    const width = props.page.getWidth();
    positionX = width + props.centerX - textWidth / 2;
  }

  props.page.drawText(props.text, {
    x: positionX,
    y: props.y,
    size: props.size,
    font: props.font,
    color: props.color,
  });
};

export const drawAlignedLine = (props: {
  page: PDFPage;
  y: number;
  size: number;
  color: RGB;
  centerX: number;
}) => {
  let startX = 0;
  let endX = 0;

  if (props.centerX < 0) {
    const width = props.page.getWidth();
    props.centerX = width + props.centerX;
  }

  startX = props.centerX - props.size / 2;
  endX = props.centerX + props.size / 2;

  props.page.drawLine({
    start: { x: startX, y: props.y },
    end: { x: endX, y: props.y },
    thickness: 1,
    color: props.color,
    opacity: 1,
  });
};

export type Font =
  | 'playfair'
  | 'Allura-Regular'
  | 'GildaDisplay-Regular'
  | 'Lato-Bold'
  | 'Lato-Regular'
  | 'Lato-Thin'
  | 'LibreBaskerville-Bold'
  | 'LibreBaskerville-Italic'
  | 'LibreBaskerville-Regular'
  | 'playfair'
  | 'Poppins-Bold'
  | 'Poppins-Regular'
  | 'Poppins-Thin'
  | 'Radley-Italic'
  | 'Radley-Regular'
  | 'Montserrat-Bold'
  | 'Montserrat-Regular'
  | 'Montserrat-Thin'
  | 'Montserrat-Medium'
  | 'SendFlowers-Regular'
  | 'MsMadi-Regular';

export type CertificateParams = {
  image: {
    y: number;
    height: number;
  };
  title: {
    y: number;
    size: number;
    color: RGB;
    font: Font;
    text: (type: string) => string;
  };
  subtitle?: {
    y: number;
    size: number;
    color: RGB;
    font: Font;
    text: (type: string) => string;
  };
  members: {
    y: number;
    size: number;
    color: RGB;
    font: Font;
    maxWidth: number;
    offset?: number;
  };
  text: {
    y: number;
    size: number;
    color: RGB;
    font: Font;
    maxWidth: number;
  };
  signs: {
    y: number;
    font: Font;
    size: number;
    color: RGB;
    offset: number;
    centerX: number;
  };
  qr: {
    y: number;
    x: number | 'center';
    size: number;
    color: string;
  };
};

export const loadFont = (font: Font) => {
  return fs.readFileSync(
    path.join(__dirname, `../../../resources/fonts/${font}.ttf`),
  );
};
