import { rgb } from 'pdf-lib';
import { CertificateParams } from './certificates.lib';

// Carta: 792 x 612

export const designs: Record<string, CertificateParams> = {
  '1': {
    image: {
      y: 500,
      height: 60,
    },
    title: {
      y: 450,
      size: 20,
      color: rgb(0.3, 0.3, 0.3),
      font: 'playfair',
      text: (type: string) => `Certificado de ${type}`.toUpperCase(),
    },
    members: {
      y: 380,
      size: 64,
      offset: 32,
      color: rgb(0, 0, 0),
      font: 'MsMadi-Regular',
      maxWidth: 0.75,
    },
    text: {
      y: 270,
      size: 12,
      color: rgb(0.3, 0.3, 0.3),
      font: 'playfair',
      maxWidth: 0.6,
    },
    signs: {
      y: 110,
      font: 'playfair',
      size: 14,
      color: rgb(0.3, 0.3, 0.3),
      offset: 230,
      centerX: 250,
    },
    qr: {
      y: 88,
      x: 'center',
      size: 40,
      color: '#4D4D4DFF',
    },
  },

  '2': {
    image: {
      y: 470,
      height: 60,
    },
    title: {
      y: 430,
      size: 32,
      color: rgb(0.698, 0.4549, 0.0353),
      font: 'playfair',
      text: (type: string) => `Certificado de ${type}`.toUpperCase(),
    },
    members: {
      y: 365,
      size: 64,
      color: rgb(0.2, 0.2, 0.2),
      font: 'Allura-Regular',
      maxWidth: 0.7,
      offset: 32,
    },
    text: {
      y: 250,
      size: 15,
      color: rgb(0.2, 0.2, 0.2),
      font: 'playfair',
      maxWidth: 0.7,
    },
    signs: {
      y: 90,
      font: 'playfair',
      size: 14,
      color: rgb(0.698, 0.4549, 0.0353),
      offset: 230,
      centerX: 250,
    },
    qr: {
      y: 80,
      x: 'center',
      size: 40,
      color: '#b27409ff',
    },
  },

  '3': {
    image: {
      y: 50,
      height: 50,
    },
    title: {
      y: 468,
      size: 50,
      color: rgb(0.2039, 0.2039, 0.2039),
      font: 'LibreBaskerville-Regular',
      text: () => `CERTIFICADO`,
    },
    subtitle: {
      y: 438,
      size: 26,
      color: rgb(0.6588, 0.5137, 0.1412),
      font: 'LibreBaskerville-Regular',
      text: (type: string) => `DE ${type}`.toUpperCase(),
    },
    members: {
      y: 360,
      size: 70,
      color: rgb(0.2039, 0.2039, 0.2039),
      font: 'MsMadi-Regular',
      maxWidth: 0.8,
    },
    text: {
      y: 230,
      size: 15,
      color: rgb(0.2039, 0.2039, 0.2039),
      font: 'Radley-Regular',
      maxWidth: 0.6,
    },
    signs: {
      y: 80,
      font: 'Radley-Regular',
      size: 14,
      color: rgb(0.6588, 0.5137, 0.1412),
      offset: 230,
      centerX: 250,
    },
    qr: {
      y: 552,
      x: 732,
      size: 40,
      color: '#343434FF',
    },
  },

  '4': {
    image: {
      y: 55,
      height: 50,
    },
    title: {
      y: 520,
      size: 36,
      color: rgb(0.1804, 0.1804, 0.1804),
      font: 'Montserrat-Bold',
      text: () => `CERTIFICADO DE`,
    },
    subtitle: {
      y: 480,
      size: 36,
      color: rgb(0.1804, 0.1804, 0.1804),
      font: 'Montserrat-Bold',
      text: (type: string) => `${type}`.toUpperCase(),
    },
    members: {
      y: 392,
      size: 70,
      color: rgb(0.1804, 0.1804, 0.1804),
      font: 'MsMadi-Regular',
      maxWidth: 0.8,
    },
    text: {
      y: 260,
      size: 12,
      color: rgb(0.1804, 0.1804, 0.1804),
      font: 'Lato-Regular',
      maxWidth: 0.5,
    },
    signs: {
      y: 80,
      font: 'Lato-Regular',
      size: 14,
      color: rgb(0.1804, 0.1804, 0.1804),
      offset: 230,
      centerX: 250,
    },
    qr: {
      y: 12,
      x: 740,
      size: 40,
      color: '#2D2D2DFF',
    },
  },

  '5': {
    image: {
      y: 507,
      height: 50,
    },
    title: {
      y: 452,
      size: 64,
      color: rgb(0.0745, 0.1608, 0.1647),
      font: 'Montserrat-Bold',
      text: () => 'CERTIFICADO',
    },
    subtitle: {
      y: 430,
      size: 18,
      color: rgb(0.0745, 0.1608, 0.1647),
      font: 'Montserrat-Bold',
      text: (type: string) => `DE ${type}`.toUpperCase(),
    },
    members: {
      y: 358,
      size: 45,
      color: rgb(0.0745, 0.1608, 0.1647),
      font: 'Lato-Bold',
      maxWidth: 0.85,
    },
    text: {
      y: 240,
      size: 16,
      color: rgb(0.0745, 0.1608, 0.1647),
      font: 'Poppins-Regular',
      maxWidth: 0.7,
    },
    signs: {
      y: 75,
      font: 'Lato-Regular',
      size: 16,
      color: rgb(0.0745, 0.1608, 0.1647),
      offset: 250,
      centerX: 230,
    },
    qr: {
      y: 60,
      x: 'center',
      size: 40,
      color: '#13292aff',
    },
  },
};
