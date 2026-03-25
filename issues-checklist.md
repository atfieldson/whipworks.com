# WhipWorks.com - Issues Checklist (from Phase 1 Audit)

## CRITICAL - Will cause incorrect behavior for customers

- [x] **Issue 1: Price mismatch on Extra Poppers modal**
  - File: `src/components/molecules/AddPoppersModal.tsx` (line 39)
  - Button says `data-item-price="20"` but the product markdown says `price: 25`
  - Impact: Customers are being charged the wrong amount

- [x] **Issue 2: Missing dependencies — axios and lodash**
  - `axios` is imported in `src/components/organisms/ContactForm.tsx` (line 15) but not in package.json
  - `lodash` is imported in `useDocumentScroll.tsx` (line 2) but not in package.json
  - Impact: Build could fail if these aren't incidentally installed by another package

- [x] **Issue 3: Wrong page title on Design a Stockwhip**
  - File: `src/pages/design-stockwhip.tsx` (line 8)
  - Currently says `<SEO title="Design a Bullwhip" />` — should say "Design a Stockwhip"
  - Impact: Wrong title in browser tab and search results

## HIGH - SEO and accessibility problems

- [x] **Issue 4: Open Graph meta tags use wrong attribute**
  - File: `src/components/templates/SEO.tsx` (lines 32-34)
  - Uses `name="og:title"` instead of `property="og:title"` (same for og:description, og:type)
  - Impact: Social media previews (Facebook, LinkedIn, etc.) won't show correct info when links are shared

- [x] **Issue 5: Missing og:image and twitter:image meta tags**
  - File: `src/components/templates/SEO.tsx`
  - No image meta tags for social sharing previews
  - Impact: Shared links show no preview image

- [x] **Issue 6: Incorrect alt text on Hero Carousel image**
  - File: `src/components/organisms/HeroCarousel.tsx` (line 95)
  - Alt text says "Japan" but image shows whipmaking tools
  - Impact: Screen readers give wrong description; SEO mismatch

- [x] **Issue 7: Missing alt text across multiple components**
  - `src/components/atoms/FullWidthImage.tsx` (line 28) — no alt attribute
  - `src/components/organisms/InstagramFeed.tsx` (lines 32-37) — 6 images, no alt text
  - `src/components/molecules/ProductImages.tsx` (lines 14-21) — main product image
  - `src/components/atoms/SpecialtyWhipCard.tsx` (lines 38-43) — header image
  - `src/pages/index.tsx` (lines 55-60, 74-78, 97-102, 125-130) — multiple images
  - `src/components/templates/SpecialtyWhipPage.tsx` (line 131) — whip header image
  - Impact: Poor accessibility for screen readers; hurts SEO

- [x] **Issue 8: ImageButton missing aria-label**
  - File: `src/components/atoms/ImageButton.tsx` (lines 18-30)
  - Has onClick but no aria-label — affects all color pickers, concho pickers, etc.
  - Impact: Screen readers can't describe what each button does

## MEDIUM - Inconsistencies and minor bugs

- [x] **Issue 9: Hardcoded weight on SpecialtyWhipPage**
  - File: `src/components/templates/SpecialtyWhipPage.tsx` (line 182)
  - `data-item-weight` is hardcoded to 900, dynamic weight is commented out
  - Impact: Shipping weight is always 900g regardless of whip length

- [x] **Issue 10: Contact form — console.log left in and weak email validation**
  - File: `src/components/organisms/ContactForm.tsx`
  - Line 44: `console.log(e)` in error handler (should be removed)
  - Lines 60-64: Email field only checks `required`, no format validation
  - Impact: Customers can submit invalid emails; error details leak to console

- [x] **Issue 11: Snipcart color/handle options missing [+price] format**
  - Files: `BullwhipDesigner.tsx` (line 176, 182), `StockwhipDesigner.tsx` (line 177, 183)
  - `colorOptions` and `handleDesignOptions` are just pipe-delimited names without `[+0]` price markers
  - Also `AddPoppersModal.tsx` (line 45): `"Blue|Orange|Yellow"` missing format
  - Impact: Snipcart still works but format is inconsistent; could cause issues with price validation

## LOW - Cleanup opportunities

- [ ] **Issue 12: Unused dependency — framer-motion**
  - Listed in package.json but not imported anywhere
  - Impact: Adds to install size unnecessarily

- [ ] **Issue 13: Snipcart API key hardcoded in gatsby-config.ts**
  - File: `gatsby-config.ts` (line 21)
  - Should use an environment variable instead
  - Impact: Key is exposed in version control (note: Snipcart public keys are meant to be public, so this is low severity)
