import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

import type { GalleryCard } from '../../pages/gallery';

/* Magnifier-lens parameters matched to the Paracord listing's hover-zoom
   behavior (src/components/templates/ParacordPage.tsx). LENS_SIZE is the
   square cursor-following lens overlaid on the hero photo. The zoom
   preview's background-size scales by (frameWidth / LENS_SIZE) — so a
   720px frame with a 150px lens gives 480% (~5x) magnification, same
   ratio as Paracord, when the hires source is loaded. */
const LENS_SIZE = 150;

/* Reduced-magnification fallback for whips that don't have a hires
   version uploaded yet. 3x is sharp enough on typical ~1200px source
   images (1.2x upscale at most) — useful zoom without obvious blur. As
   Adam uploads hires versions to /gallery/<type>/hires/, those whips
   automatically promote to the full ~5x zoom. */
const FALLBACK_ZOOM_PERCENT = 300;

/**
 * Insert `/hires/` before the filename in a gallery photo URL.
 * `gallery/specialty/BW592...Wide.jpg` → `gallery/specialty/hires/BW592...Wide.jpg`
 *
 * Convention: high-resolution versions of every gallery photo live in
 * a `hires/` subdirectory next to the regular image, with the same
 * filename. The lightbox tries the hires URL first; if it 404s, the
 * onError handler on the hero <img> swaps in the regular URL and the
 * zoom magnification drops to FALLBACK_ZOOM_PERCENT for that photo.
 *
 * Match is anchored on the final filename segment to avoid double-
 * inserting `hires` if a URL is already pointed at the hires version.
 */
const toHiresUrl = (url: string): string =>
  url.replace(/\/([^/]+\.(?:jpg|jpeg|png|gif|webp))$/i, '/hires/$1');

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
    wide photos letterbox vertically. Predictable, not jarring.
    `position: relative` so the cursor-following Lens (absolute child)
    positions correctly. `cursor: crosshair` on hover-capable devices
    signals that the photo is interactive (zoom on hover). */
const HeroFrame = styled.div`
  position: relative;
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

  @media (hover: hover) and (min-width: 901px) {
    cursor: crosshair;
  }

  @media (max-width: 560px) {
    /* Mobile uses the vertical photo stack, not the hero frame —
       hide the desktop hero entirely there. */
    display: none;
  }
`;

/**
 * Cursor-following lens overlay shown on hover over the hero photo.
 * Square indicator with a thin gold border + faint gold tint, matches
 * the visual language of the rest of the site (Paracord uses a blue
 * tint — that's their accent color; ours is gold #d6a85f). The lens
 * shows the user which area of the photo is being magnified in the
 * zoom preview panel.
 *
 * `pointer-events: none` so the lens doesn't intercept the mouse
 * events that the parent HeroFrame is listening for.
 */
const Lens = styled.div`
  position: absolute;
  width: ${LENS_SIZE}px;
  height: ${LENS_SIZE}px;
  border: 2px solid rgba(214, 168, 95, 0.85);
  background-color: rgba(214, 168, 95, 0.15);
  pointer-events: none;
  /* Smooth out the lens motion just slightly — without this it can
     look twitchy on slower mouse movements. Quick enough to feel
     responsive, slow enough to look polished. */
  transition: top 0.05s linear, left 0.05s linear;
`;

/**
 * Zoom preview panel — overlays the InfoPanel area when the user
 * hovers the hero photo. Uses background-image of the source photo
 * scaled to (frameWidth / LENS_SIZE) × 100% so a 150px lens area maps
 * to the full preview area at ~5x magnification (matches Paracord's
 * behavior).
 *
 * Hidden on tablet (<900px, where the modal is single-column and the
 * InfoPanel is below the photo, not beside it) and on hover-less
 * touch devices (where there's no cursor to drive the lens).
 */
const ZoomPreview = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: #0a0805;
  background-repeat: no-repeat;
  border: 1px solid rgba(214, 168, 95, 0.18);
  pointer-events: none;

  @media (max-width: 900px), (hover: none) {
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
  position: relative;
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

  /* Magnifier-lens hover-zoom state — same pattern as ParacordPage.
     `isZooming` toggles the lens + zoom preview visibility on enter/
     leave; `lensPos` is the lens's pixel position within the
     HeroFrame; `zoomBgStyle` is the computed background-size and
     background-position for the zoom preview overlay. */
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomBgStyle, setZoomBgStyle] = useState({
    size: '500%',
    posX: '0%',
    posY: '0%',
  });

  /* Set of regular photo URLs whose `/hires/` variant 404'd. Caches
     failures across photo navigation within a single mount of the
     lightbox so we don't re-attempt the hires URL on every thumbnail
     click for a photo we already know doesn't have one. Resets when
     the user closes and reopens the lightbox (new component mount).
     New whip photos NOT in this set will be optimistically tried. */
  const [knownNoHires, setKnownNoHires] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (card) {
      setActiveIndex(0);
      setIsZooming(false); // reset zoom state when opening a different card
    }
  }, [card?.id]);

  /* Pre-compute whether the active hero photo can use hires. If the
     regular URL is already in `knownNoHires`, we know the hires
     variant 404'd previously and we should skip the optimistic
     attempt. If `card` is null (lightbox closed), the default doesn't
     matter — guarded below. */
  const heroPhotoUrl = card?.allPhotos[activeIndex]?.url ?? '';
  const tryHires = !!card && !knownNoHires.has(heroPhotoUrl);
  const heroSrc = tryHires ? toHiresUrl(heroPhotoUrl) : heroPhotoUrl;

  /* Mouse-move handler ported from ParacordPage. Tracks cursor
     position within the HeroFrame, clamps the lens so it stays inside
     the frame edges, and computes a background-size + position pair
     for the zoom preview such that:
       - background-size scales the source image. When the hires
         version loaded successfully we use the natural Paracord ratio
         (frameWidth / LENS_SIZE) ≈ 4.8x where the lens area visually
         maps to the full zoom preview. When we're on the regular URL
         (hires 404'd or hasn't been uploaded yet), drop to
         FALLBACK_ZOOM_PERCENT (3x) so the regular ~1200px source
         doesn't get upscaled into mush.
       - background-position uses 0%–100% mapping based on the lens's
         travel within its allowed range, which CSS interprets as
         "align this % of the image with this % of the preview area"
     At reduced magnification the lens-content-equals-preview-content
     relationship loosens (preview shows more than just what's under
     the lens), but the lens still serves as a position indicator —
     better UX than disabling zoom entirely on non-hires whips. */
  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const halfLens = LENS_SIZE / 2;
      const lensX = Math.max(0, Math.min(x - halfLens, rect.width - LENS_SIZE));
      const lensY = Math.max(0, Math.min(y - halfLens, rect.height - LENS_SIZE));
      setLensPos({ x: lensX, y: lensY });

      const maxLensX = rect.width - LENS_SIZE;
      const maxLensY = rect.height - LENS_SIZE;
      const bgPosX = maxLensX > 0 ? (lensX / maxLensX) * 100 : 0;
      const bgPosY = maxLensY > 0 ? (lensY / maxLensY) * 100 : 0;

      const magPercent = tryHires
        ? (rect.width / LENS_SIZE) * 100
        : FALLBACK_ZOOM_PERCENT;
      setZoomBgStyle({
        size: `${magPercent}%`,
        posX: `${bgPosX}%`,
        posY: `${bgPosY}%`,
      });
    },
    [tryHires],
  );

  /* On a hires <img> 404, mark the regular URL as known-no-hires. The
     component re-renders with `tryHires === false`, the hero <img>
     swaps to the regular URL (browser cache makes that immediate),
     and the next zoom interaction uses FALLBACK_ZOOM_PERCENT. */
  const handleHeroError = useCallback(() => {
    if (tryHires && heroPhotoUrl) {
      setKnownNoHires((prev) => {
        if (prev.has(heroPhotoUrl)) return prev;
        const next = new Set(prev);
        next.add(heroPhotoUrl);
        return next;
      });
    }
  }, [tryHires, heroPhotoUrl]);

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
              <HeroFrame
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleHeroMouseMove}
              >
                <HeroPhoto
                  /* Optimistically tries the /hires/ variant first;
                     onError flips this to the regular URL on 404. */
                  src={heroSrc}
                  alt={card.allPhotos[activeIndex].caption || card.alt}
                  onError={handleHeroError}
                  /* `key` on src so React re-mounts the img when the
                     URL changes (otherwise an errored img wouldn't
                     re-attempt loading after we change knownNoHires). */
                  key={heroSrc}
                />
                {isZooming && (
                  <Lens
                    style={{ left: lensPos.x, top: lensPos.y }}
                    aria-hidden
                  />
                )}
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
              {/* Magnifier-zoom preview — overlays the info content
                  when the user is hovering the hero photo. Uses the
                  same heroSrc as the hero <img> so when the hires URL
                  is available the zoom is sharp at ~5x; when fallback
                  is in effect the regular URL is used at 3x (set by
                  handleHeroMouseMove). Hidden via CSS on tablet /
                  mobile and on hover-less devices. */}
              {isZooming && (
                <ZoomPreview
                  style={{
                    backgroundImage: `url(${heroSrc})`,
                    backgroundSize: zoomBgStyle.size,
                    backgroundPosition: `${zoomBgStyle.posX} ${zoomBgStyle.posY}`,
                  }}
                  aria-hidden
                />
              )}
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
