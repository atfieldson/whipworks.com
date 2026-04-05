/**
 * Gallery stockwhips for the Design-a-Stockwhip left panel.
 *
 * Naming convention for S3 images:
 *   SW[number](-[number])[angle].jpg  — Stockwhip
 *   The -[number] suffix (e.g. SW21-22) indicates a matching pair.
 *   Angles: Wide, Keeper, HandleMid, HandleHeel
 *   1x1 suffix indicates a square aspect ratio image.
 *   Example: SW21-22Wide.jpg, SW7-8Wide1x1.jpg
 *
 * S3 path: gallery/stockwhip/
 */

const GALLERY_BASE_URL = 'https://d3ruufruf2uqog.cloudfront.net/gallery/stockwhip';

export type StockwhipGalleryWhip = {
  id: string;
  type: 'stockwhip';
  images: {
    wide?: string;
    wide1x1?: string;
    keeper?: string;
    handleMid?: string;
    handleHeel?: string;
  };
  specs: {
    primaryColor: string;
    secondaryColor: string | null;
    handleDesign: string;
    waxed: boolean;
    thongLength: string;
    handleLength: string;
    concho: string;
    handleFinish: string;
    heelLoop: string;
  };
};

export type StockwhipGalleryBreakImage = {
  id: string;
  type: 'break';
  image: string;
  description: string;
  layout: 'landscape' | 'portrait';
};

export type StockwhipGalleryItem = StockwhipGalleryWhip | StockwhipGalleryBreakImage;

export const stockwhipGalleryItems: StockwhipGalleryItem[] = [
  {
    id: 'SW7-8',
    type: 'stockwhip',
    images: {
      wide1x1: `${GALLERY_BASE_URL}/SW7-8Wide1x1.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: null,
      handleDesign: 'Herringbone',
      waxed: true,
      thongLength: '4 Feet 6 Inches',
      handleLength: '18 Inches',
      concho: 'Celtic Silver',
      handleFinish: 'Red Oak',
      heelLoop: 'Squared',
    },
  },
  {
    id: 'SW9-10',
    type: 'stockwhip',
    images: {
      wide1x1: `${GALLERY_BASE_URL}/SW9-10Wide1x1.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: null,
      handleDesign: 'Herringbone',
      waxed: true,
      thongLength: '5 Feet',
      handleLength: '18 Inches',
      concho: 'Celtic Silver',
      handleFinish: 'Summer Oak',
      heelLoop: 'Squared',
    },
  },
  {
    id: 'SW11-12',
    type: 'stockwhip',
    images: {
      wide1x1: `${GALLERY_BASE_URL}/SW11-12Wide1x1.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: null,
      handleDesign: 'Herringbone',
      waxed: true,
      thongLength: '4 Feet 6 Inches',
      handleLength: '18 Inches',
      concho: 'Celtic Silver',
      handleFinish: 'Kona',
      heelLoop: 'Squared',
    },
  },
  {
    id: 'SW21-22',
    type: 'stockwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/SW21-22Wide.jpg`,
      keeper: `${GALLERY_BASE_URL}/SW21-22Keeper.jpg`,
      handleMid: `${GALLERY_BASE_URL}/SW21-22HandleMid.jpg`,
      handleHeel: `${GALLERY_BASE_URL}/SW21-22HandleHeel.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Emerald Green',
      handleDesign: 'Celtic',
      waxed: true,
      thongLength: '5 Feet',
      handleLength: '18 Inches',
      concho: 'Celtic Brass',
      handleFinish: 'Kona',
      heelLoop: 'Squared',
    },
  },
];
