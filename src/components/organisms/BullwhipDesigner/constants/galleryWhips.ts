/**
 * Gallery whips for the Design-a-Bullwhip left panel.
 *
 * Naming convention for S3 images:
 *   BW[number][angle].jpg  — Bullwhip
 *   FW[number][angle].jpg  — Fantasy Whip (bullwhip variant, no heel loop options)
 *   Angles: Wide, Transition, Handle
 *   Example: BW537Transition.jpg
 *
 * S3 path: gallery/bullwhip/
 *
 * Concho group shots (white background) are used to break up the gallery.
 * They don't have individual specs — just a description.
 */

const GALLERY_BASE_URL = 'https://d3ruufruf2uqog.cloudfront.net/gallery/bullwhip';

export type GalleryWhip = {
  id: string;
  type: 'bullwhip' | 'fantasy';
  images: {
    wide?: string;
    transition?: string;
    handle?: string;
  };
  specs: {
    primaryColor: string;
    secondaryColor: string | null;
    handleDesign: string;
    waxed: boolean;
    whipLength: string;
    handleLength: string;
    concho: string;
    collar: string;
    heelLoop: string;
  };
};

export type GalleryBreakImage = {
  id: string;
  type: 'break';
  image: string;
  description: string;
  /** 'landscape' = 800x600, 'portrait' = 400x900 */
  layout: 'landscape' | 'portrait';
};

export type GalleryItem = GalleryWhip | GalleryBreakImage;

export const galleryItems: GalleryItem[] = [
  {
    id: 'concho-505-512',
    type: 'break',
    image: `${GALLERY_BASE_URL}/BW505-512Concho.jpg`,
    description: 'A selection of conchos on completed bullwhips',
    layout: 'landscape',
  },
  {
    id: 'BW543',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW543Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW543Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW543Handle.jpg`,
    },
    specs: {
      primaryColor: 'Neon Pink',
      secondaryColor: 'Black',
      handleDesign: 'Celtic',
      waxed: true,
      whipLength: '5 Feet',
      handleLength: '8 inches',
      concho: 'Wave Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW544',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW544Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW544Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW544Handle.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Charcoal Grey',
      handleDesign: 'Celtic',
      waxed: true,
      whipLength: '8 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW547',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW547Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW547Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW547Handle.jpg`,
    },
    specs: {
      primaryColor: 'Coyote Brown',
      secondaryColor: null,
      handleDesign: 'Box',
      waxed: true,
      whipLength: '6 Feet',
      handleLength: '12 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW548',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW548Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW548Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW548Handle.jpg`,
    },
    specs: {
      primaryColor: 'Rust',
      secondaryColor: 'Black',
      handleDesign: 'Neo Celtic',
      waxed: true,
      whipLength: '7 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Brass',
      collar: 'Brass',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW549',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW549Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW549Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW549Handle.jpg`,
    },
    specs: {
      primaryColor: 'White',
      secondaryColor: 'Black',
      handleDesign: 'Egyptian Eye',
      waxed: true,
      whipLength: '6 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'concho-591-596',
    type: 'break',
    image: `${GALLERY_BASE_URL}/BW591-596Concho.jpg`,
    description: 'Concho details on a range of custom bullwhips',
    layout: 'portrait',
  },
  {
    id: 'BW591',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW591Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW591Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW591Handle.jpg`,
    },
    specs: {
      primaryColor: 'Charcoal Grey',
      secondaryColor: 'Turquoise',
      handleDesign: 'Egyptian Eye',
      waxed: true,
      whipLength: '6 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW592',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW592Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW592Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW592Handle.jpg`,
    },
    specs: {
      primaryColor: 'Rust',
      secondaryColor: null,
      handleDesign: 'Box',
      waxed: true,
      whipLength: '8 Feet',
      handleLength: '8 inches',
      concho: 'Celtic Copper',
      collar: 'None',
      heelLoop: 'Heel Loop Rounded',
    },
  },
  {
    id: 'BW593',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW593Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW593Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW593Handle.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'Goldenrod',
      handleDesign: 'Egyptian Eye',
      waxed: true,
      whipLength: '8 Feet',
      handleLength: '12 inches',
      concho: 'American Eagle',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW594',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW594Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW594Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW594Handle.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: null,
      handleDesign: 'Vertical Strip',
      waxed: true,
      whipLength: '8 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW595',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW595Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW595Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW595Handle.jpg`,
    },
    specs: {
      primaryColor: 'Black',
      secondaryColor: 'International Orange',
      handleDesign: 'Box',
      waxed: true,
      whipLength: '4 Feet',
      handleLength: '12 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW596',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW596Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW596Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW596Handle.jpg`,
    },
    specs: {
      primaryColor: 'Neon Orange',
      secondaryColor: 'Neon Green',
      handleDesign: 'Celtic',
      waxed: true,
      whipLength: '6 Feet',
      handleLength: '10 inches',
      concho: 'Pirate Skull',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'concho-597-302',
    type: 'break',
    image: `${GALLERY_BASE_URL}/BW597-302Concho.jpg`,
    description: 'Close-up concho details on finished bullwhips',
    layout: 'landscape',
  },
  {
    id: 'BW601',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW601Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW601Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW601Handle.jpg`,
    },
    specs: {
      primaryColor: 'Copperhead',
      secondaryColor: 'Rust',
      handleDesign: 'Accent',
      waxed: true,
      whipLength: '7 Feet',
      handleLength: '10 inches',
      concho: 'Celtic Copper',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW605',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW605Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW605Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW605Handle.jpg`,
    },
    specs: {
      primaryColor: 'Acid Purple',
      secondaryColor: 'Neon Orange',
      handleDesign: 'Web of Wyrd',
      waxed: true,
      whipLength: '8 Feet',
      handleLength: '14 inches',
      concho: 'Celtic Copper',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'BW608',
    type: 'bullwhip',
    images: {
      wide: `${GALLERY_BASE_URL}/BW608Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/BW608Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/BW608Handle.jpg`,
    },
    specs: {
      primaryColor: 'White',
      secondaryColor: 'Caribbean',
      handleDesign: 'Celtic',
      waxed: true,
      whipLength: '6 Feet',
      handleLength: '8 inches',
      concho: 'Celtic Silver',
      collar: 'None',
      heelLoop: 'No Heel Loop',
    },
  },
  {
    id: 'FW33',
    type: 'fantasy',
    images: {
      wide: `${GALLERY_BASE_URL}/FW33Wide.jpg`,
      transition: `${GALLERY_BASE_URL}/FW33Transition.jpg`,
      handle: `${GALLERY_BASE_URL}/FW33Handle.jpg`,
    },
    specs: {
      primaryColor: 'Midnight Blue',
      secondaryColor: 'Black',
      handleDesign: 'Celtic',
      waxed: true,
      whipLength: '4 Feet',
      handleLength: '8 inches',
      concho: 'Wolf Pommel',
      collar: 'None',
      heelLoop: 'None',
    },
  },
];

export default galleryItems;
