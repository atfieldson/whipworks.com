import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FeaturedSpecialtyGrid
 *
 * 2×3 grid of hand-picked specialty whips on the homepage. Each tile shows
 * a primary product shot (the "Wide" hero image) with the whip's themed
 * title PNG overlaid at the top. On hover/focus, the primary image
 * crossfades into a secondary detail shot (the "Transition" close-up) —
 * a peek at the plaiting craftsmanship without having to click through.
 *
 * Intentionally has no surrounding heading. The tiles are meant to spark
 * curiosity — the title PNGs tell you what each one is, and the hover
 * interaction rewards anyone who pauses to look closer.
 *
 * Sits between the FeaturedPair and the long-form SpecialtyWhipList.
 * Same constrained 1080px width as FeaturedPair, continuing the "narrower
 * homepage width" pattern below the full-bleed Hero and CategoryTileRow.
 *
 * Responsive: 2-column grid on desktop/tablet → single column on mobile.
 * 2×3 was chosen over 3×2 so the section takes up meaningful vertical
 * space on the homepage — the larger tiles also give the header PNGs
 * and hover crossfade more room to land.
 *
 * Hover/focus interactions use class-name selectors (`.tile-primary`,
 * `.tile-secondary`, `.tile-gradient`, `.tile-cta`) rather than Emotion's
 * component-selector syntax — that feature requires `@emotion/babel-plugin`
 * which isn't configured in this project.
 *
 * Lazy loading: both primary and secondary images use native
 * `loading="lazy"`. The grid sits well below the fold, so neither loads
 * until the user scrolls close to it. The secondary image intentionally
 * loads at the same time as the primary (not on-first-hover) to avoid a
 * pop-in flash when the user hovers for the first time — the trade-off is
 * doubling the image count for this section, but they're the same photos
 * the specialty detail pages already serve, so they'll be cached anyway.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 96px;
  margin-bottom: 96px;

  /* Phone-width trim — matches the tighter 48px vertical rhythm used
     across every homepage section at this breakpoint, so the page
     doesn't feel like endless empty scrolling on a small viewport. */
  @media (max-width: 560px) {
    margin-top: 48px;
    margin-bottom: 48px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* Tighter gap than FeaturedPair's 24px — six tiles in a dense grid reads
     as a curated showcase / collection rather than a pair of editorial
     cards (which is what FeaturedPair is doing one section up). */
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  text-decoration: none;
  color: #f5ebe0;
  background-color: #1a140f;

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -4px;
  }

  /* Hover/focus: crossfade primary out and secondary in, both scale up
     slightly in lockstep (feels like the camera pushing in rather than
     a slideshow swap). Gradient deepens and CTA fades up from below. */
  &:hover .tile-primary,
  &:focus-visible .tile-primary {
    opacity: 0;
    transform: scale(1.05);
  }

  &:hover .tile-secondary,
  &:focus-visible .tile-secondary {
    opacity: 1;
    transform: scale(1.05);
  }

  &:hover .tile-gradient,
  &:focus-visible .tile-gradient {
    background: linear-gradient(
      to top,
      rgba(26, 20, 15, 0.95) 0%,
      rgba(26, 20, 15, 0.45) 45%,
      rgba(26, 20, 15, 0.1) 100%
    );
  }

  &:hover .tile-cta,
  &:focus-visible .tile-cta {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Primary/Secondary are both <img> tags (not CSS background-image) so we
 * get native `loading="lazy"` and `decoding="async"` for free, plus proper
 * alt-text semantics. They're stacked absolutely and crossfaded via opacity.
 */
const TileImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease, transform 0.8s ease;
  will-change: opacity, transform;
`;

const PrimaryImage = styled(TileImage)`
  opacity: 1;
  z-index: 0;
`;

const SecondaryImage = styled(TileImage)`
  opacity: 0;
  z-index: 0;
`;

/**
 * Themed title PNG — every specialty whip has one in its frontmatter
 * (e.g. TheIndyBullwhipHeader.png). Smaller max-height than the
 * FeaturedPair overlay (40% vs 58%) because these tiles are smaller and
 * the header PNG shouldn't dominate the tile. Anchored near the top
 * with a small percentage offset so it scales with tile size.
 */
const HeaderOverlay = styled.img`
  position: absolute;
  top: 4%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 78%;
  max-height: 40%;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.55));
  z-index: 2;
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  /* Subtle resting state — just enough to tint the bottom so the CTA
     won't get lost against a light photo when it fades in on hover. */
  background: linear-gradient(
    to top,
    rgba(26, 20, 15, 0.65) 0%,
    rgba(26, 20, 15, 0.15) 45%,
    rgba(26, 20, 15, 0) 75%
  );
  transition: background 0.4s ease;
  z-index: 1;
  pointer-events: none;
`;

/**
 * CTA label ("View the [name] →") starts hidden and fades in on hover/focus
 * on desktop — part of the "peek below the craftsmanship" reward for
 * pausing on a tile.
 *
 * On touch devices there's no hover, so without an override the CTA would
 * stay permanently invisible and phone users would never see the label.
 * The `@media (hover: none)` query targets hardware without hover capability
 * specifically (iOS/Android touch, not just narrow viewports — a desktop
 * at a narrow width should still get the fade-in behavior). On those
 * devices the CTA is shown persistently in its settled state. The CTA's
 * built-in text-shadow + the resting gradient's bottom-heavy darkening
 * (0.65 alpha at the bottom) are already enough contrast against any
 * whip photo, so no gradient tweak needed on the touch path.
 */
const CTA = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  text-align: center;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d6a85f;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: 2;
  pointer-events: none;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);

  @media (hover: none) {
    opacity: 1;
    transform: translateY(0);
  }
`;

type SpecialtyWhip = {
  slug: string;
  /** Full formal title — used for the tile's aria-label. */
  title: string;
  /** Short display name for the CTA, e.g. "Indy" → "View the Indy →". */
  shortName: string;
  /** One-line descriptor for the aria-label to give screen readers context. */
  blurb: string;
  /** "Wide" hero shot — shown by default. */
  primaryImage: string;
  /** "Transition" detail shot — shown on hover/focus. */
  secondaryImage: string;
  /** Themed title PNG overlaid at the top of the tile. */
  headerImage: string;
};

const WHIPS: SpecialtyWhip[] = [
  {
    slug: '/specialty/indy',
    title: 'The Indy Bullwhip',
    shortName: 'Indy',
    blurb: 'Built for the fans who watched a hero swing across a chasm.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW592Indy67RaiderWide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW592Indy67RaiderTransition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/indy/TheIndyBullwhipHeader.png',
  },
  {
    slug: '/specialty/catwhip',
    title: 'The Catwhip',
    shortName: 'Catwhip',
    blurb: 'Sleek, dark, and dangerous — no mid knot, clean lines.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW598CW35Wide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW598CW35Transition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/catwhip/TheCatwhipHeader.png',
  },
  {
    slug: '/specialty/zwhip',
    title: 'The Z Whip',
    shortName: 'Z Whip',
    blurb: 'All black, silver collar — the masked vigilante of bullwhips.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW333ZW3Wide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW333ZW3Transition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/zwhip/TheZWhipHeader.png',
  },
  {
    slug: '/specialty/nightlord',
    title: 'The Nightlord',
    shortName: 'Nightlord',
    blurb: 'Midnight blue and gold — a bullwhip that hunts best in the dark.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW101540K1NightlordWide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW101540K1NightlordTransition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/40K/nightlordHeader.png',
  },
  {
    slug: '/specialty/mando',
    title: 'The Mando Bullwhip',
    shortName: 'Mando',
    blurb: 'Forest green with crimson accents — a bounty hunter\'s weapon.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW511Mando1Wide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW511Mando1Transition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/mando/mandoHeader2.png',
  },
  {
    slug: '/specialty/harlequin',
    title: 'The Harlequin',
    shortName: 'Harlequin',
    blurb: 'A three-color showstopper for a little mayhem with your craft.',
    primaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW600HQ1Wide.jpg',
    secondaryImage:
      'https://whipworks.s3.us-east-2.amazonaws.com/gallery/specialty/BW600HQ1Transition.jpg',
    headerImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/harlequin/harlequin2.png',
  },
];

/**
 * Tiles animate in from alternating sides as the user scrolls them
 * into view — row by row, not all at once. Left column tiles slide
 * in from the left (x: -40 → 0), right column tiles from the right
 * (x: +40 → 0). Each tile owns its own viewport trigger, so the
 * animation fires when that specific tile enters the viewport, not
 * when the whole grid does. Both tiles within a row share a Y
 * position, so they fire together naturally as that row scrolls
 * into view — no explicit row coordination needed.
 *
 * This is the one section on the homepage that deviates from the
 * generic `FadeInOnScroll` pattern used everywhere else: the
 * alternating-direction + per-row-scroll reveal only works with
 * per-tile Intersection Observers, which `FadeInOnScroll`'s single
 * wrapper can't express.
 *
 * Implemented via `motion(Tile)`: wrapping the existing styled
 * Link rather than restructuring. Emotion's styled() forwards refs,
 * as does Gatsby's Link, so framer-motion can attach its internal
 * ref for viewport detection without a layout shim.
 *
 * `viewport.amount: 0.3` fires when 30% of the tile has crossed into
 * the viewport — late enough that the trigger doesn't feel
 * premature (animating before the tile is visibly there), early
 * enough that the user sees the motion happen as they scroll toward
 * it, not after the tile is already fully on-screen.
 */
const MotionTile = motion(Tile);

/* Per-tile variant factory: picks the slide-in x direction based on
   column (index % 2 — left col slides from left, right col slides
   from right). No delay here: each tile's own whileInView handles
   the trigger timing as the user scrolls. */
const getTileVariants = (index: number) => {
  const fromLeft = index % 2 === 0;
  return {
    hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };
};

const FeaturedSpecialtyGrid = () => {
  /* Honor the user's OS-level reduced-motion preference. When set,
     render the grid with no motion at all — still functional, just
     no animated reveal. */
  const shouldReduceMotion = useReducedMotion();

  const tileMotionProps = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, amount: 0.3 },
          variants: getTileVariants(i),
        };

  return (
    <SectionContainer aria-label="Featured specialty bullwhips">
      <Grid>
        {WHIPS.map((w, i) => (
          <MotionTile
            key={w.slug}
            to={w.slug}
            aria-label={`${w.title}: ${w.blurb}`}
            {...tileMotionProps(i)}
          >
            <PrimaryImage
              className="tile-primary"
              src={w.primaryImage}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <SecondaryImage
              className="tile-secondary"
              src={w.secondaryImage}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden
            />
            <Gradient className="tile-gradient" aria-hidden />
            <HeaderOverlay
              src={w.headerImage}
              alt={w.title}
              loading="lazy"
              decoding="async"
            />
            <CTA className="tile-cta" aria-hidden>
              View the {w.shortName} →
            </CTA>
          </MotionTile>
        ))}
      </Grid>
    </SectionContainer>
  );
};

export default FeaturedSpecialtyGrid;
