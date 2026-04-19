import React from 'react';
import styled from '@emotion/styled';

/**
 * InstagramFeed
 *
 * Second-to-last editorial section on the homepage, between
 * ReviewsRotator and ContactCTA. Previously this component was a
 * full-bleed 2×3 grid of generic Instagram thumbnails with a floating
 * Chakra button — replaced here with a curated 2×2 showcase of four
 * specific posts (2 reels + 2 traditional posts) presented in 9:16
 * phone proportions to honor the medium: reels are watched vertically
 * on phones, so we frame them that way here rather than cropping to
 * square.
 *
 * Constrained width (not full-bleed) — the full-bleed rhythm of the
 * page is claimed by Hero / CategoryTileRow / CinematicBand /
 * ReviewsRotator / ContactCTA. An IG section in between those bookends
 * reads more as an editorial aside than another full-width event.
 *
 * The grid is narrower than the 1080px content track (max-width 720px)
 * so 9:16 tiles don't balloon into giant vertical billboards on
 * wide monitors — ~340px wide × 605px tall each at desktop, which is
 * roughly "phone held at arm's length" scale.
 *
 * Tile affordance: each tile is a single external link opening the
 * Instagram post in a new tab. Reels get a play-icon overlay centered
 * on the tile (circular gold glyph) so they're visually distinguished
 * from static posts — small cue, but it's the difference between the
 * user expecting a video vs. a still image.
 *
 * Hover/focus uses class-name selectors (`.post-image`, `.post-vignette`,
 * `.post-play`) — same pattern as FeaturedPair, FeaturedSpecialtyGrid,
 * and MakeYourOwnCTA. Avoids pulling in @emotion/babel-plugin.
 */

const INSTAGRAM_CDN = 'https://d3ruufruf2uqog.cloudfront.net/instagram';
const PROFILE_URL = 'https://www.instagram.com/whipworks/';

type IgPost = {
  /** Instagram URL for the specific reel/post. */
  href: string;
  /** Thumbnail image filename under `${INSTAGRAM_CDN}/`. */
  image: string;
  /** Alt text for the thumbnail. */
  alt: string;
  /** Reels get a play-icon overlay; posts do not. */
  kind: 'reel' | 'post';
};

const FEATURED: IgPost[] = [
  {
    href: 'https://www.instagram.com/reel/DMsbvctM-Mz/',
    image: 'blacksmithsBullwhip.png',
    alt: "Reel: Blacksmith's bullwhip",
    kind: 'reel',
  },
  {
    href: 'https://www.instagram.com/reel/DEDPVzDPmM5/',
    image: 'indyBullwhip.jpg',
    alt: 'Reel: Indy bullwhip build',
    kind: 'reel',
  },
  {
    href: 'https://www.instagram.com/p/DDXYD25hB68/?img_index=1',
    image: 'BS591-3.jpg',
    alt: 'Post: BS591 specialty whip',
    kind: 'post',
  },
  {
    href: 'https://www.instagram.com/p/Cb2bQTPupF3/?img_index=1',
    image: 'BW542OnYellow3.jpg',
    alt: 'Post: BW542 bullwhip on yellow background',
    kind: 'post',
  },
];

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 96px;
  margin-bottom: 96px;
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 10px;
  text-align: center;
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

/**
 * Inline Instagram glyph used at the end of the heading ("Follow along
 * on [icon]"). Uses currentColor for stroke so it matches the heading's
 * cream color without needing a separate prop. Sized in em so it
 * automatically scales with the heading font-size at each breakpoint.
 *
 * vertical-align nudge (-0.15em) pulls the glyph down from the text
 * baseline to sit optically centered against the lowercase x-height —
 * pure baseline alignment makes the icon float too high relative to
 * the serif letterforms.
 *
 * The "flash dot" (upper-right) is a zero-length line with
 * stroke-linecap=round, which renders as a small round dot — the
 * Feather icon convention. Cleaner than a separate <circle> because
 * it picks up the same currentColor + stroke-width styling as the
 * rest of the icon without exceptions.
 */
const InstagramIcon = styled.svg`
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  vertical-align: -0.15em;
  margin-left: 0.35em;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
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

/* 2×2 grid cap at 720px: a full 1080px-wide grid of 9:16 tiles would
   produce two ~525px-wide billboard-sized verticals, which reads as too
   aggressive for an IG aside. 720px keeps each tile ~344px wide —
   phone-screen-sized at typical viewing distance. */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: 560px) {
    /* Single column on phones — a 2-col mobile layout would squeeze the
       already-portrait tiles to an awkward sliver (~45vw wide). Better
       to show them one at a time at full comfortable width, even though
       the page scrolls longer. */
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 360px;
  }
`;

const Tile = styled.a`
  position: relative;
  display: block;
  /* 9:16 portrait — the native aspect ratio of IG reels and tall stories.
     Posts can technically be square or 4:5, but cropping them to 9:16
     here keeps the whole grid visually consistent (cover-crop handles
     the individual images' proportions). */
  aspect-ratio: 9 / 16;
  overflow: hidden;
  background-color: #0f0b08;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: -3px;
  }

  &:hover .post-image,
  &:focus-visible .post-image {
    transform: scale(1.04);
  }

  &:hover .post-vignette,
  &:focus-visible .post-vignette {
    opacity: 1;
  }

  &:hover .post-play,
  &:focus-visible .post-play {
    background-color: rgba(214, 168, 95, 0.9);
    border-color: rgba(214, 168, 95, 0.9);
  }
`;

const PostImage = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  transition: transform 0.8s ease;
  will-change: transform;
`;

/* Soft darkening overlay on hover — pulls focus to the play glyph (on
   reels) or just gives the tile a subtle interactive feedback (on
   posts). Starts at 0 opacity and fades to 0.3 on hover. */
const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.45) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
`;

/* Play button for reels. Circular, semi-transparent dark center with a
   thin gold border — sits on top of the thumbnail, centered. On hover
   the fill shifts from dark-translucent to solid gold (the transition
   is driven by the parent Tile's :hover state). The triangle itself is
   an SVG so it scales cleanly and stays a perfect shape at any size. */
const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(26, 20, 15, 0.55);
  border: 2px solid rgba(214, 168, 95, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  pointer-events: none;

  @media (max-width: 560px) {
    width: 56px;
    height: 56px;
  }
`;

const PlayTriangle = styled.svg`
  width: 22px;
  height: 22px;
  /* Slight right-shift so the triangle sits optically centered — a pure
     geometric center puts the triangle's visual weight to the left of
     the circle because the shape's mass is on the right. */
  margin-left: 4px;
  fill: #f5ebe0;
`;

/* Footer CTA — subtle gold-underline link to match the mailto styling
   on ContactCTA. Intentionally quieter than the current heavy Chakra
   button; the 4 featured tiles are already doing the work of inviting
   the user to the IG profile. */
const FooterWrap = styled.div`
  margin-top: 32px;
  text-align: center;
`;

const SeeMoreLink = styled.a`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d6a85f;
  text-decoration: none;
  border-bottom: 1px solid rgba(214, 168, 95, 0.4);
  padding-bottom: 2px;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover,
  &:focus-visible {
    color: #f5ebe0;
    border-bottom-color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 3px;
  }
`;

const InstagramFeed = () => {
  return (
    <SectionContainer aria-label="Featured Instagram posts">
      <Eyebrow>@whipworks</Eyebrow>
      <Heading>
        Follow along on
        <InstagramIcon viewBox="0 0 24 24" aria-hidden>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
        </InstagramIcon>
      </Heading>
      <Subhead>
        New whips, workshop moments, and builds-in-progress.
      </Subhead>
      <Grid>
        {FEATURED.map((post) => (
          <Tile
            key={post.href}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={post.alt}
          >
            <PostImage
              className="post-image"
              src={`${INSTAGRAM_CDN}/${post.image}`}
              aria-hidden
            />
            <Vignette className="post-vignette" aria-hidden />
            {post.kind === 'reel' && (
              <PlayButton className="post-play" aria-hidden>
                <PlayTriangle viewBox="0 0 24 24" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </PlayTriangle>
              </PlayButton>
            )}
          </Tile>
        ))}
      </Grid>
      <FooterWrap>
        <SeeMoreLink
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          See more on Instagram →
        </SeeMoreLink>
      </FooterWrap>
    </SectionContainer>
  );
};

export default InstagramFeed;
