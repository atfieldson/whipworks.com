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

## Phase 5: Flogger Section
- [ ] Create flogger product pages
- [ ] Build "Design Your Own Flogger" customizer
  - [ ] Color selection (reuse existing color picker)
  - [ ] Handle pattern selection
  - [ ] Handle plaited vs unplaited toggle
  - [ ] Concho selection (reuse existing ConchoPicker)
  - [ ] Heel loop yes/no
  - [ ] Length of lashings selection
  - [ ] Number of lashings (9, 18, or 27)
  - [ ] Price breakdown component
  - [ ] Snipcart integration with all custom fields
- [ ] Add flogger to site navigation

## Phase 6: SEO & Performance
- [ ] Set up Google Analytics (GA4)
- [ ] Set up Google Search Console
- [ ] Add structured data (JSON-LD) for products
- [ ] Improve meta descriptions and page titles across all pages
- [ ] Add/generate sitemap
- [ ] Add alt text to all images
- [ ] Optimize image loading and Core Web Vitals
- [ ] Review and improve internal linking

## Phase 7: Quality Assurance
- [ ] End-to-end testing of all purchase flows
- [ ] Mobile testing across devices
- [ ] Cart abandonment prevention (error states, validation)
- [ ] Cross-browser testing
