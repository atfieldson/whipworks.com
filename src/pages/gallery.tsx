import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import styled from '@emotion/styled';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { galleryItems as bullwhipGallery } from '../components/organisms/BullwhipDesigner/constants/galleryWhips';
import { stockwhipGalleryItems } from '../components/organisms/BullwhipDesigner/constants/galleryStockwhips';
import { snakewhipGalleryItems } from '../components/organisms/BullwhipDesigner/constants/gallerySnakewhips';

/**
 * Gallery — `/gallery`
 *
 * Editorial showcase of every photographed whip Adam has built. The job
 * is "see all the possibilities for ordering a custom whip from me" —
 * a catalog of inspiration that funnels users to the right place to
 * buy: specialty pages for tagged whips, designer pages for custom
 * builds (the click-to-prefill hookup is Phase 13.7).
 *
 * Phase 13.4 (this commit): UI shell only — no filtering, no lightbox.
 * Subsequent phases:
 *   13.5 Filter chips above the grid (type/length/color/handle/concho)
 *   13.6 Click any card → in-page lightbox with all the whip's photos
 *   13.7 "Build this exact whip" CTA in the lightbox prefills the
 *        Design-a-Whip form for custom builds; specialty cards keep
 *        linking directly to their `/specialty/:slug` page (those are
 *        already pre-configured products)
 *
 * Design language: Filson editorial heritage (eyebrow + serif heading +
 * counter) meets Vorrath dark image-first portfolio (square photo
 * tiles, metadata below the image rather than overlaid). Pure Emotion
 * styled components — same convention as the recent homepage revamp.
 *
 * Data sources (canonical):
 *   - Custom bullwhips/stockwhips/snakewhips: imported directly from
 *     the BullwhipDesigner constants — same data the designer pages'
 *     hover-preview uses, so the gallery and the customizer always
 *     show the same whips.
 *   - Specialty whips: GraphQL query against allMarkdownRemark
 *     filtered by collection=specialty — same pattern as
 *     specialty-whips.tsx. One card per specialty for now (using the
 *     lead images[0] photo); the per-physical-build expansion lives
 *     in the lightbox in Phase 13.6.
 *
 * `whip-catalog.xlsx` is Adam's reference workbook only — the page
 * never reads from Excel. Architecture.md "Working Reference Documents"
 * has the full distinction.
 */

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
            series
            isNew
            images {
              url
              caption
            }
          }
        }
      }
    }
  }
`;

// ─── Unified card data model ─────────────────────────────────────────────

type GalleryCard = {
  /** Stable React key + the user-visible whip ID. */
  id: string;
  /** Bucket the card into a category for chip-filtering in 13.5. */
  type: 'bullwhip' | 'fantasy' | 'stockwhip' | 'snakewhip' | 'specialty';
  /** Eyebrow text shown above the title in small caps. */
  eyebrow: string;
  /** Main display name. For custom whips this is the whip ID; for
      specialties it's the marketing title. */
  title: string;
  /** One-line metadata under the title (length · handle · primary color). */
  metadata: string;
  /** Lead photo for the card. */
  image: string;
  /** Where the card links to. `null` = non-interactive placeholder
      (custom cards in this phase; lightbox flow lands them in Phase 13.6). */
  href: string | null;
  /** Used as alt text and aria-label. */
  alt: string;
};

// Compose a "5 Feet · Celtic · Neon Pink" style metadata line, dropping
// any pieces that are blank/null so we don't end up with stray separators.
const composeMeta = (...parts: (string | null | undefined)[]) =>
  parts.filter((p) => p && p.trim().length > 0).join(' · ');

// ─── Build the unified card list from all four data sources ─────────────

type SpecialtyEdge = {
  node: {
    fields: { slug: string };
    frontmatter: {
      title: string;
      series: string | null;
      isNew: boolean | null;
      images: { url: string; caption: string }[] | null;
    };
  };
};

const buildCards = (specialtyEdges: SpecialtyEdge[]): GalleryCard[] => {
  const cards: GalleryCard[] = [];

  // ── Custom bullwhips + fantasy whips (skip break entries — those are
  //    decorative concho group shots, not whips per Adam's "finished
  //    whips only" requirement).
  for (const item of bullwhipGallery) {
    if (item.type === 'break') continue;
    const whip = item; // narrowed: bullwhip | fantasy
    const photo = whip.images.wide || whip.images.transition || whip.images.handle;
    if (!photo) continue; // shouldn't happen with current data but guard anyway
    cards.push({
      id: whip.id,
      type: whip.type === 'fantasy' ? 'fantasy' : 'bullwhip',
      eyebrow: whip.type === 'fantasy' ? 'Fantasy' : 'Bullwhip',
      title: whip.id,
      metadata: composeMeta(
        whip.specs.whipLength,
        whip.specs.handleDesign,
        whip.specs.primaryColor,
      ),
      image: photo,
      href: null,
      alt: `${whip.id} — ${whip.specs.primaryColor} ${whip.specs.handleDesign} ${whip.specs.whipLength} bullwhip`,
    });
  }

  // ── Custom stockwhips
  for (const item of stockwhipGalleryItems) {
    if (item.type === 'break') continue;
    const whip = item;
    const photo = whip.images.wide || whip.images.wide1x1 || whip.images.keeper;
    if (!photo) continue;
    cards.push({
      id: whip.id,
      type: 'stockwhip',
      eyebrow: 'Stockwhip',
      title: whip.id,
      metadata: composeMeta(
        whip.specs.thongLength,
        whip.specs.handleDesign,
        whip.specs.primaryColor,
      ),
      image: photo,
      href: null,
      alt: `${whip.id} — ${whip.specs.primaryColor} ${whip.specs.handleDesign} ${whip.specs.thongLength} stockwhip`,
    });
  }

  // ── Custom snakewhips
  for (const item of snakewhipGalleryItems) {
    if (item.type === 'break') continue;
    const whip = item;
    const photo = whip.images.wide || whip.images.concho;
    if (!photo) continue;
    cards.push({
      id: whip.id,
      type: 'snakewhip',
      eyebrow: 'Snakewhip',
      title: whip.id,
      metadata: composeMeta(
        whip.specs.whipLength,
        whip.specs.handleDesign,
        whip.specs.primaryColor,
      ),
      image: photo,
      href: null,
      alt: `${whip.id} — ${whip.specs.primaryColor} ${whip.specs.handleDesign} ${whip.specs.whipLength} snakewhip`,
    });
  }

  // ── Specialty whips (one card per markdown file — uses the first image
  //    as the lead photo, which is typically the marketing Wide shot).
  //    Per-physical-build expansion happens in the lightbox in 13.6.
  for (const edge of specialtyEdges) {
    const fm = edge.node.frontmatter;
    const photo = fm.images?.[0]?.url;
    if (!photo) continue; // no photos = nothing to show in the grid
    cards.push({
      id: edge.node.fields.slug,
      type: 'specialty',
      eyebrow: fm.series ? `Specialty · ${fm.series.replace(' Bullwhip Series', '')}` : 'Specialty',
      title: fm.title,
      metadata: fm.isNew ? 'New' : '',
      image: photo,
      href: edge.node.fields.slug, // e.g. /specialty/indy
      alt: `${fm.title} — specialty bullwhip`,
    });
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

/** Editorial header — gold eyebrow, Domine heading, heritage line, subhead. */
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
  font-size: 3rem;
  line-height: 1.15;
  letter-spacing: 0.005em;
  color: #f5ebe0;
  margin: 0 0 18px;

  @media (max-width: 900px) {
    font-size: 2.4rem;
  }

  @media (max-width: 560px) {
    font-size: 1.85rem;
  }
`;

const Counter = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 22px;
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

/** Hairline divider beneath the editorial header — gives the grid a
    "page break" cue without using a heavy line. */
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

const Grid = styled.div`
  display: grid;
  /* 3 columns at the 1080px content width. Gap is moderate (20px) —
     tighter than FeaturedPair's editorial 24px but looser than
     FeaturedSpecialtyGrid's curated-showcase 12px. Reads as "archive
     density" without feeling cramped. */
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

/* Shared card body styles used by both the link variant (specialty
   whips) and the static variant (custom whips, awaiting lightbox in
   Phase 13.6). Composed into both styled() definitions so they stay
   visually identical regardless of whether the wrapping element is
   <a>, <Link>, or <div>. */
const cardCSS = `
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
  background-color: #1a140f;

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -3px;
  }

  &:hover .gallery-card-image,
  &:focus-visible .gallery-card-image {
    transform: scale(1.04);
    filter: brightness(1.05);
  }

  &:hover .gallery-card-title,
  &:focus-visible .gallery-card-title {
    color: #d6a85f;
  }
`;

const StaticCard = styled.div`
  ${cardCSS}
`;

const LinkCard = styled(Link)`
  ${cardCSS}
  cursor: pointer;
`;

const CardImageFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #0f0b08;
`;

/** Background-image div rather than <img> so we can compose transform
    + filter without juggling pseudo-elements. The cover-crop happens
    inside the 1:1 frame so any photo aspect resolves cleanly. */
const CardImage = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease, filter 0.4s ease;
  will-change: transform;
`;

/** Metadata strip below the image. Three rows, top to bottom: type
    eyebrow (gold caps), whip title (Domine), one-line metadata. */
const CardMeta = styled.div`
  padding: 14px 4px 4px;

  @media (max-width: 560px) {
    padding: 12px 2px 4px;
  }
`;

const CardEyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 6px;
  opacity: 0.92;
`;

const CardTitle = styled.h3`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 1.05rem;
  line-height: 1.25;
  letter-spacing: 0.005em;
  color: #f5ebe0;
  margin: 0 0 4px;
  transition: color 0.3s ease;
`;

const CardMetaLine = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: #f5ebe0;
  opacity: 0.7;
  margin: 0;
`;

// ─── Component ──────────────────────────────────────────────────────────

const GalleryPage = () => {
  const data = useStaticQuery(pageQuery);
  const cards = buildCards(data.allMarkdownRemark.edges);

  /* Heritage counter: pulled from the same total that reviews.json
     records (whipsCrafted: 1200). When that number bumps up, the
     reviews JSON gets re-scraped — keeping these in sync is a
     follow-up nice-to-have, but for now hand-aligning to the same
     1,200+ figure is fine since both are public-facing. */
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
          <Heading>Every whip, all in one place</Heading>
          <Counter>{counter}</Counter>
          <Subhead>
            Browse the archive to see what&rsquo;s possible. Click any
            specialty whip to see its full story, or design your own
            custom build from the ground up.
          </Subhead>
        </HeaderBlock>
        <Divider />
        <Grid>
          {cards.map((card) => {
            const inner = (
              <>
                <CardImageFrame>
                  <CardImage
                    className="gallery-card-image"
                    src={card.image}
                    aria-hidden
                  />
                </CardImageFrame>
                <CardMeta>
                  <CardEyebrow>{card.eyebrow}</CardEyebrow>
                  <CardTitle className="gallery-card-title">
                    {card.title}
                  </CardTitle>
                  {card.metadata && (
                    <CardMetaLine>{card.metadata}</CardMetaLine>
                  )}
                </CardMeta>
              </>
            );

            if (card.href) {
              return (
                <LinkCard
                  key={card.id}
                  to={card.href}
                  aria-label={card.alt}
                >
                  {inner}
                </LinkCard>
              );
            }
            // Custom whip: non-interactive placeholder until Phase 13.6
            // wires the lightbox flow. Still gets the visual hover so
            // Adam can preview the look on this branch.
            return (
              <StaticCard key={card.id} aria-label={card.alt}>
                {inner}
              </StaticCard>
            );
          })}
        </Grid>
      </SectionContainer>
    </Layout>
  );
};

export default GalleryPage;
