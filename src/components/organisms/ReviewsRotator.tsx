import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import reviewData from '../../data/reviews.json';

/**
 * ReviewsRotator
 *
 * Full-bleed, short-height review rotator used as a decorative break
 * between content-dense sections of the homepage. Shows one review at a
 * time, auto-rotates every 15 seconds, pauses on hover, supports manual
 * navigation via pagination dots.
 *
 * Text content is capped at 1080px wide (the constrained-homepage width)
 * even though the background band is full-bleed — the band stretches to
 * the viewport edges to act as a page-breaker, but the review text stays
 * readable at a reasonable line length.
 *
 * Reviews are curated at module load from `src/data/reviews.json` (schema
 * documented in architecture.md): featured 5-star reviews with text
 * length 80–360 chars, newest first, capped at 10. The filter is
 * deterministic so SSR + hydration match; no randomization.
 *
 * Responsive behaviour: on phones (≤560px) the review text is truncated
 * to 4 lines via CSS line-clamp so the rotator's height stays predictable
 * on small screens. At larger viewports we trust the 80–360-char filter
 * to keep every review within ~4 lines naturally.
 *
 * Swipe animation uses framer-motion's AnimatePresence with `mode="wait"`
 * so only one review is mounted at a time — each enters from the right,
 * exits to the left.
 */

const S3_REVIEWS_URL = 'https://whipworks.s3.us-east-2.amazonaws.com/reviews';
const ROTATION_INTERVAL_MS = 15000;

type Review = {
  id: number;
  name: string;
  stars: number;
  date: string;
  product: string;
  text: string;
  hasPhoto: boolean;
};

/* Filter + sort once at module load. Taking the 10 newest featured
   5-star reviews with readable text length. Deterministic ordering is
   important for SSR: if this were randomized per render the
   server-rendered HTML wouldn't match what React hydrates on the client. */
const HOMEPAGE_REVIEWS: Review[] = [...reviewData.reviews]
  .filter(
    (r) =>
      r.featured && r.stars === 5 && r.text.length >= 80 && r.text.length <= 360,
  )
  .sort((a, b) => b.id - a.id)
  .slice(0, 10);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

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
  /* Slightly darker than the site background so the band reads as its
     own distinct zone — the "page-breaker" effect. A hairline top/bottom
     border in low-opacity accent gold gives it additional definition
     without being heavy. */
  background-color: #0f0b08;
  border-top: 1px solid rgba(214, 168, 95, 0.12);
  border-bottom: 1px solid rgba(214, 168, 95, 0.12);
  /* Short overall — meant to break up the page, not dominate it. The
     min-height accommodates the review text + stars + dots + see-all CTA
     comfortably; content grows the band a little for longer reviews. */
  min-height: 360px;
  padding: 48px 32px 40px;

  @media (max-width: 560px) {
    min-height: 300px;
    padding: 36px 24px 28px;
  }
`;

const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

/**
 * Fixed-height slot that wraps the AnimatePresence. This is the key to
 * stopping the dots + "See all reviews" link from bouncing as reviews
 * rotate: no matter how long the current review's text is, or whether
 * it has a photo, the slot reserves exactly the same vertical space. The
 * active review is vertically centered within the slot — short reviews
 * get symmetrical breathing room above and below rather than a visual
 * jump.
 *
 * Sized to comfortably fit the max possible content: photo (100px) +
 * stars + up to 4 lines of text + attribution meta, with a small buffer.
 */
const ReviewSlot = styled.div`
  width: 100%;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 900px) {
    height: 340px;
  }

  @media (max-width: 560px) {
    height: 280px;
  }
`;

/**
 * Row that holds the photo (when present) beside the review text.
 *
 * When the current review has a photo, the layout is photo-left + text-
 * right (flex row, 24px gap). When it doesn't, the text fills the full
 * 1080px width on its own — no empty space reserved for an absent photo.
 *
 * This is paired with `justify-content: space-between` on the motion.div
 * above: that pins Stars to the top of the ReviewSlot and Meta to the
 * bottom, so those two elements never shift vertically across reviews
 * regardless of whether the middle row is [photo + text] or just [text].
 *
 * On phones the row collapses to photo-on-top / text-below so neither
 * element gets squeezed too narrow.
 */
const ReviewContentRow = styled.div`
  width: 100%;
  max-width: 1080px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  @media (max-width: 560px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PhotoFrame = styled.div`
  flex: 0 0 auto;
  width: 160px;
  height: 160px;
  border-radius: 6px;
  overflow: hidden;

  @media (max-width: 900px) {
    width: 130px;
    height: 130px;
  }

  @media (max-width: 560px) {
    width: 90px;
    height: 90px;
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
`;

const Stars = styled.div`
  font-size: 1.65rem;
  letter-spacing: 0.15em;
  color: #d6a85f;
  /* No margin — the parent motion.div uses justify-content: space-between
     to pin this to the top of the slot. Margins would fight the flex
     distribution and push content around asymmetrically. */
`;

const ReviewTextBlock = styled.p`
  font-family: 'Domine Variable', Domine, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.15rem;
  line-height: 1.55;
  color: #f5ebe0;
  margin: 0;
  /* When paired with a photo, the photo frame reserves ~160px on the
     left, so text fills the remaining space in the row. When there's no
     photo, the ReviewContentRow's 1080px cap naturally bounds the text. */
  flex: 1;
  text-align: left;

  /* When there's no photo sibling, the text is the only item in the row
     and we center it for a classic single-column testimonial look. The
     :only-child selector keys off that condition without needing a prop. */
  &:only-child {
    text-align: center;
  }

  @media (max-width: 900px) {
    font-size: 1.05rem;
  }

  @media (max-width: 560px) {
    font-size: 1rem;
    text-align: center;
    /* 4-line clamp keeps the rotator height predictable on phones when a
       review lands near the 360-char upper bound of our filter. Uses the
       -webkit-box legacy display for the widest cross-browser support —
       line-clamp is now standard but -webkit-line-clamp is still the
       reliable implementation name. */
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Meta = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  color: #f5ebe0;
  opacity: 0.7;
  margin: 0;
  /* No margin — pinned to bottom of slot by motion.div's
     justify-content: space-between. */

  @media (max-width: 560px) {
    font-size: 0.78rem;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
`;

const Dot = styled.button<{ active: boolean }>`
  appearance: none;
  border: none;
  padding: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(p) =>
    p.active ? '#d6a85f' : 'rgba(245, 235, 224, 0.25)'};
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${(p) =>
      p.active ? '#d6a85f' : 'rgba(245, 235, 224, 0.5)'};
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 3px;
  }
`;

/**
 * Prev/next arrow buttons flanking the review text. Positioned absolutely
 * within the SectionContainer so they sit in the horizontal empty space
 * between the 1080px content block and the viewport edges at wide widths.
 * Small circular outline buttons with a gold accent — visible but not
 * dominant (the text is still the star of the show).
 *
 * Hidden on narrow viewports (≤560px): at those widths there's no empty
 * space either side of the text, so the arrows would overlap content.
 * Dots + swipe covers navigation there.
 */
const ArrowButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(p) => (p.direction === 'prev' ? 'left: 3vw;' : 'right: 3vw;')}
  appearance: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(214, 168, 95, 0.35);
  background-color: transparent;
  color: #d6a85f;
  font-family: 'Domine Variable', Domine, serif;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Slight downward nudge on the glyph — the angle-bracket characters
     sit high in their em-box by default, and this lands them optically
     centered in the circle. */
  padding-bottom: 3px;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: rgba(214, 168, 95, 0.12);
    border-color: #d6a85f;
    color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 3px;
  }

  /* At widths where the 1080px text block starts crowding the viewport
     edges, tighten the arrow offset so they don't overlap the content. */
  @media (max-width: 1200px) {
    ${(p) => (p.direction === 'prev' ? 'left: 16px;' : 'right: 16px;')}
  }

  @media (max-width: 560px) {
    display: none;
  }
`;

const SeeAllLink = styled(Link)`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d6a85f;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover,
  &:focus-visible {
    color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 3px;
  }
`;

const ReviewsRotator = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Auto-rotate: every 15s advance to next review. Include currentIndex
     in the dep array so manual dot-clicks reset the 15s timer — user
     gets the full interval before the next auto-advance, never a
     near-immediate jump because we were already 14s into the previous
     interval. isPaused guards the rotation on hover. */
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % HOMEPAGE_REVIEWS.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  /* Bail-out guard: if the reviews filter ever produces zero results
     (e.g. data file updated with different fields), we'd rather render
     nothing than a broken rotator. Extremely unlikely given 63 featured
     reviews currently available, but cheap to defend. */
  if (HOMEPAGE_REVIEWS.length === 0) return null;

  const current = HOMEPAGE_REVIEWS[currentIndex];
  const goPrev = () =>
    setCurrentIndex(
      (i) => (i - 1 + HOMEPAGE_REVIEWS.length) % HOMEPAGE_REVIEWS.length,
    );
  const goNext = () => setCurrentIndex((i) => (i + 1) % HOMEPAGE_REVIEWS.length);

  return (
    <SectionContainer
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Customer reviews"
    >
      <ArrowButton
        direction="prev"
        onClick={goPrev}
        aria-label="Previous review"
      >
        ‹
      </ArrowButton>
      <ArrowButton
        direction="next"
        onClick={goNext}
        aria-label="Next review"
      >
        ›
      </ArrowButton>
      <Inner>
        {/* Fixed-height slot keeps the dots + "See all reviews" link
            anchored in a stable position no matter how tall the active
            review is. Content inside the motion.div is vertically
            centered so short reviews don't bunch against the top. */}
        <ReviewSlot>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                /* space-between pins Stars to the top edge of the slot
                   and Meta to the bottom edge, so those two elements
                   land at identical y-positions for every review —
                   regardless of whether the middle row is [photo+text]
                   or just [text], and regardless of text length. */
                justifyContent: 'space-between',
              }}
            >
              <Stars aria-label={`${current.stars} out of 5 stars`}>
                {'★'.repeat(current.stars)}
              </Stars>
              {/* Middle row: photo beside text when hasPhoto, otherwise
                  the text is the only child and centers itself via its
                  :only-child styling. */}
              <ReviewContentRow>
                {current.hasPhoto && (
                  <PhotoFrame>
                    <Photo
                      src={`${S3_REVIEWS_URL}/review${current.id}.jpg`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </PhotoFrame>
                )}
                <ReviewTextBlock>
                  &ldquo;{current.text}&rdquo;
                </ReviewTextBlock>
              </ReviewContentRow>
              <Meta>
                — {current.name} · {formatDate(current.date)} · {current.product}
              </Meta>
            </motion.div>
          </AnimatePresence>
        </ReviewSlot>

        <Dots role="tablist" aria-label="Review navigation">
          {HOMEPAGE_REVIEWS.map((r, i) => (
            <Dot
              key={r.id}
              active={i === currentIndex}
              onClick={() => setCurrentIndex(i)}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Show review ${i + 1} of ${HOMEPAGE_REVIEWS.length}`}
            />
          ))}
        </Dots>

        <SeeAllLink to="/reviews">See all reviews →</SeeAllLink>
      </Inner>
    </SectionContainer>
  );
};

export default ReviewsRotator;
