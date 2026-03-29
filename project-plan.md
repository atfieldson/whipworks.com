# WhipWorks.com - Project Plan

## Phase 1: Foundation & Housekeeping ✅
- [ ] Rename `master` branch to `main` *(skipped — impacts AWS auto-deploy, revisit later)*
- [x] Audit for bugs/errors
  - [x] Check for missing dependencies (axios, lodash)
  - [x] Check for broken imports or dead code
  - [x] Check Snipcart integration for cart/checkout issues
  - [x] Check for broken links or missing assets
  - [x] Check for accessibility issues
- [x] Create a separate checklist of discovered issues (issues-checklist.md)
- [x] Work through issues checklist one-by-one, with user review and approval for each fix
  - [x] Issues 1-3: Critical bugs (poppers price, missing deps, stockwhip title)
  - [x] Issues 4-8: SEO & accessibility (OG tags, alt text, aria labels)
  - [x] Issues 9-11: Medium fixes (weight comment, contact form, Snipcart format)
  - [x] Issues 12-13: Low priority (framer-motion kept, API key won't fix)

## Phase 2: Navigation & Modernization ✅
- [x] Redesign header/navigation for better mobile UX
  - [x] Audit current header/menu drawer behavior on mobile
  - [x] Design improved navigation structure
  - [x] Implement new header component
- [x] Improve menu structure to accommodate new sections (Materials, Floggers)
  - [ ] Add "Whipmaking Materials" nav item *(deferred to Phase 4)*
  - [ ] Add "Floggers" / "Design a Flogger" nav item *(deferred to Phase 5)*
  - [x] Reorganize menu hierarchy (Custom Whips ▼, Specialty Whips ▼, Accessories, Contact)
- [x] Ensure responsive design across all breakpoints
  - [x] Custom breakpoint at 825px for desktop/mobile nav switch
  - [x] Desktop: dropdowns + flat links, Mobile: hamburger drawer
- [x] Improve readability and visual hierarchy
  - [x] Semi-transparent header background over hero images
  - [x] Gradient shadow under header
  - [x] Hero carousel no longer hidden behind header
  - [x] Hover states on dropdown triggers and menu items
- [x] Create Specialty Whips landing page (`/specialty-whips`)
  - [x] Display all specialty whips with cards, images, descriptions, and prices
  - [x] Link "Specialty Whips" nav header to this page (desktop + mobile)
  - [x] Add structured data for the page
  - [x] Make SpecialtyWhipCard responsive (stacks on mobile)

## Phase 3: Improve Design-a-Bullwhip Page
- [ ] Add Heel Loop option (yes/no toggle)
  - [ ] Add heelLoop state to BullwhipDesigner
  - [ ] Add Heel Loop toggle UI in Extras accordion section
  - [ ] Add Heel Loop to customization summary labels
  - [ ] Add Heel Loop to PriceBreakdown (need price from Adam)
  - [ ] Add Snipcart data-item-custom field for Heel Loop
- [ ] Refactor BullwhipDesigner to be more modular/data-driven
  - [ ] Make extras section data-driven so new options are easy to add
  - [ ] Reduce duplication between Bullwhip and Stockwhip designers
- [ ] Verify Three.js 3D preview still works after all changes
- [ ] Test full Snipcart add-to-cart flow after changes

## Phase 4: Whipmaking Materials Section
- [ ] Create materials listing page (/materials or /whipmaking-materials)
- [ ] Add paracord products
  - [ ] Product cards with color swatches, lengths, pricing
  - [ ] Snipcart integration for each product
- [ ] Add whipmaker's tools (fid, etc.)
- [ ] Add instructional PDF products
  - [ ] Set up Snipcart for digital product delivery
  - [ ] Create product cards linking PDFs to YouTube video previews
  - [ ] Embed or link to YouTube playlist for promotion

## Phase 5: Flogger & Snakewhip Sections

### 5A: Flogger
- [ ] Create flogger product pages
- [ ] Build "Design Your Own Flogger" customizer (/design-flogger)
  - [ ] Primary color selection (reuse existing color picker)
  - [ ] Secondary color selection (reuse existing color picker)
  - [ ] Handle type selection — Plaited, Unplaited, or No Handle
  - [ ] Handle pattern selection *(only shown if Plaited selected)*
  - [ ] No Handle reduces base price *(awaiting pricing from Adam)*
  - [ ] Concho selection (reuse existing ConchoPicker)
  - [ ] Heel loop yes/no
  - [ ] Lashing type — Heavy or Light
  - [ ] Number of lashings *(Light: 24/36/48/60, Heavy: locked at 9)*
  - [ ] Lashing length — 16", 18", 20", 22", 24" *(same for both types)*
  - [ ] Price breakdown component *(awaiting pricing from Adam)*
  - [ ] Snipcart integration with all custom fields
- [ ] Add flogger to "Custom Whips" nav dropdown
- [ ] Add flogger nav thumbnail image

### 5B: Snakewhip
- [ ] Build "Design a Snakewhip" page (/design-snakewhip)
  - [ ] Primary color selection (reuse existing color picker)
  - [ ] Secondary color selection (reuse existing color picker)
  - [ ] Handle design selection (reuse existing HandleDesignPicker)
  - [ ] Concho selection (reuse existing ConchoPicker)
  - [ ] Heel loop yes/no (reuse from Phase 3)
  - [ ] Waxing yes/no (reuse existing)
  - [ ] Length selection (3', 3'6", 4', 4'6", 5', 6', 7', 8', 10', 12')
  - [ ] Price breakdown component
  - [ ] Snipcart integration with all custom fields
- [ ] Add snakewhip to "Custom Whips" nav dropdown
- [ ] Add snakewhip nav thumbnail image
- [ ] Update Contact page internal links to include flogger, snakewhip, and materials pages

## Phase 6: SEO & Performance
- [x] Set up Google Analytics (GA4) — Measurement ID: G-W5F0T5B7KR
- [x] Set up Google Search Console — verified via GA4
- [x] Add structured data (JSON-LD) for products
- [x] Improve meta descriptions and page titles across all pages
- [x] Add/generate sitemap (gatsby-plugin-sitemap)
- [x] Add alt text to all images *(completed in Phase 1)*
- [x] Optimize image loading and Core Web Vitals (lazy loading on below-the-fold images)
- [x] Review and improve internal linking
  - [x] Homepage: added Design a Stockwhip button
  - [x] Contact page: links to custom Bullwhip options and accessories
  - [x] Accessories page: links to Bullwhip and Stockwhip designers
  - [x] Specialty whip pages: "Design your own" call-to-action

## Phase 7: Quality Assurance
- [ ] End-to-end testing of all purchase flows
- [ ] Mobile testing across devices
- [ ] Cart abandonment prevention (error states, validation)
- [ ] Cross-browser testing

## Phase 8: Ready to Ship Whips
- [ ] Create data system for listings
  - [ ] Design JSON/YAML data file structure for ready-to-ship products
  - [ ] Fields vary by product type (bullwhip, stockwhip, snakewhip, flogger)
  - [ ] Support 4-7 images per listing with consistent S3 naming (`ready-to-ship/[type]-[name]-[1-7].jpg`)
  - [ ] Include sold/available status per listing
- [ ] Build main listing page (`/ready-to-ship`)
  - [ ] Display all listings sorted by whip type
  - [ ] Product cards with thumbnail, name, type, price
  - [ ] Click-through to individual listing detail pages
- [ ] Build individual listing detail pages
  - [ ] Full-size photo gallery (4-7 images)
  - [ ] Product details and description
  - [ ] Snipcart "Add to Cart" with `max-quantity="1"`
- [ ] Build per-type listing pages
  - [ ] `/ready-to-ship/bullwhips`
  - [ ] `/ready-to-ship/stockwhips`
  - [ ] `/ready-to-ship/snakewhips`
  - [ ] `/ready-to-ship/floggers`
- [ ] Set up Snipcart inventory management
  - [ ] Configure inventory tracking in Snipcart dashboard (stock = 1 per item)
  - [ ] "Sold" state displays on listing when stock hits 0 (social proof)
  - [ ] Test purchase flow to confirm inventory decrements correctly
- [ ] Build streamlined listing creation workflow
  - [ ] Create Claude prompt template tailored per product type
  - [ ] Prompts ask type-specific questions (length, handle length, colors, etc.)
  - [ ] Output: ready-to-commit data file entry + S3 upload path instructions
- [ ] Add "Ready to Ship" to site navigation
- [ ] *(Stretch goal)* Filter/sort by type, price, length
