import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CinematicBand
 *
 * A full-bleed image band with a centered tagline overlaid on top. Sits
 * between the FeaturedSpecialtyGrid and the later "make your own" tri-CTA
 * as a deliberate atmospheric pause — no buttons, no links, just a moment
 * to breathe and look at the craftsmanship.
 *
 * Currently uses the "TransitionFeature" photo (layered plaiting / bolster
 * / shot-loaded core exposed in cross-section). Long-term plan: move the
 * current Hero image into this slot and replace the Hero with a short
 * looping video — this band becomes the "still-frame showcase" and Hero
 * becomes the "moving showcase."
 *
 * Full-bleed breakout uses the same `margin-left: calc((100% - 100vw) / 2)`
 * pattern as Hero and CategoryTileRow to escape the 1080px Content
 * container.
 *
 * Atmospheric intent: no CTA, no interaction. Just the image, a dark
 * center-weighted vignette to keep the tagline readable over varied
 * photography, and the tagline itself.
 *
 * Hidden on smartphones (≤560px). The band's cinematic impact relies on
 * a wide landscape frame; at narrow widths the photo crops too tight and
 * the tagline loses its breathing room. Mobile users get a more focused
 * scroll without the nearly-square filler block.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  width: 100vw;
  max-width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  margin-top: 96px;
  margin-bottom: 96px;
  /* Letterbox-ish proportion — tall enough to feel cinematic, not so tall
     that it eats the whole viewport and loses the "pause between sections"
     effect. Capped with max-height so ultra-tall monitors don't stretch it
     into a wall of photo. */
  height: 60vh;
  min-height: 440px;
  max-height: 640px;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 45vh;
    min-height: 360px;
  }

  /* Hidden on smartphones — the band's cinematic impact depends on a wide
     landscape frame, and at narrow widths the image gets cropped so tight
     that it loses the "layered plaiting" readability. The tagline's three
     short phrases also read more naturally inline in the longer-form
     sections above and below, so dropping this section on small screens
     keeps the mobile scroll focused rather than adding a nearly-square
     photo block mid-page. */
  @media (max-width: 560px) {
    display: none;
  }
`;

const Background = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  /* Soft center-weighted vignette — pulls focus to the tagline without
     heavily flattening the photo's detail. Radial gradient goes from a
     light center darken (0.2) to a heavier edge darken (0.55). */
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
`;

/* motion.h2 instead of plain h2 so we can drive the parallax y-translate
   from scroll progress via framer-motion. `will-change: transform` tells
   the browser to promote this to its own layer up front — smoother
   scroll-driven animation without paint jank on every frame. */
const Tagline = styled(motion.h2)`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 3rem;
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: #f5ebe0;
  margin: 0;
  /* Widened to 40ch so the full tagline fits on a single line on typical
     desktop viewports (≥~1000px). On narrower widths the natural container
     edge forces a clean wrap — usually splitting after "loaded," so mobile
     still reads as two balanced lines rather than an awkward one-word
     orphan. The cap prevents the line from stretching absurdly wide on
     ultra-wide monitors. */
  max-width: 40ch;
  /* Soft dark shadow acts as a localized fallback for any part of the
     photo that happens to be too bright under the tagline. */
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.75);
  will-change: transform;

  @media (max-width: 900px) {
    font-size: 2.1rem;
  }

  @media (max-width: 560px) {
    font-size: 1.75rem;
  }
`;

const IMAGE =
  'https://whipworks.s3.us-east-2.amazonaws.com/bannerImages/TransitionFeature.jpg';

const CinematicBand = () => {
  /* Scroll-driven parallax on the tagline only — the background image
     stays still. `useScroll({ target: ref, offset: ['start end', 'end start'] })`
     gives a 0→1 progress value that advances as the band travels through
     the viewport: 0 when the band's top edge hits the viewport's bottom
     edge (just entering), 1 when the band's bottom edge hits the viewport's
     top edge (just leaving). Mapping that to y: -60 → 60 makes the tagline
     drift downward ~120px of total travel over the band's entire visibility
     window — the text feels held back slightly against the scroll, pulling
     the eye with it and encouraging the user to keep reading down the page. */
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const taglineY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <SectionContainer
      ref={containerRef}
      aria-label="Every whip is triple plaited, shot loaded, and handmade"
    >
      <Background aria-hidden src={IMAGE} />
      <Overlay aria-hidden />
      <Content>
        <Tagline style={{ y: taglineY }}>
          Triple plaited, shot loaded, hand made
        </Tagline>
      </Content>
    </SectionContainer>
  );
};

export default CinematicBand;
