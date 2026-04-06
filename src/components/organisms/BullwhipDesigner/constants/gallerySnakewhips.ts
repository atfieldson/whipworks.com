/**
 * Snakewhip gallery data — placeholder structure for when photos are ready.
 *
 * Image naming convention: SNK[number][angle].jpg
 *   e.g. SNK01Wide.jpg, SNK01Transition.jpg, SNK01Handle.jpg
 *
 * When photos are available, upload to S3 and add entries below.
 */

export type SnakewhipGalleryWhip = {
  type: 'snakewhip';
  id: string;
  images: {
    wide?: string;
    transition?: string;
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

// Placeholder — add gallery items here when snakewhip photos are ready
export const snakewhipGalleryItems: SnakewhipGalleryItem[] = [];
