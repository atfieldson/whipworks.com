/**
 * Snakewhip gallery data for the Design-a-Snakewhip left panel.
 *
 * Image naming convention: SnW[number][angle].jpg
 *   Angles: Wide, Concho, Heel
 *   All images are 4:3 ratio.
 *
 * S3 path: gallery/snakewhip/
 */

const GALLERY_BASE_URL = 'https://d3ruufruf2uqog.cloudfront.net/gallery/snakewhip';

export type SnakewhipGalleryWhip = {
  type: 'snakewhip';
  id: string;
  images: {
    wide?: string;
    concho?: string;
    heel?: string;
  };
  specs: {
    primaryColor: string;
    secondaryColor: string;
    handleDesign: string;
    waxed: boolean;
    whipLength: string;
    concho: string;
    heelLoop: string;
  };
};

export type SnakewhipGalleryBreakImage = {
  type: 'break';
  id: string;
  image: string;
  description: string;
  layout: 'landscape' | 'portrait';
};

export type SnakewhipGalleryItem = SnakewhipGalleryWhip | SnakewhipGalleryBreakImage;

export const snakewhipGalleryItems: SnakewhipGalleryItem[] = [
  {
    id: 'SnW1',
    type: 'snakewhip',
    images: {
      wide: `${GALLERY_BASE_URL}/SnW1Wide.jpg`,
      concho: `${GALLERY_BASE_URL}/SnW1Concho.jpg`,
      heel: `${GALLERY_BASE_URL}/SnW1Heel.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Imperial Red',
      handleDesign: 'Herringbone',
      waxed: true,
      whipLength: '3 Feet',
      concho: 'Celtic Silver',
      heelLoop: 'Squared',
    },
  },
  {
    id: 'SnW2',
    type: 'snakewhip',
    images: {
      wide: `${GALLERY_BASE_URL}/SnW2Wide.jpg`,
      concho: `${GALLERY_BASE_URL}/SnW2Concho.jpg`,
      heel: `${GALLERY_BASE_URL}/SnW2Heel.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Caribbean',
      handleDesign: 'Herringbone',
      waxed: true,
      whipLength: '4 Feet',
      concho: 'Celtic Silver',
      heelLoop: 'Squared',
    },
  },
  {
    id: 'SnW29',
    type: 'snakewhip',
    images: {
      wide: `${GALLERY_BASE_URL}/SnW29Wide.jpg`,
      concho: `${GALLERY_BASE_URL}/SnW29Concho.jpg`,
      heel: `${GALLERY_BASE_URL}/SnW29Heel.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Neon Pink',
      handleDesign: 'Herringbone',
      waxed: true,
      whipLength: '12 Feet',
      concho: 'Shield',
      heelLoop: 'Squared',
    },
  },
];
