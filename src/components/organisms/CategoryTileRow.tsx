import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

/**
 * CategoryTileRow
 *
 * Full-bleed 4-tile strip that sits directly below the Hero. Each tile is a
 * full-link to one of the four top-level shop destinations:
 *   1. Design a Bullwhip   → /design-bullwhip
 *   2. Design a Stockwhip  → /design-stockwhip
 *   3. Specialty Whips     → /specialty-whips
 *   4. Design a Snakewhip  → /design-snakewhip
 *
 * Layout mirrors the Filson-inspired pattern: edge-to-edge images with zero gap,
 * dark bottom gradient, title + one-line blurb overlaid on the image. Hover
 * zooms the image and deepens the gradient slightly.
 *
 * Responsive:
 *   - ≥1025px: 4-across
 *   - 561–1024px: 2×2
 *   - ≤560px: stacked
 *
 * Full-bleed breakout uses the same `margin-left: calc((100% - 100vw) / 2)`
 * pattern as Hero to escape the 1080px Content container.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  align-self: stretch;
  flex-shrink: 0;
  width: 100vw;
  max-width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  /* Negative top margin cancels Hero's 96px bottom margin so the tiles sit
     flush under the hero — this is what makes the "peek below the fold" work.
     Without this, the tiles would be 96px below the hero and the peek would
     be empty dark background instead of a tile image. */
  margin-top: -96px;
  margin-bottom: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Hover interactions use class-name selectors (`.tile-image`, `.tile-gradient`)
 * rather than Emotion's component-selector syntax (`${TileImage}`) — the
 * component-selector feature requires `@emotion/babel-plugin`, which this
 * project doesn't have configured. Class selectors are plain CSS and work
 * with the default Emotion runtime.
 */
const Tile = styled(Link)`
  position: relative;
  display: block;
  /* Square on desktop/tablet to match the wide landscape photography in the
     gallery — a 4:5 portrait tile would crop the ends of each whip. */
  aspect-ratio: 1 / 1;
  overflow: hidden;
  text-decoration: none;
  color: #f5ebe0;
  background-color: #1a140f;

  /* On single-column mobile, tiles are wider than they are tall — 4:3
     landscape fits the wide whip photography naturally when stacked. */
  @media (max-width: 560px) {
    aspect-ratio: 4 / 3;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -4px;
  }

  &:hover .tile-image,
  &:focus-visible .tile-image {
    transform: scale(1.05);
  }

  &:hover .tile-gradient,
  &:focus-visible .tile-gradient {
    background: linear-gradient(
      to top,
      rgba(26, 20, 15, 0.95) 0%,
      rgba(26, 20, 15, 0.55) 50%,
      rgba(26, 20, 15, 0.2) 100%
    );
  }
`;

const TileImage = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
  will-change: transform;
`;

const TileGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(26, 20, 15, 0.9) 0%,
    rgba(26, 20, 15, 0.4) 50%,
    rgba(26, 20, 15, 0.1) 100%
  );
  transition: background 0.3s ease;
`;

const TileContent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px 24px 28px;
  z-index: 1;
`;

const TileTitle = styled.h3`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.2;
  margin: 0 0 6px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);

  @media (max-width: 1024px) {
    font-size: 1.35rem;
  }
`;

const TileBlurb = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
  letter-spacing: 0.03em;
  margin: 0;
  opacity: 0.92;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
`;

type Category = {
  title: string;
  blurb: string;
  image: string;
  href: string;
};

const CATEGORIES: Category[] = [
  {
    title: 'Design a Bullwhip',
    blurb:
      'Customize your bullwhip — colors, length, handle pattern, and more.',
    image:
      'https://d3ruufruf2uqog.cloudfront.net/gallery/bullwhip/BW601Wide.jpg',
    href: '/design-bullwhip',
  },
  {
    title: 'Design a Stockwhip',
    blurb:
      'The Australian classic. Choose your length, colors, handle pattern, and more.',
    image:
      'https://d3ruufruf2uqog.cloudfront.net/gallery/stockwhip/SW9-10Wide1x1.jpg',
    href: '/design-stockwhip',
  },
  {
    title: 'Specialty Whips',
    blurb:
      'Custom whips inspired by the characters, myths, and icons you love.',
    image:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW592Indy67RaiderWide.jpg',
    href: '/specialty-whips',
  },
  {
    title: 'Design a Snakewhip',
    blurb:
      'No rigid handle, coils up small. Ideal for cracking in small spaces.',
    image:
      'https://d3ruufruf2uqog.cloudfront.net/gallery/snakewhip/SnW2Wide.jpg',
    href: '/design-snakewhip',
  },
];

const CategoryTileRow = () => {
  return (
    <SectionContainer aria-label="Whip categories">
      <Grid>
        {CATEGORIES.map((c) => (
          <Tile
            key={c.href}
            to={c.href}
            aria-label={`${c.title}: ${c.blurb}`}
          >
            <TileImage className="tile-image" src={c.image} aria-hidden />
            <TileGradient className="tile-gradient" aria-hidden />
            <TileContent>
              <TileTitle>{c.title}</TileTitle>
              <TileBlurb>{c.blurb}</TileBlurb>
            </TileContent>
          </Tile>
        ))}
      </Grid>
    </SectionContainer>
  );
};

export default CategoryTileRow;
