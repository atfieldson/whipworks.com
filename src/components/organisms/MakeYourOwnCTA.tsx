import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * MakeYourOwnCTA
 *
 * "Want to make your own?" tri-CTA inviting visitors into three separate
 * DIY paths: downloadable PDF blueprints, the free YouTube tutorial
 * channel, and the materials shop. Sits below the CinematicBand at the
 * constrained 1080px width (same as FeaturedSpecialtyGrid) so it lands
 * as a focused call-to-action rather than another full-bleed moment.
 *
 * Layout: two rows. Row 1 is Blueprints + Materials side by side; row 2
 * is the YouTube Tutorials card taking the full width with a horizontal
 * image+text treatment (the YouTube card gets top-billing visual weight
 * because tutorials are the most beginner-accessible of the three paths).
 * On mobile everything collapses to a single stacked column — the wide
 * YouTube card becomes vertical like the others at that width.
 *
 * 24px gap matches FeaturedPair (editorial rhythm for multi-card rows at
 * the constrained width — tighter gaps are reserved for the denser
 * FeaturedSpecialtyGrid showcase).
 *
 * One of the three destinations (YouTube) is external, so each card
 * dispatches to either a Gatsby <Link> (internal, gets prefetch) or a
 * plain <a target="_blank"> (external). Visual styling is identical via
 * a shared CSS string composed into both styled variants.
 *
 * Hover/focus interactions use class-name selectors (`.card-image`,
 * `.card-cta`, `.card-cta-arrow`) — same pattern as FeaturedPair and the
 * other homepage organisms, avoiding the need for @emotion/babel-plugin.
 *
 * Scroll-triggered animation is managed internally rather than via the
 * generic `FadeInOnScroll` wrapper used elsewhere on the homepage — the
 * Blueprints and Materials cards slide in from alternating sides (same
 * alternating treatment as FeaturedSpecialtyGrid's tiles) while the
 * Heading/Subhead block fades up and the wide YouTube card fades up.
 * That mix only works with per-element viewport triggers, which a
 * single outer wrapper can't express.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 96px;
  margin-bottom: 96px;
`;

const Heading = styled.h2`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: #f5ebe0;
  margin: 0 0 10px;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 1.75rem;
  }
`;

const Subhead = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: #f5ebe0;
  opacity: 0.85;
  margin: 0 auto 40px;
  text-align: center;
  max-width: 56ch;

  @media (max-width: 900px) {
    margin-bottom: 28px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Card styling is shared between the internal-link and external-link
 * variants by composing this string into both styled components.
 *
 * A `.wide` modifier class is applied (via the `wide` prop on the
 * rendered component) for the YouTube card: it spans both grid columns
 * (`grid-column: 1 / -1`), flips to a horizontal image-left / text-right
 * layout, and reverts to the default vertical layout at mobile widths.
 * This is how we get the "2 cards in row 1, 1 full-width card in row 2"
 * structure without duplicating styled components.
 */
const cardCSS = `
  position: relative;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #f5ebe0;
  background-color: #1a140f;

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -4px;
  }

  &:hover .card-image,
  &:focus-visible .card-image {
    transform: scale(1.04);
  }

  &:hover .card-cta,
  &:focus-visible .card-cta {
    color: #d6a85f;
  }

  &:hover .card-cta-arrow,
  &:focus-visible .card-cta-arrow {
    transform: translateX(4px);
  }

  /* Wide variant: full grid width, horizontal layout at desktop/tablet,
     collapses back to vertical layout at mobile (which is already
     single-column so grid-column: span is a no-op at that width). */
  &.wide {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: stretch;
  }

  &.wide .card-image-frame {
    flex: 0 0 55%;
    /* Reset the 4:3 aspect-ratio from the default vertical layout — in
       wide mode the image height is driven by align-items: stretch on
       the flex row (matches the card body height, whichever is taller). */
    aspect-ratio: auto;
    min-height: 320px;
  }

  &.wide .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 48px;
  }

  @media (max-width: 900px) {
    &.wide {
      flex-direction: column;
    }
    &.wide .card-image-frame {
      flex: 0 0 auto;
      aspect-ratio: 4 / 3;
      min-height: 0;
    }
    &.wide .card-body {
      padding: 24px 24px 28px;
    }
  }
`;

const InternalCard = styled(Link)`
  ${cardCSS}
`;

const ExternalCard = styled.a`
  ${cardCSS}
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  /* 4:3 landscape — at the 3-across desktop layout each card image is
     ~344×258px, a comfortable thumbnail-sized preview that doesn't
     dominate the card. */
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: #000;
`;

const CardImage = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.8s ease;
  will-change: transform;
`;

const CardBody = styled.div`
  padding: 28px 28px 32px;

  @media (max-width: 900px) {
    padding: 24px 24px 28px;
  }
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 10px;
`;

const CardTitle = styled.h3`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 1.25;
  margin: 0 0 12px;
`;

const CardBlurb = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.95rem;
  line-height: 1.55;
  letter-spacing: 0.02em;
  margin: 0 0 22px;
  opacity: 0.88;
`;

const CardCTA = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f5ebe0;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const CardCTAArrow = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
`;

type Path = {
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  image: string;
  /** Internal route (e.g. "/materials") or external URL (e.g. "https://..."). */
  href: string;
  /** Explicit flag to force external-link behavior when an internal path
      should nevertheless open in a new tab, or vice versa. Defaults to
      auto-detecting from href (starts-with-slash → internal). */
  external?: boolean;
  /** When true, the card spans both columns of the grid and uses a
      horizontal image+text layout at desktop/tablet widths. Used for the
      YouTube tutorials card so it gets top-billing on its own row. */
  wide?: boolean;
};

/**
 * Ordering matters for the grid: Blueprints + Materials go first (row 1,
 * side-by-side), then YouTube Tutorials takes row 2 on its own (wide).
 *
 * YouTube thumbnail URL: `https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`
 * is YouTube's standard pattern for the high-res poster frame of any
 * public video. Video ID `1vbdQ3zavmI` is the first entry in the
 * tutorial playlist.
 */
const PATHS: Path[] = [
  {
    eyebrow: 'Guides',
    title: 'Whipmaking Blueprints',
    blurb:
      'Detailed PDF guides covering strand lengths, transition details, and overlay designs.',
    cta: 'See the blueprints',
    image:
      'https://d3ruufruf2uqog.cloudfront.net/blueprints/bullwhip/blueprintSample1.jpg',
    href: '/whip-making-blueprints',
  },
  {
    eyebrow: 'Supplies',
    title: 'Whipmaking Materials',
    blurb:
      'Coreless paracord, conchos, steel handle rods, fids, and other supplies needed to build a whip from scratch.',
    cta: 'Shop materials',
    image:
      'https://d3ruufruf2uqog.cloudfront.net/whipMakingMaterials/paracord/paracord1.jpg',
    href: '/whipmaking-materials',
  },
  {
    eyebrow: 'Tutorials',
    title: 'YouTube Tutorials',
    blurb:
      'Free step-by-step videos covering everything from building the core to finishing the accent knots.',
    cta: 'Watch on YouTube',
    image: 'https://img.youtube.com/vi/1vbdQ3zavmI/maxresdefault.jpg',
    href: 'https://www.youtube.com/watch?v=1vbdQ3zavmI&list=PL7ZnesQ3s0wCIm1eQ2B1IIx3ESAhjYlDx',
    wide: true,
  },
];

/* Auto-detect: anything starting with "/" is an internal Gatsby route and
   gets the <Link> prefetch treatment; anything else (http://, https://,
   mailto:, etc.) becomes a plain anchor with target="_blank". */
const isExternalHref = (href: string) => !href.startsWith('/');

/**
 * Motion-wrapped variants of the two card shells. Both emotion's
 * styled() and Gatsby's Link forward refs, and a plain <a> is a
 * native element — so framer-motion can attach its own ref on either
 * without a layout shim. The returned components accept all the same
 * props as the originals plus motion's initial/whileInView/variants/
 * viewport, which is exactly what we need.
 */
const MotionInternalCard = motion(InternalCard);
const MotionExternalCard = motion(ExternalCard);

/* Heading + Subhead fade up as the section enters the viewport —
   same resting-to-settled pattern used by the generic FadeInOnScroll
   wrapper, just inlined here so the section can orchestrate its own
   cascade instead of relying on an outer wrapper. */
const headerBlockVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

/* Blueprints (left column) slides in from the left, Materials (right
   column) slides in from the right — same alternating-direction
   treatment FeaturedSpecialtyGrid uses for its 2-wide tile rows. Each
   card owns its own `whileInView` trigger, so they fire together as
   that row scrolls into view (both share a Y position in the grid). */
const slideInVariants = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
});

/* The wide YouTube card on row 2 spans the full grid width, so a
   horizontal slide would feel lopsided on a full-width element.
   Fade-up instead — reads as a natural "next beat" arriving after
   the two cards above slide in from the sides. */
const wideCardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

type CardInnerProps = {
  path: Path;
};

const CardInner = ({ path }: CardInnerProps) => (
  <>
    <ImageFrame className="card-image-frame">
      <CardImage className="card-image" src={path.image} aria-hidden />
    </ImageFrame>
    <CardBody className="card-body">
      <Eyebrow>{path.eyebrow}</Eyebrow>
      <CardTitle>{path.title}</CardTitle>
      <CardBlurb>{path.blurb}</CardBlurb>
      <CardCTA className="card-cta">
        {path.cta}
        <CardCTAArrow className="card-cta-arrow" aria-hidden>
          →
        </CardCTAArrow>
      </CardCTA>
    </CardBody>
  </>
);

const MakeYourOwnCTA = () => {
  /* Respect OS-level reduced-motion preference. When set, skip all
     the scroll-triggered motion and render everything in its settled
     state — the section is fully functional without animation. */
  const shouldReduceMotion = useReducedMotion();

  const headerMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.3 },
        variants: headerBlockVariants,
      };

  /* Per-card motion props: wide card fades up, others slide in from
     alternating sides based on their column (index 0 = left column,
     index 1 = right column). `amount: 0.3` fires when 30% of the
     card has crossed into the viewport — late enough that the
     trigger doesn't feel premature, early enough that the motion
     happens as the user scrolls toward it. */
  const cardMotionProps = (path: Path, index: number) => {
    if (shouldReduceMotion) return {};
    if (path.wide) {
      return {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.3 },
        variants: wideCardVariants,
      };
    }
    return {
      initial: 'hidden' as const,
      whileInView: 'visible' as const,
      viewport: { once: true, amount: 0.3 },
      variants: slideInVariants(index % 2 === 0),
    };
  };

  return (
    <SectionContainer aria-label="Make your own whip">
      <motion.div {...headerMotionProps}>
        <Heading>Want to make your own?</Heading>
        <Subhead>
          Start from a blueprint, learn from the tutorials, or stock up on materials.
        </Subhead>
      </motion.div>
      <Grid>
        {PATHS.map((p, i) => {
          const external = p.external ?? isExternalHref(p.href);
          const ariaLabel = `${p.title}: ${p.blurb}`;
          /* className="wide" is the trigger for the full-width horizontal
             card layout — the `&.wide` selectors in cardCSS handle the
             grid-column span and flex-direction swap. */
          const classNames = p.wide ? 'wide' : undefined;
          const motionProps = cardMotionProps(p, i);
          return external ? (
            <MotionExternalCard
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames}
              aria-label={ariaLabel}
              {...motionProps}
            >
              <CardInner path={p} />
            </MotionExternalCard>
          ) : (
            <MotionInternalCard
              key={p.href}
              to={p.href}
              className={classNames}
              aria-label={ariaLabel}
              {...motionProps}
            >
              <CardInner path={p} />
            </MotionInternalCard>
          );
        })}
      </Grid>
    </SectionContainer>
  );
};

export default MakeYourOwnCTA;
