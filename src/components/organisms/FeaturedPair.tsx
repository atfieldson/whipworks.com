import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

/**
 * FeaturedPair
 *
 * 2-column section below the CategoryTileRow. Two editorial cards:
 *   1. About the Whipmaker — personal intro from Adam, links to /about
 *   2. The Blacksmith's Bullwhip — featured specialty whip, links to /specialty/blacksmith
 *
 * Unlike the Hero and CategoryTileRow (which are full-bleed 100vw), this
 * section flows inside the 1080px Content container — creating negative
 * space on either side at wider viewports. This is the "narrower" homepage
 * width that subsequent sections will also use.
 *
 * Each card has a large image on top (3:2 aspect), text block below on the
 * dark site background. Differs from CategoryTileRow intentionally — tiles
 * overlay text on image; featured cards separate image and text for a more
 * editorial / magazine feel that matches the "meet the maker" and "featured
 * whip" purposes of the two cards.
 *
 * Responsive: 2-column desktop, stacked single-column ≤900px.
 *
 * Hover/focus interactions use class-name selectors (`.card-image`,
 * `.card-cta`) rather than Emotion's component-selector syntax — the
 * component-selector feature requires `@emotion/babel-plugin` which isn't
 * configured in this project.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 96px;
  margin-bottom: 96px;

  /* Phone-width trim — 96px + 96px between every homepage section
     adds up to a lot of negative space on a small viewport. Halving
     to 48px keeps the editorial rhythm ("these are distinct
     sections") without eating half the scroll. Applied consistently
     across every homepage organism at this breakpoint. */
  @media (max-width: 560px) {
    margin-top: 48px;
    margin-bottom: 48px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Small gap between cards — visible on the dark page background, signals
     "related pair" without making them feel like a single slab. On mobile
     this becomes the vertical gap between stacked cards. */
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
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
    transform: scale(1.03);
  }

  &:hover .card-cta,
  &:focus-visible .card-cta {
    color: #d6a85f;
  }

  &:hover .card-cta-arrow,
  &:focus-visible .card-cta-arrow {
    transform: translateX(4px);
  }
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  /* Square crop — tall enough to show more of a portrait subject (like
     Adam's headshot) without having to letterbox. */
  aspect-ratio: 1 / 1;
  overflow: hidden;
  /* True black (not the site's #1a140f near-black) — many specialty whip
     photos are shot on true-black backdrops, so a matching black here lets
     us offset the image without a visible seam. */
  background-color: #000;
`;

/**
 * `position` lets each feature override background-position — important when
 * the source image is a tall portrait (e.g. Adam's portrait has his head at
 * the top of the frame, so we anchor 'center top' to keep the face visible).
 * `size` lets each feature override background-size (defaults 'cover').
 * `offsetY` vertically translates the entire image within the frame, using
 * the CSS `translate` property (independent of `transform` so it composes
 * cleanly with the hover scale). Useful when a photo has symmetric negative
 * space (e.g. Blacksmith's whip centered in true black): nudging down makes
 * the whip sit lower in the frame under the header overlay, and the gap at
 * the top blends seamlessly with the ImageFrame's black background.
 * Defaults: position 'center', size 'cover', offsetY '0'.
 */
const CardImage = styled.div<{
  src: string;
  position: string;
  size: string;
  offsetY: string;
}>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: ${(p) => p.size};
  background-position: ${(p) => p.position};
  translate: 0 ${(p) => p.offsetY};
  transition: transform 0.8s ease, translate 0.8s ease;
  will-change: transform, translate;
`;

/**
 * Optional PNG overlay — e.g. themed title graphics for specialty whips
 * ("The Blacksmith's Bullwhip", "The Indy", etc.). Anchored to the top of
 * the image frame with a small percentage-based offset (scales with card
 * size) and a drop-shadow for readability against varied backgrounds. Does
 * not participate in the hover zoom — the background image moves behind it
 * while the title graphic stays steady, which reads as depth/parallax.
 */
const CardOverlay = styled.img`
  position: absolute;
  /* Anchored ~7% down rather than hugging the frame edge — with custom 1x1
     JPGs that reserve ~20% of true black at the top, this lets the header
     PNG nestle into the reserved zone with a little breathing room above. */
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 78%;
  max-height: 58%;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.55));
  z-index: 1;
`;

const CardBody = styled.div`
  padding: 40px 40px 48px;

  @media (max-width: 900px) {
    padding: 32px 24px 40px;
  }

  /* Phone-width trim: 24px horizontal padding holds up, but the vertical
     breathing room tightens a bit so the stacked cards don't eat as much
     of the viewport at narrow widths. */
  @media (max-width: 560px) {
    padding: 24px 20px 32px;
  }
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 12px;
`;

const CardTitle = styled.h3`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 14px;

  @media (max-width: 900px) {
    font-size: 1.6rem;
  }

  /* Further reduction on narrow phones so a long title ("The Blacksmith's
     Bullwhip") stays on two lines instead of wrapping to three. */
  @media (max-width: 560px) {
    font-size: 1.4rem;
    margin-bottom: 10px;
  }
`;

const CardBlurb = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.55;
  letter-spacing: 0.02em;
  margin: 0 0 26px;
  opacity: 0.92;
  max-width: 52ch;

  @media (max-width: 900px) {
    font-size: 0.95rem;
  }
`;

const CardCTA = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
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

type Feature = {
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  image: string;
  /** CSS background-position value. Defaults to 'center' if omitted. */
  imagePosition?: string;
  /** CSS background-size value. Defaults to 'cover' if omitted. Use e.g.
      'auto 125%' to zoom in past cover and crop edges. */
  imageSize?: string;
  /** Vertical offset applied via CSS `translate` (e.g. '20px'). Shifts the
      photo down within its frame; the exposed space fills with ImageFrame's
      black bg for a seamless extension of black-backdrop whip photos. */
  imageOffsetY?: string;
  /** Optional PNG overlay (e.g. themed title graphic for specialty whips). */
  overlayImage?: string;
  /** Alt text for the overlay image. Required when overlayImage is set. */
  overlayAlt?: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    eyebrow: 'Meet the Maker',
    title: 'About the Whipmaker',
    blurb:
      "Hi, I'm Adam. I started WhipWorks in 2015 and have made over 1,000 whips since.",
    cta: 'See how I got here',
    /* Custom 1x1 crop composed specifically for this card — no positioning
       override needed; plain 'cover' + 'center' just works. */
    image:
      'https://whipworks.s3.us-east-2.amazonaws.com/adam/adam1x1.jpg',
    href: '/about',
  },
  {
    eyebrow: 'Featured Whip',
    title: "The Blacksmith's Bullwhip",
    blurb:
      'A collaboration with Cornish blacksmith Reece Foster. Choose three custom Elder Futhark runes for me to plait into the thong and handle.',
    cta: "See the Blacksmith's Bullwhip",
    /* Custom 1600×1600 crop composed specifically for this card: whip sits
       in the lower ~80% of the frame with 20% of true black at top reserved
       for the header PNG overlay. No CSS positioning tricks needed — plain
       'cover' + 'center' just works. */
    image:
      'https://whipworks.s3.us-east-2.amazonaws.com/specialty/blacksmith/BlacksmithWide1x1.jpg',
    overlayImage:
      'https://d3ruufruf2uqog.cloudfront.net/specialty/blacksmith/blacksmithHeader.png',
    overlayAlt: "The Blacksmith's Bullwhip",
    href: '/specialty/blacksmith',
  },
];

const FeaturedPair = () => {
  return (
    <SectionContainer aria-label="Featured: the whipmaker and the Blacksmith's Bullwhip">
      <Grid>
        {FEATURES.map((f) => (
          <Card key={f.href} to={f.href} aria-label={`${f.title}: ${f.blurb}`}>
            <ImageFrame>
              <CardImage
                className="card-image"
                src={f.image}
                position={f.imagePosition ?? 'center'}
                size={f.imageSize ?? 'cover'}
                offsetY={f.imageOffsetY ?? '0'}
                aria-hidden
              />
              {f.overlayImage && (
                <CardOverlay
                  src={f.overlayImage}
                  alt={f.overlayAlt ?? ''}
                  loading="lazy"
                />
              )}
            </ImageFrame>
            <CardBody>
              <Eyebrow>{f.eyebrow}</Eyebrow>
              <CardTitle>{f.title}</CardTitle>
              <CardBlurb>{f.blurb}</CardBlurb>
              <CardCTA className="card-cta">
                {f.cta}
                <CardCTAArrow className="card-cta-arrow" aria-hidden>
                  →
                </CardCTAArrow>
              </CardCTA>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </SectionContainer>
  );
};

export default FeaturedPair;
