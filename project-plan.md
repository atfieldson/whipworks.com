# WhipWorks.com - Project Plan

## Phase 1: Foundation & Housekeeping
- [ ] Rename `master` branch to `main`
  - [ ] Rename local branch
  - [ ] Update remote default branch on GitHub
  - [ ] Update any references in code (deploy scripts, README, etc.)
- [ ] Audit for bugs/errors
  - [ ] Check for missing dependencies (axios is used but may not be in package.json)
  - [ ] Check for broken imports or dead code
  - [ ] Check Snipcart integration for cart/checkout issues
  - [ ] Check for broken links or missing assets
  - [ ] Check for accessibility issues
- [ ] Create a separate checklist of discovered issues
- [ ] Work through issues checklist one-by-one, with user review and approval for each fix

## Phase 2: Navigation & Modernization
- [ ] Redesign header/navigation for better mobile UX
  - [ ] Audit current header/menu drawer behavior on mobile
  - [ ] Design improved navigation structure
  - [ ] Implement new header component
- [ ] Improve menu structure to accommodate new sections (Materials, Floggers)
  - [ ] Add "Whipmaking Materials" nav item
  - [ ] Add "Floggers" / "Design a Flogger" nav item
  - [ ] Reorganize menu hierarchy
- [ ] Ensure responsive design across all breakpoints
- [ ] Improve readability and visual hierarchy

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
