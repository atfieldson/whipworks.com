import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

import type { GalleryCard } from '../../pages/gallery';

/**
 * GalleryLightbox
 *
 * In-page lightbox for the /gallery page. When a user clicks any whip
 * card, this opens with all photos of that physical whip + spec info +
 * a "View the X" / "Build this X" CTA that takes them to the relevant
 * destination (specialty whip page, or design page for custom builds —
 * the click-to-prefill wiring is Phase 13.7).
 *
 * Layout (Adam's spec, Q2):
 *   - Desktop (≥900px): photo on left (hero + horizontal thumb strip
 *     below), info panel on right. Click thumbs or use ← / → arrow
 *     keys to swap the hero photo.
 *   - Mobile (<560px): vertical stack of all photos at full width
 *     (magazine-feel scroll), info panel below the photos.
 *   - Tablet (560–900px): single column with hero + thumb strip on
 *     top, info panel below.
 *
 * Info panel content (Q3):
 *   - Eyebrow (Specialty · Variant / Bullwhip / etc.) + title
 *   - Full spec grid (length first, then design specs)
 *   - Description: specialty whips only, pulled from frontmatter
 *     `description`. Custom whips don't have one — spec grid alone.
 *   - CTA button: solid gold, full-width within info panel
 *
 * CTA copy (Q4):
 *   - Specialty: "View the {short name} →" (drops "The " prefix and
 *     " Bullwhip" suffix from the marketing title — "The Indy Bullwhip"
 *     becomes "Indy", so the button reads "View the Indy →")
 *   - Custom bullwhip / fantasy: "Build this Bullwhip →"
 *   - Custom stockwhip: "Build this Stockwhip →"
 *   - Custom snakewhip: "Build this Snakewhip →"
 *
 * Dismiss UX (Q5): Esc + click backdrop + × button (all three).
 *
 * No price shown anywhere in the lightbox (Q3) — gallery's job is to
 * inspire and route, the listing pages handle the sales pitch.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal on the modal
 *   - aria-labelledby points at the title element
 *   - Body scroll locked while open (avoids dual-scroll on long modals)
 *   - Focus trap is NOT implemented (deferred — would need a
 *     focus-trap library or custom logic; not blocking for v1)
 *   - Reduced-motion users get the modal without slide/fade transitions
 *     (framer-motion's prefers-reduced-motion handling)
 */

// ─── CTA helpers ────────────────────────────────────────────────────────

const getCTACopy = (card: GalleryCard): string => {
  if (card.type === 'specialty') {
    /* Compose a clean short name from the marketing title.
       "The Indy Bullwhip" → "Indy"
       "The Belmont"      → "Belmont"
       "The Z Whip"       → "Z Whip"
       "The Nightlord"    → "Nightlord"
       "The Ultra Whip"   → "Ultra Whip" (no Bullwhip suffix to strip)
    */
    const shortName = card.title
      .replace(/^The /, '')
      .replace(/ Bullwhip$/, '');
    return `View the ${shortName} →`;
  }
  if (card.type === 'stockwhip') return 'Build this Stockwhip →';
  if (card.type === 'snakewhip') return 'Build this Snakewhip →';
  // bullwhip + fantasy both route to the bullwhip designer
  return 'Build this Bullwhip →';
};

const getCTAHref = (card: GalleryCard): string => {
  if (card.href) return card.href;
  if (card.type === 'stockwhip') return '/design-stockwhip';
  if (card.type === 'snakewhip') return '/design-snakewhip';
  return '/design-bullwhip';
};

// ─── Styled components ──────────────────────────────────────────────────

/* z-index 9999 to land above anything the Layout's Header might set
   (the Header is fixed-position with its own stacking context — we want
   to sit unconditionally on top of all page chrome). */
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  /* On phones, close-to-edge padding so the modal can use as much of
     the viewport as possible. */
  @media (max-width: 560px) {
    padding: 8px;
  }
`;

const Modal = styled(motion.div)`
  position: relative;
  background-color: #1a140f;
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  overflow-y: auto;
  border: 1px solid rgba(214, 168, 95, 0.18);
  display: flex;
  flex-direction: row;

  /* Stack vertically once there isn't room for a 2-col layout. */
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  appearance: none;
  border: 1px solid rgba(214, 168, 95, 0.35);
  background-color: rgba(15, 11, 8, 0.7);
  color: #d6a85f;
  font-family: 'Domine Variable', Domine, serif;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Slight downward nudge — the × glyph sits high in its em-box, this
     drops it to optical center within the circle. */
  padding-bottom: 2px;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
  z-index: 10;

  &:hover,
  &:focus-visible {
    background-color: rgba(214, 168, 95, 0.15);
    border-color: #d6a85f;
    color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }
`;

// ─── Photo area (desktop variant) ───────────────────────────────────────

const PhotoArea = styled.div`
  flex: 0 0 60%;
  background-color: #0f0b08;
  display: flex;
  flex-direction: column;
  padding: 24px;
  /* Bottom of the photo area gets a hairline separator on desktop. On
     mobile the layout flips to column so this border becomes the bottom
     edge between photos and info — useful as a visual break either way. */
  border-right: 1px solid rgba(214, 168, 95, 0.1);

  @media (max-width: 900px) {
    flex: 0 0 auto;
    border-right: 0;
    border-bottom: 1px solid rgba(214, 168, 95, 0.1);
  }

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

/** Container for the hero photo on desktop/tablet — uses a FIXED 4:3
    aspect ratio with a max-height safety cap so the modal doesn't
    jump in size when the user clicks between a wide photo and a tall
    photo. The photo inside is `object-fit: contain`, so the frame
    stays a constant size and tall photos letterbox horizontally,
    wide photos letterbox vertically. Predictable, not jarring. */
const HeroFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0805;
  width: 100%;
  aspect-ratio: 4 / 3;
  /* Safety cap for very tall narrow viewports — at large widths the
     calculated 4:3 height could exceed 60vh, in which case the cap
     takes over and the frame becomes wider-than-4:3 (height stays
     at 60vh). Photo inside still letterboxes correctly either way. */
  max-height: 60vh;
  overflow: hidden;

  @media (max-width: 560px) {
    /* Mobile uses the vertical photo stack, not the hero frame —
       hide the desktop hero entirely there. */
    display: none;
  }
`;

const HeroPhoto = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const ThumbStrip = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  overflow-x: auto;
  /* Subtle scrollbar styling — visible enough to signal scrollability
     when there are many thumbs, restrained enough not to draw the eye. */
  scrollbar-width: thin;
  scrollbar-color: rgba(214, 168, 95, 0.3) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(214, 168, 95, 0.3);
    border-radius: 3px;
  }

  @media (max-width: 560px) {
    /* Hidden on mobile — vertical photo stack replaces hero+thumb. */
    display: none;
  }
`;

const Thumb = styled.button<{ active: boolean }>`
  flex: 0 0 110px;
  width: 110px;
  height: 110px;
  appearance: none;
  padding: 0;
  background-color: #0f0b08;
  border: 2px solid ${(p) => (p.active ? '#d6a85f' : 'transparent')};
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  opacity: ${(p) => (p.active ? 1 : 0.7)};

  &:hover,
  &:focus-visible {
    border-color: ${(p) =>
      p.active ? '#d6a85f' : 'rgba(214, 168, 95, 0.5)'};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/** Mobile-only vertical photo stack. Hidden on desktop/tablet, replaces
    the hero+thumb pattern on phones. Each photo renders at full width
    with native aspect ratio so they pack vertically and the user scrolls. */
const MobilePhotoStack = styled.div`
  display: none;

  @media (max-width: 560px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const MobilePhoto = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

// ─── Info panel ─────────────────────────────────────────────────────────

const InfoPanel = styled.div`
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  padding: 32px 28px;
  color: #f5ebe0;

  @media (max-width: 900px) {
    flex: 0 0 auto;
    padding: 28px 24px;
  }

  @media (max-width: 560px) {
    padding: 22px 18px 28px;
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

const Title = styled.h2`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 1.85rem;
  line-height: 1.2;
  letter-spacing: 0.005em;
  color: #f5ebe0;
  margin: 0 0 20px;

  @media (max-width: 560px) {
    font-size: 1.55rem;
    margin-bottom: 16px;
  }
`;

const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  margin: 0 0 26px;
  padding: 18px 0;
  border-top: 1px solid rgba(214, 168, 95, 0.15);
  border-bottom: 1px solid rgba(214, 168, 95, 0.15);
`;

const SpecLabel = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(245, 235, 224, 0.55);
  display: block;
  margin-bottom: 3px;
`;

const SpecValue = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f5ebe0;
  display: block;
  line-height: 1.3;
`;

const Description = styled.p`
  font-family: 'Domine Variable', Domine, serif;
  font-style: italic;
  font-size: 1rem;
  line-height: 1.6;
  color: #f5ebe0;
  opacity: 0.88;
  margin: 0 0 28px;

  @media (max-width: 560px) {
    font-size: 0.95rem;
  }
`;

/** Solid-gold primary CTA — same visual weight as the homepage's
    ContactCTA "Contact Adam" button. This is the strongest CTA in the
    lightbox; the user clicked an image and we're now asking them to
    take the next step. */
const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  padding: 15px 28px;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: #1a140f;
  background-color: #d6a85f;
  border: 1px solid #d6a85f;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: #e8b970;
    border-color: #e8b970;
    color: #1a140f;
  }

  &:focus-visible {
    outline: 2px solid #f5ebe0;
    outline-offset: 3px;
  }
`;

// ─── Component ──────────────────────────────────────────────────────────

type Props = {
  /** The selected card to display, or `null` to keep the lightbox closed. */
  card: GalleryCard | null;
  /** Called when the user dismisses the lightbox (Esc, backdrop, ×). */
  onClose: () => void;
};

const GalleryLightbox = ({ card, onClose }: Props) => {
  /* Index of the photo currently shown as the hero on desktop/tablet.
     Reset to 0 whenever a new card is opened so each opening starts
     from the lead Wide shot regardless of where the user left off in
     the previous opening. */
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (card) setActiveIndex(0);
  }, [card?.id]);

  /* Keyboard handlers: Esc closes, ← / → navigate photos. Window-level
     listener so arrow keys work regardless of which element inside the
     modal currently has focus. */
  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft' && card.allPhotos.length > 1) {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + card.allPhotos.length) % card.allPhotos.length,
        );
      } else if (e.key === 'ArrowRight' && card.allPhotos.length > 1) {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % card.allPhotos.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, onClose]);

  /* Body scroll lock — prevents background scrolling when the modal
     is open. Save and restore the previous overflow value so we don't
     fight any other code that might be setting it. */
  useEffect(() => {
    if (!card) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [card]);

  return (
    <AnimatePresence>
      {card && card.allPhotos.length > 0 && (
        <Backdrop
          key="gallery-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          aria-hidden={false}
        >
          <Modal
            key="gallery-lightbox-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-lightbox-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            /* Stop propagation so clicks inside the modal don't reach
               the backdrop's onClose handler. */
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              type="button"
              onClick={onClose}
              aria-label="Close gallery view"
            >
              ×
            </CloseButton>

            <PhotoArea>
              {/* Desktop / tablet: hero + horizontal thumb strip */}
              <HeroFrame>
                <HeroPhoto
                  src={card.allPhotos[activeIndex].url}
                  alt={card.allPhotos[activeIndex].caption || card.alt}
                  /* Eager-load the hero so it's ready when the modal
                     animates in — no awkward placeholder flash. */
                />
              </HeroFrame>
              {card.allPhotos.length > 1 && (
                <ThumbStrip role="tablist" aria-label="Photo navigation">
                  {card.allPhotos.map((p, i) => (
                    <Thumb
                      key={p.url}
                      type="button"
                      active={i === activeIndex}
                      onClick={() => setActiveIndex(i)}
                      role="tab"
                      aria-selected={i === activeIndex}
                      aria-label={
                        p.caption || `Photo ${i + 1} of ${card.allPhotos.length}`
                      }
                    >
                      <ThumbImg src={p.url} alt="" loading="lazy" />
                    </Thumb>
                  ))}
                </ThumbStrip>
              )}

              {/* Mobile (<560px): vertical stack of all photos */}
              <MobilePhotoStack>
                {card.allPhotos.map((p) => (
                  <MobilePhoto
                    key={p.url}
                    src={p.url}
                    alt={p.caption || card.alt}
                    loading="lazy"
                  />
                ))}
              </MobilePhotoStack>
            </PhotoArea>

            <InfoPanel>
              <Eyebrow>{card.eyebrow}</Eyebrow>
              <Title id="gallery-lightbox-title">{card.title}</Title>
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
              {card.description && (
                <Description>{card.description}</Description>
              )}
              <CTAButton to={getCTAHref(card)}>{getCTACopy(card)}</CTAButton>
            </InfoPanel>
          </Modal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
