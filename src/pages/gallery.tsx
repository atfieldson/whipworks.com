import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import GalleryLightbox from '../components/organisms/GalleryLightbox';
import { galleryItems as bullwhipGallery } from '../components/organisms/BullwhipDesigner/constants/galleryWhips';
import { stockwhipGalleryItems } from '../components/organisms/BullwhipDesigner/constants/galleryStockwhips';
import { snakewhipGalleryItems } from '../components/organisms/BullwhipDesigner/constants/gallerySnakewhips';

/**
 * Gallery — `/gallery`
 *
 * Editorial showcase of every photographed whip Adam has built. The
 * job is "see all the possibilities for ordering a custom whip from
 * me" — a catalog of inspiration that funnels users to the right
 * place to buy: specialty pages for tagged whips, designer pages for
 * custom builds (the click-to-prefill hookup is Phase 13.7).
 *
 * Phase 13.4 (this iteration): UI shell only.
 * Subsequent phases:
 *   13.5 Filter chips above the grid (type/length/color/handle/concho)
 *   13.6 Click any card → in-page lightbox with all the whip's photos
 *        (this iteration also brings in mix-of-shot-types — currently
 *        we show one Wide shot per whip; lightbox shows the rest).
 *        Per-whip grouping decision will be made when the lightbox
 *        lands (rows of same-whip images in the gallery vs. spread
 *        out, Adam to decide.)
 *   13.7 "Build this exact whip" CTA in the lightbox prefills the
 *        Design-a-Whip form for custom builds; specialty cards keep
 *        linking directly to their `/specialty/:slug` page.
 *   13.8 Polish + scroll-triggered slide-in animations (matching the
 *        per-tile reveal pattern from FeaturedSpecialtyGrid on the
 *        homepage — even-index slides from left, odd-index from right,
 *        per-card viewport trigger so they fire row-by-row as the user
 *        scrolls down).
 *
 * Design language: Filson editorial heritage + WhipGallery-style hover
 * reveal (hovering a card surfaces a dark-gradient overlay with the
 * whip's specs at the bottom of the photo — same pattern Adam already
 * uses on the Design-a-Bullwhip page's WhipGallery).
 *
 * Layout: CSS columns for native-aspect-ratio cards. Photos display in
 * their original ratio (no 1:1 cover-crop) so edges aren't cut off and
 * each whip is shown in the way it was photographed. Trade-off: column
 * reading order is top-to-bottom-of-col-1 then top-to-bottom-of-col-2
 * (Pinterest-style), which is fine for a gallery — users scan visually,
 * not in reading order.
 *
 * Background filter: only photos under a `/gallery/` path are included.
 * Studio product shots live there (typically black backdrop), while
 * lifestyle / banner / portrait photos live elsewhere on S3. This is
 * the heuristic for Adam's "for now, only show black-background images"
 * curation — Pride is auto-excluded because its photos live at
 * `/specialty/pride/`, not `/gallery/specialty/`. EXCLUDED_WHIP_IDS
 * below is the manual escape hatch if a specific gallery photo needs
 * to come out.
 *
 * Wide-only rule: per Adam's gallery vision, only proper "Wide" shots
 * appear in the grid (one per whip). Detail shots — Transition, Handle,
 * Concho, Heel, Wide1x1 square crops, etc. — are reserved for the
 * lightbox in Phase 13.6 ("when I click on an image, it pulls up an
 * overlay with all of the images of that whip"). Whips that don't
 * have a proper Wide shot get auto-excluded from the gallery: this
 * naturally drops SW7-8 / SW9-10 / SW11-12 (only have `wide1x1`, no
 * `wide`) without needing them in EXCLUDED_WHIP_IDS.
 *
 * Whip ID display: catalog numbers (BW543, SW7-8, etc.) are NOT shown
 * in the customer-facing UI. The reasoning is sales-focused — buyers
 * shop visually and by specs, not by SKU. Custom-whip titles are
 * composed from specs ("Neon Pink + Black"); specialty whips show
 * their marketing name. The IDs are still the canonical key in
 * data/code/Excel, just not surfaced here.
 *
 * Data sources (canonical):
 *   - Custom bullwhips/stockwhips/snakewhips: imported directly from
 *     the BullwhipDesigner constants — same data the designer pages'
 *     hover-preview uses.
 *   - Specialty whips: GraphQL query against allMarkdownRemark
 *     filtered by collection=specialty.
 *
 * `whip-catalog.xlsx` is Adam's reference workbook only — the page
 * never reads from Excel. Architecture.md "Working Reference Documents"
 * has the full distinction.
 */

// ─── Curation: which photos are eligible for the gallery ───────────────

/**
 * Studio product shots live under `/gallery/` paths on S3/CloudFront.
 * Anything else (Pride flat-lays, Adam portraits, banner photography)
 * is excluded for now to keep the gallery visually consistent on
 * black backgrounds. Adam can lift this restriction later when there's
 * an explicit "lifestyle" or "in-use" tag.
 */
const isGalleryPhoto = (url: string) => url.includes('/gallery/');

/**
 * "Wide" filename pattern — matches `…Wide.jpg` or `…Wide2.jpg` at the
 * end of a URL. Used to filter specialty markdown `images[]` arrays
 * (which are an undifferentiated list) down to just the Wide shots.
 *
 * Excludes `…Wide1x1.jpg` (square crops — not the same as a true Wide),
 * `…Transition.jpg`, `…Handle.jpg`, `…Concho.jpg`, etc. — those are
 * detail shots reserved for the lightbox in Phase 13.6.
 *
 * Custom-whip TS data has named keys (`wide`, `wide2`, `transition`,
 * `handle`, etc.) so the same filter for those is just `w.images.wide`
 * — the type of the URL doesn't need to be inferred from the filename
 * because the data is already structured by shot type.
 */
const isWideShot = (url: string) => /Wide2?\.jpg$/i.test(url);

/**
 * Strip a known shot-type suffix from a filename to derive the unique
 * "physical whip" prefix. All photos of the same physical whip share
 * this prefix — e.g., `BW592Indy67RaiderWide.jpg`,
 * `BW592Indy67RaiderTransition.jpg`, and `BW592Indy67RaiderHandle.jpg`
 * all reduce to `BW592Indy67Raider`.
 *
 * Order matters: longest suffixes are checked first (HandleHeel before
 * Handle, Wide1x1 before Wide) so we don't accidentally match a shorter
 * prefix when the filename contains a compound shot name.
 */
const SHOT_SUFFIXES_LONGEST_FIRST = [
  'Wide1x1',
  'Wide2',
  'Wide',
  'Transition',
  'Thong2',
  'Thong',
  'HandleMid',
  'HandleHeel',
  'Handle2',
  'Handle',
  'Concho',
  'Heel',
  'Keeper',
];

const stripShotSuffix = (url: string): string => {
  const filename = url.split('/').pop() || '';
  for (const suffix of SHOT_SUFFIXES_LONGEST_FIRST) {
    const pattern = `${suffix}.jpg`;
    if (filename.endsWith(pattern)) return filename.slice(0, -pattern.length);
  }
  return filename; // unrecognized — fall back to whole filename so we don't crash
};

/**
 * Pull a length string ("8 Feet") out of a photo caption like
 * "An 8 foot Raider style Indy Bullwhip". Used to populate the per-
 * physical-whip Length spec on specialty cards — markdown captions
 * are the only place each photographed build's actual length is
 * recorded (frontmatter `variants` defaultValue is the *marketing*
 * default, not the photographed build).
 */
const extractLengthFromCaption = (
  caption: string | null | undefined,
): string | null => {
  if (!caption) return null;
  const m = caption.match(/(\d+)\s*foot/i);
  return m ? `${m[1]} Feet` : null;
};

/** Drop a leading "The " from variant names for cleaner eyebrow text:
    "The Raider" → "Raider", "The Kingdom Finder" → "Kingdom Finder". */
const dropLeadingThe = (s: string | null | undefined): string | null =>
  s ? s.replace(/^The /i, '') : null;

/**
 * Normalize heel-loop values to the canonical option names from the
 * BullwhipDesigner. The gallery TS files use older naming (`'No Heel
 * Loop'`, `'Heel Loop Rounded'`, `'None'`) and specialty markdowns use
 * a slightly different variant (`'Rounded with Loop'`) — both get
 * mapped here to the four canonical values that the design forms know:
 * Squared / Squared with Heel Loop / Rounded / Rounded with Heel Loop.
 *
 * `'None'` (fantasy whips with pommels — no heel loop concept applies)
 * normalizes to empty string, which `buildSpecs` then drops from the
 * spec grid so the row doesn't show.
 */
const normalizeHeelLoop = (raw: string | null | undefined): string => {
  if (!raw) return '';
  if (raw === 'No Heel Loop') return 'Squared';
  if (raw === 'Heel Loop Rounded') return 'Rounded with Heel Loop';
  if (raw === 'Rounded with Loop') return 'Rounded with Heel Loop';
  if (raw === 'None') return '';
  return raw;
};

/**
 * Manual exclusion escape hatch. Add specific whip IDs here to remove
 * them from the gallery without touching the underlying data sources.
 * Default empty.
 */
const EXCLUDED_WHIP_IDS = new Set<string>([
  // e.g. 'BW543', 'SW15', '/specialty/pride'
]);

// ─── GraphQL: pull all specialty markdown ────────────────────────────────

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "specialty" } } }
      sort: { frontmatter: { sortOrder: ASC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            series
            isNew
            images {
              url
              caption
            }
            specs {
              label
              value
            }
            variants {
              name
              defaultValue
              options {
                name
                images {
                  url
                  caption
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Unified card data model ─────────────────────────────────────────────

type SpecPair = { label: string; value: string };

export type GalleryCard = {
  /** Stable React key. For custom whips this is the gallery TS id
      (BW543, SW7-8, FW33, etc.); for specialty whips it's the unique
      filename prefix (BW592Indy67Raider, BW101540K1Nightlord, etc.). */
  id: string;
  /** Bucket the card into a category for chip-filtering in 13.5.
      Note: specialty whips are *also* bullwhips per Adam's design
      (all current specialties are bullwhips), so the 13.5 type filter
      will need to match `type === 'bullwhip' || type === 'specialty'`
      when the user picks "Bullwhip". */
  type: 'bullwhip' | 'fantasy' | 'stockwhip' | 'snakewhip' | 'specialty';
  /** Specialty shorthand tag (Indy / CW / ZW / NL / etc.) — only set
      for type=specialty. Used by 13.5 filtering ("show all Indys"). */
  specialtyTag?: string;
  /** Specialty style/variant ("The Raider", "Classic Black", etc.)
      when present in the markdown — null otherwise. */
  variant?: string | null;
  /** "8 Feet", "10 Feet", etc. — pulled from gallery TS specs for
      custom whips, parsed from photo caption for specialty whips.
      Used by 13.5 filtering ("7-foot bullwhips"). */
  length?: string;
  /** Eyebrow text shown in the hover overlay (small caps gold). */
  eyebrow: string;
  /** Main display name shown in the hover overlay. For custom whips
      this is composed from specs ("Neon Pink + Black"); for specialty
      it's the marketing title. */
  title: string;
  /** Spec pairs shown in the hover overlay's 2-col grid (cap ~6 to
      keep the overlay visually balanced on shorter cards). */
  specs: SpecPair[];
  /** Lead photo for the card (rendered at native aspect ratio). */
  image: string;
  /** All photos of this physical whip — fed to the lightbox.
      For custom whips, this is the gallery TS images map flattened.
      For specialty whips, this is the per-prefix grouped photo set. */
  allPhotos: { url: string; caption: string }[];
  /** Marketing description for the lightbox info panel — only set on
      specialty whips (pulled from frontmatter.description). Custom
      whips use the spec grid alone. */
  description?: string;
  /** Where the lightbox CTA navigates. Specialty whips land on
      `/specialty/:slug`; custom whips land on the relevant
      `/design-{type}` page (Phase 13.7 wires the form prefill). */
  href: string;
  /** Used as alt text and aria-label. */
  alt: string;
};

/** Compose a custom whip's title from its color specs. Single-color
    whips read as just the color ("Coyote Brown"); two-tone whips use
    " + " to separate ("Neon Pink + Black"). */
const composeColorTitle = (
  primary: string,
  secondary: string | null,
): string => (secondary ? `${primary} + ${secondary}` : primary);

/** Build the spec pairs shown in the overlay. Filtered to skip empty
    or default values that don't add information (e.g. Collar = None). */
const buildSpecs = (
  pairs: { label: string; value: string | null | undefined; skipIf?: string[] }[],
): SpecPair[] =>
  pairs
    .filter(({ value, skipIf = [] }) =>
      value && value.length > 0 && !skipIf.includes(value),
    )
    .map(({ label, value }) => ({ label, value: value as string }));

// ─── Build the unified card list from all four data sources ─────────────

type SpecialtyImage = { url: string; caption: string };
type SpecialtyVariantOption = {
  name: string;
  images: SpecialtyImage[] | null;
};
type SpecialtyVariant = {
  name: string;
  defaultValue: string;
  options: SpecialtyVariantOption[] | null;
};
type SpecialtyEdge = {
  node: {
    fields: { slug: string };
    frontmatter: {
      title: string;
      description: string | null;
      series: string | null;
      isNew: boolean | null;
      images: SpecialtyImage[] | null;
      specs: { label: string; value: string }[] | null;
      variants: SpecialtyVariant[] | null;
    };
  };
};

/**
 * Group a flat list of specialty photos by their unique physical-whip
 * prefix (everything in the filename before the shot-type suffix).
 * Returns a Map preserving insertion order — so for-each iteration
 * yields cards in the order they appear in the markdown.
 *
 * Each group also tracks which variant/style its photos came from
 * (e.g., "The Raider" for Indy Raider photos), and pulls a length
 * value out of the first photo's caption that has one.
 */
type PhotoGroup = {
  prefix: string;
  widePhoto: SpecialtyImage | null;
  allPhotos: SpecialtyImage[];
  length: string | null;
  variant: string | null;
};

const groupSpecialtyPhotos = (
  fm: SpecialtyEdge['node']['frontmatter'],
): PhotoGroup[] => {
  const groups = new Map<string, PhotoGroup>();

  const ingest = (images: SpecialtyImage[], variant: string | null) => {
    for (const img of images) {
      if (!isGalleryPhoto(img.url)) continue;
      const prefix = stripShotSuffix(img.url);
      let g = groups.get(prefix);
      if (!g) {
        g = { prefix, widePhoto: null, allPhotos: [], length: null, variant };
        groups.set(prefix, g);
      }
      g.allPhotos.push(img);
      if (isWideShot(img.url) && !g.widePhoto) g.widePhoto = img;
      if (!g.length) g.length = extractLengthFromCaption(img.caption);
    }
  };

  /* When the markdown has a "Style" variant (Indy with Raider /
     Kingdom Finder / Junior, Catwhip with Classic Black / Red Devil),
     the per-style options[].images is the canonical per-variant photo
     set. Use that and skip top-level images[] (which are typically a
     duplicate subset of the first style's photos). When there's no
     Style variant, the top-level images[] holds all the photos for
     all builds — group those without a variant tag. */
  const styleVariant = fm.variants?.find((v) => v.name === 'Style');
  if (styleVariant?.options && styleVariant.options.length > 0) {
    for (const opt of styleVariant.options) {
      if (opt.images) ingest(opt.images, opt.name);
    }
  } else if (fm.images) {
    ingest(fm.images, null);
  }

  // Drop groups without a Wide shot — they can't be cards (Wide-only rule).
  return [...groups.values()].filter((g) => g.widePhoto !== null);
};

/** Specialty folder name → Adam's specialty shorthand (matches the
    Specialty Tag column in whip-catalog.xlsx and SPECIALTY_TAGS in
    the build script). Used for filtering in 13.5 ("show all Indys").
    Keyed by lowercased basename so the lookup works regardless of
    whether gatsby emits slugs as `/specialty/indy` or
    `/specialty/indy/` or just `indy`. */
const SLUG_BASENAME_TO_TAG: Record<string, string> = {
  indy: 'Indy',
  belmont: 'Belmont',
  catwhip: 'CW',
  zwhip: 'ZW',
  mando: 'Mando',
  onewinged: 'OWB',
  harlequin: 'HQ',
  jokingbullwhip: 'JB',
  blacksmith: 'BS',
  starspangled: 'SS',
  nightlord: 'NL',
  ultrawhip: 'Ultra',
  pride: 'Pride',
};

/** Extract the basename of a slug regardless of leading/trailing
    slashes: '/specialty/indy/' → 'indy', '/specialty/indy' → 'indy',
    'indy' → 'indy'. */
const slugBasename = (slug: string): string => {
  const cleaned = slug.replace(/^\/+|\/+$/g, '');
  return cleaned.split('/').pop()?.toLowerCase() || cleaned.toLowerCase();
};

const buildCards = (specialtyEdges: SpecialtyEdge[]): GalleryCard[] => {
  const cards: GalleryCard[] = [];

  // ── Custom bullwhips + fantasy whips
  for (const item of bullwhipGallery) {
    if (item.type === 'break') continue;
    if (EXCLUDED_WHIP_IDS.has(item.id)) continue;
    const w = item;
    // Wide-only rule: skip whips that lack a proper Wide shot (detail
    // shots are for the lightbox, not the grid).
    const photo = w.images.wide;
    if (!photo || !isGalleryPhoto(photo)) continue;
    const isFantasy = w.type === 'fantasy';
    /* Flatten the gallery TS images map into the all-photos array for
       the lightbox in 13.6 — captions are constructed from specs since
       the TS data doesn't have per-shot captions. */
    const allPhotos: { url: string; caption: string }[] = [];
    for (const [shot, url] of Object.entries(w.images)) {
      if (url) allPhotos.push({ url, caption: `${w.id} ${shot}` });
    }
    cards.push({
      id: w.id,
      type: isFantasy ? 'fantasy' : 'bullwhip',
      length: w.specs.whipLength,
      eyebrow: isFantasy ? 'Fantasy Whip' : 'Bullwhip',
      title: composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor),
      specs: buildSpecs([
        { label: 'Length', value: w.specs.whipLength },
        { label: 'Handle', value: w.specs.handleLength },
        { label: 'Pattern', value: w.specs.handleDesign },
        { label: 'Concho', value: w.specs.concho },
        { label: 'Collar', value: w.specs.collar, skipIf: ['None'] },
        { label: 'Heel Loop', value: normalizeHeelLoop(w.specs.heelLoop) },
      ]),
      image: photo,
      allPhotos,
      href: '/design-bullwhip',
      alt: `${composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor)} ${w.specs.whipLength} bullwhip`,
    });
  }

  // ── Custom stockwhips
  for (const item of stockwhipGalleryItems) {
    if (item.type === 'break') continue;
    if (EXCLUDED_WHIP_IDS.has(item.id)) continue;
    const w = item;
    // Wide-only rule: skip whips with no proper Wide shot. Auto-excludes
    // SW7-8 / SW9-10 / SW11-12 (those have only `wide1x1` square crops,
    // which aren't true Wide shots — they're alternate-aspect renders).
    const photo = w.images.wide;
    if (!photo || !isGalleryPhoto(photo)) continue;
    const allPhotos: { url: string; caption: string }[] = [];
    for (const [shot, url] of Object.entries(w.images)) {
      if (url) allPhotos.push({ url, caption: `${w.id} ${shot}` });
    }
    cards.push({
      id: w.id,
      type: 'stockwhip',
      length: w.specs.thongLength,
      eyebrow: 'Stockwhip',
      title: composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor),
      specs: buildSpecs([
        { label: 'Thong', value: w.specs.thongLength },
        { label: 'Handle', value: w.specs.handleLength },
        { label: 'Pattern', value: w.specs.handleDesign },
        { label: 'Finish', value: w.specs.handleFinish },
        { label: 'Concho', value: w.specs.concho },
        { label: 'Heel Loop', value: normalizeHeelLoop(w.specs.heelLoop) },
      ]),
      image: photo,
      allPhotos,
      href: '/design-stockwhip',
      alt: `${composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor)} ${w.specs.thongLength} stockwhip`,
    });
  }

  // ── Custom snakewhips
  for (const item of snakewhipGalleryItems) {
    if (item.type === 'break') continue;
    if (EXCLUDED_WHIP_IDS.has(item.id)) continue;
    const w = item;
    // Wide-only rule.
    const photo = w.images.wide;
    if (!photo || !isGalleryPhoto(photo)) continue;
    const allPhotos: { url: string; caption: string }[] = [];
    for (const [shot, url] of Object.entries(w.images)) {
      if (url) allPhotos.push({ url, caption: `${w.id} ${shot}` });
    }
    cards.push({
      id: w.id,
      type: 'snakewhip',
      length: w.specs.whipLength,
      eyebrow: 'Snakewhip',
      title: composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor),
      specs: buildSpecs([
        { label: 'Length', value: w.specs.whipLength },
        { label: 'Pattern', value: w.specs.handleDesign },
        { label: 'Concho', value: w.specs.concho },
        { label: 'Heel Loop', value: normalizeHeelLoop(w.specs.heelLoop) },
      ]),
      image: photo,
      allPhotos,
      href: '/design-snakewhip',
      alt: `${composeColorTitle(w.specs.primaryColor, w.specs.secondaryColor)} ${w.specs.whipLength} snakewhip`,
    });
  }

  // ── Specialty whips — one card per *physical* build (Adam's Q1
  //    decision after 13.4 review). Each unique filename prefix in
  //    the markdown's photo set becomes one card. Indy's 4 builds
  //    (Raider 8ft, Raider 10ft, Kingdom Finder, Junior) each get
  //    their own card; Belmont's 2 builds each get one; Mando's
  //    single photographed build gets one; etc.
  for (const edge of specialtyEdges) {
    const fm = edge.node.frontmatter;
    if (EXCLUDED_WHIP_IDS.has(edge.node.fields.slug)) continue;

    /* Pull marketing-design specs from the markdown's specs[] block.
       These are SHARED across all physical builds of the specialty
       (they describe the design, not any individual build). Cap to a
       handful of entries for overlay readability — drop "Finish" since
       it's always Waxed and not informative on a per-card basis.
       Heel-loop values get normalized to the canonical option names
       ("Rounded with Loop" → "Rounded with Heel Loop"); rows that
       normalize to empty string (fantasy whip "None") are dropped. */
    const sharedSpecs = (fm.specs || [])
      .filter((s) => s.label !== 'Finish')
      .slice(0, 5)
      .map((s) => ({
        label: s.label,
        value: s.label === 'Heel Loop' ? normalizeHeelLoop(s.value) : s.value,
      }))
      .filter((s) => s.value);

    /* Series tag — e.g. "40K" for Nightlord/Ultra. Used in the eyebrow. */
    const seriesTag = fm.series
      ? fm.series.replace(' Bullwhip Series', '')
      : null;

    /* Walk the markdown's photo structure and group by physical-whip
       prefix. Each group with a Wide shot becomes one card. */
    const groups = groupSpecialtyPhotos(fm);
    for (const g of groups) {
      // EXCLUDED_WHIP_IDS can also list a specific physical-whip prefix
      // (e.g. 'BW524Indy56Raider') if Adam wants one specific build out.
      if (EXCLUDED_WHIP_IDS.has(g.prefix)) continue;

      /* Eyebrow composition: "Specialty" + (series if any) + (variant
         if any), joined with " · ". Variant has the leading "The "
         dropped for cleaner display ("Raider", not "The Raider"). */
      const variantShort = dropLeadingThe(g.variant);
      const eyebrowParts = ['Specialty', seriesTag, variantShort].filter(Boolean) as string[];
      const eyebrow = eyebrowParts.join(' · ');

      /* Length pulled from the photo caption parses cleanly for every
         specialty in the current dataset. Falls back to the marketing
         default-length variant if caption parsing somehow fails. */
      const captionLength = g.length;
      const fallbackLength = fm.variants?.find((v) => v.name === 'Whip Length')?.defaultValue;
      const length = captionLength || fallbackLength || undefined;

      /* Spec grid: Length first (per-build), then the shared design
         specs. Length is what differentiates same-design cards
         (e.g., 8 ft Belmont vs 10 ft Belmont) so it gets top billing. */
      const specs: SpecPair[] = [
        ...(length ? [{ label: 'Length', value: length }] : []),
        ...sharedSpecs,
      ];

      cards.push({
        id: g.prefix,
        type: 'specialty',
        specialtyTag: SLUG_BASENAME_TO_TAG[slugBasename(edge.node.fields.slug)],
        variant: g.variant,
        length,
        eyebrow,
        title: fm.title,
        specs,
        image: g.widePhoto!.url, // safe: groupSpecialtyPhotos filters out groups with no Wide
        allPhotos: g.allPhotos,
        description: fm.description || undefined,
        href: edge.node.fields.slug, // e.g. /specialty/indy — same for all builds of a specialty
        alt: `${fm.title}${variantShort ? ` — ${variantShort}` : ''}${length ? `, ${length}` : ''}`,
      });
    }
  }

  return cards;
};

// ─── Styled components ──────────────────────────────────────────────────

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 96px;

  @media (max-width: 560px) {
    margin-bottom: 48px;
  }
`;

/** Editorial header: gold eyebrow + the counter promoted to h1
    (replaces the previous "Every whip, all in one place" — Adam felt
    that read as self-referential, the page being a gallery already
    speaks for itself). The counter ("1,200+ whips made by hand since
    2015") is now the page heading, getting Domine serif treatment. */
const HeaderBlock = styled.div`
  text-align: center;
  margin-bottom: 56px;
  padding: 0 24px;

  @media (max-width: 560px) {
    margin-bottom: 36px;
    padding: 0 16px;
  }
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 14px;
`;

const Heading = styled.h1`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 2.6rem;
  line-height: 1.18;
  letter-spacing: 0.005em;
  color: #f5ebe0;
  margin: 0 0 18px;

  @media (max-width: 900px) {
    font-size: 2.1rem;
  }

  @media (max-width: 560px) {
    font-size: 1.65rem;
  }
`;

const Subhead = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: #f5ebe0;
  opacity: 0.85;
  margin: 0 auto;
  max-width: 56ch;

  @media (max-width: 560px) {
    font-size: 0.95rem;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: rgba(214, 168, 95, 0.18);
  margin: 0 auto 56px;
  max-width: 480px;

  @media (max-width: 560px) {
    margin-bottom: 32px;
  }
`;

/**
 * CSS multi-column layout for native-aspect-ratio cards. Cards keep
 * their original photo proportions and pack into columns Pinterest-
 * style. Trade-off: reading order is top-to-bottom-of-col-1, then
 * top-to-bottom-of-col-2 — fine for visual scanning, not for sequential
 * reading. The grid is the right shape for an archive/gallery view
 * where users hunt visually rather than read top-to-bottom.
 */
const Grid = styled.div`
  column-count: 3;
  column-gap: 20px;

  @media (max-width: 900px) {
    column-count: 2;
    column-gap: 16px;
  }

  @media (max-width: 560px) {
    column-count: 1;
  }
`;

/**
 * All cards are now buttons that open the GalleryLightbox on click —
 * Adam's workflow vision: clicking ANY whip image (specialty or custom)
 * opens the in-page overlay with all photos + info + a CTA out to the
 * relevant listing/design page. Specialty cards no longer link directly
 * to /specialty/:slug (the lightbox CTA does that instead).
 *
 * Using <button> rather than <div role="button"> for built-in keyboard
 * support (Enter / Space activate). Default browser button styling is
 * stripped out (border, padding, font, background) and the rest of the
 * cardCSS produces the editorial card visual.
 */
const Card = styled.button`
  /* Browser button resets */
  appearance: none;
  border: 0;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  width: 100%;

  /* Card visual — same look the previous LinkCard/StaticCard had */
  position: relative;
  display: block;
  margin: 0 0 20px;
  /* break-inside on the Card itself keeps cards intact in CSS columns;
     a card never splits across two columns. */
  break-inside: avoid;
  text-decoration: none;
  color: inherit;
  background-color: #1a140f;
  overflow: hidden;

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -3px;
  }

  /* Hover: scale the photo slightly + reveal the spec overlay.
     Matches the WhipGallery treatment Adam wanted. */
  &:hover .gallery-photo,
  &:focus-visible .gallery-photo {
    transform: scale(1.04);
  }

  &:hover .gallery-overlay,
  &:focus-visible .gallery-overlay {
    opacity: 1;
  }

  @media (max-width: 900px) {
    margin-bottom: 16px;
  }
`;

const PhotoFrame = styled.div`
  position: relative;
  /* No fixed aspect-ratio — let the <img> dictate the card's height
     based on its natural dimensions. */
  display: block;
  background-color: #0f0b08;
  overflow: hidden;
`;

/** Native <img> rather than background-image so the browser computes
    height from the image's natural dimensions and the card sizes itself.
    Eager-loading the first ~6 images would help LCP, but for now lazy
    on everything is fine — the gallery is below-the-fold by definition. */
const Photo = styled.img`
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.6s ease;
  will-change: transform;
`;

/**
 * Hover overlay — same pattern as WhipGallery on the Design-a-Bullwhip
 * page. Anchored to the bottom of the photo with a transparent→dark
 * gradient so the metadata reads cleanly against any photo background
 * while leaving most of the photo visible.
 *
 * Touch / mobile behavior: the overlay does NOT auto-show on hover-less
 * devices (per Adam's spec). Phone users see only the photo on each
 * card and tap to open the lightbox, where the descriptors live in
 * the info panel below the photo stack. Cleaner than persistent
 * overlays obscuring the cards on every grid scroll.
 */
const HoverOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.78) 55%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 64px 18px 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const OverlayEyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 6px;
`;

const OverlayTitle = styled.h3`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 1.15rem;
  line-height: 1.2;
  letter-spacing: 0.005em;
  color: #f5ebe0;
  margin: 0 0 12px;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);

  @media (max-width: 560px) {
    font-size: 1.05rem;
    margin-bottom: 10px;
  }
`;

/** 2-col label/value grid — the WhipGallery pattern. Compact spec
    rendering that fits in a small overlay area without crowding. */
const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 14px;
`;

const SpecLabel = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245, 235, 224, 0.55);
  display: block;
  margin-bottom: 1px;
`;

const SpecValue = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #f5ebe0;
  display: block;
  line-height: 1.25;
`;

// ─── Component ──────────────────────────────────────────────────────────

const GalleryPage = () => {
  const data = useStaticQuery(pageQuery);
  const cards = buildCards(data.allMarkdownRemark.edges);

  /* Selected card drives the GalleryLightbox below. `null` = lightbox
     closed; setting it to a card opens the lightbox with that card's
     photos + info. The lightbox itself manages photo navigation,
     scroll lock, and dismiss UX. */
  const [selectedCard, setSelectedCard] = useState<GalleryCard | null>(null);

  /* Heritage counter mirrors reviews.json's `meta.whipsCrafted: 1200`.
     When that number bumps up, the reviews JSON gets re-scraped — keeping
     these in sync is a follow-up nice-to-have, but for now hand-aligning
     to the same 1,200+ figure is fine since both are public-facing. */
  const counter = '1,200+ whips made by hand since 2015';

  return (
    <Layout>
      <SEO
        title="Gallery"
        description="Every WhipWorks bullwhip, stockwhip, snakewhip, and specialty whip — handcrafted custom whips from Adam since 2015. Browse the archive to see what's possible for your custom build."
      />
      <SectionContainer aria-label="Whip gallery">
        <HeaderBlock>
          <Eyebrow>The archive</Eyebrow>
          <Heading>{counter}</Heading>
          <Subhead>
            Browse the archive to see what&rsquo;s possible. Click any
            whip to see its full photo set and details, or design your
            own custom build from the ground up.
          </Subhead>
        </HeaderBlock>
        <Divider />
        <Grid>
          {cards.map((card) => (
            <Card
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card)}
              aria-label={card.alt}
            >
              <PhotoFrame>
                <Photo
                  className="gallery-photo"
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                />
                <HoverOverlay className="gallery-overlay" aria-hidden>
                  <OverlayEyebrow>{card.eyebrow}</OverlayEyebrow>
                  <OverlayTitle>{card.title}</OverlayTitle>
                  {card.specs.length > 0 && (
                    <SpecGrid>
                      {card.specs.map((s) => (
                        <div key={s.label}>
                          <SpecLabel>{s.label}</SpecLabel>
                          <SpecValue>{s.value}</SpecValue>
                        </div>
                      ))}
                    </SpecGrid>
                  )}
                </HoverOverlay>
              </PhotoFrame>
            </Card>
          ))}
        </Grid>
      </SectionContainer>
      <GalleryLightbox
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </Layout>
  );
};

export default GalleryPage;
