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
- [x] Sort specialty whips in nav dropdown by sortOrder

## Phase 3A: Improve Design-a-Bullwhip & Stockwhip Pages ✅
- [x] Add Heel Loop option (4 options with image picker)
  - [x] Create heelLoops constants with S3 image URLs and prices
  - [x] Create HeelLoopPicker component (image button grid)
  - [x] Add to Bullwhip Extras section
  - [x] Add to Stockwhip Extras section
  - [x] Add to customization summary labels
  - [x] Add to PriceBreakdown (both designers)
  - [x] Add Snipcart custom field for Heel Loop
  - [x] Options: No Heel Loop (+$0), Heel Loop (+$20), No Heel Loop Rounded (+$5), Heel Loop Rounded (+$25)
- [x] Add Collar picker to Bullwhip Extras section *(stockwhips don't have collars)*
- [x] Revamp Add Poppers modal
  - [x] Color selector (Blue, Red, Yellow) with radio buttons
  - [x] Popper image in modal
  - [x] Hidden Snipcart button for reliable add-to-cart
  - [x] Prevent Snipcart cart flash when modal opens
  - [x] Modal works on Bullwhip, Stockwhip, and Specialty Whip pages
- [x] Update popper color from Orange to Red
- [x] Prevent Extras accordion from auto-collapsing on selection
- [x] Fix ImageButton selection border (outline approach, muted blue #5A9BBD)
- [x] Update stockwhip thong lengths and pricing (3'-10', base $219)
- [x] Remove collar from stockwhip designer
- [x] Set up Snipcart test mode via environment variable
- [ ] Refactor BullwhipDesigner to be more modular/data-driven *(stretch goal)*
- [ ] Verify Three.js 3D preview still works after all changes

## Phase 3B: Design Page Overhaul (Benchmade-Inspired)
**Goal:** Redesign the Design-a-Bullwhip, Stockwhip, Flogger, and Snakewhip pages with a split-panel layout inspired by [Benchmade's custom knife builder](https://www.benchmade.com/collections/custom). Product visuals on the left, customization options on the right.

### Layout & Structure
- [x] Create new shared `DesignerLayout` component with two-panel split
  - [x] Left panel (scrollable): 3D preview + selected option thumbnails + product photography
  - [x] Right panel (sticky): customization options, summary, price breakdown, Add to Cart
  - [x] Responsive: stacks vertically on mobile (designer between 3D preview and gallery)
  - [x] Full-width layout breaks out of 1080px container to use full viewport width
- [x] ~~Full-width banner at top of page~~ *(explored, decided against — gets in the way of new layout)*

### Left Panel — Scrollable (Visuals)
- [x] 3D preview (existing Three.js WhipPreview) displayed prominently
- [x] Selected option thumbnails next to 3D preview
  - [x] Primary color spool image (80x80px, placeholder when unselected)
  - [x] Secondary color spool image (80x80px, placeholder when unselected)
  - [x] Handle design image (80x320px, rotated 90deg inside box, placeholder when unselected)
- [x] Gallery of finished whip images below the preview
  - [x] Show finished bullwhip examples in various color combos
  - [x] Close-up shots of handle designs, conchos, collars, heel loops
  - [x] Customer scrolls through inspiration as their selections stay visible on the right
  - [x] Hover overlay with whip specs in compact 2-column grid, responsive text sizing
  - [x] Concho break images with hover descriptions, sized by native dimensions (landscape/portrait)
  - [x] Gallery preview grid hidden below 1750px, remaining elements centered
  - [x] Gallery renders below designer on mobile

### Right Panel — Sticky (Options + Summary + Cart)
- [x] Chrome-style horizontal tab navigation (StepNav component)
  - [x] Tabs: Primary, Secondary, Handle, Waxing, Length, Handle Length, Concho, Extras
  - [x] Active tab highlighted in white with rounded top corners
  - [x] Completed steps shown in green
  - [x] Left/right arrow navigation between steps
  - [x] Light gray tab bar background
- [x] One option section visible at a time (replaces vertical accordion)
- [x] YOUR BULLWHIP summary with all selected options below tabs
- [x] Running price breakdown always visible
- [x] Add to Cart button always accessible
- [x] Panel uses `position: sticky` with `top` offset (desktop only)
- [x] Panel fits viewport height with scrollable step content (no outer scrollbar)
- [x] Compact YOUR BULLWHIP summary (3-column inline specs) with Add to Cart and PriceBreakdown side-by-side
- [x] Fixed sticky by moving `overflow-x: hidden` from body to html only
- [x] `minW="0"` through flex ancestor chain to enable overflow scrolling

### Apply to All Designer Pages
- [x] Bullwhip designer
- [x] Stockwhip designer
- [ ] Flogger designer (Phase 5A — will use same layout)
- [x] Snakewhip designer (Phase 5B — will use same layout)

### Photography & Assets
- [ ] Plan and shoot product photography for left-panel galleries
  - [ ] Finished whip examples (various color combos)
  - [ ] Handle design close-ups
  - [ ] Concho close-ups
  - [ ] Collar and heel loop close-ups
  - [ ] Workshop/craft process shots
- [ ] Upload gallery images to S3 (`bannerImages/`, `galleryImages/`)
- [ ] Create banner images for each designer page (1920x300px)

### Right Panel — Detailed Step Content
- [x] Waxing tab: intro paragraph, two-column layout with styled toggle buttons, pros/cons lists, overall thoughts
- [x] Length tab: two-column layout with styled buttons (left) and description text (right) for each length
- [x] Handle Length tab: same two-column layout with descriptions + Anatomy of a Bullwhip image
- [x] Extras tab: two-column layout (Collar left, Heel Loop right), collapses to single column at 1300px
- [x] Concho picker: centered images in grid cells
- [x] Color picker: fixed 6-column grid with horizontal scrollbar at narrow widths
- [x] Dragon Pommel commented out (out of stock), Wolf/Cobra Pommel excluded from stockwhip designer

### Update 3JS
- [x] Address over brightness issue on render (switched MeshBasicMaterial to MeshStandardMaterial)
- [x] Add interactive rotation or slow down rotation
- [x] Create Herringbone pattern

## Phase 4: Whipmaking Materials Section (In Progress)
- [x] Create materials listing page (`/whipmaking-materials`)
- [x] Add "Whipmaking Materials" nav item (desktop + mobile)
- [x] Add materials source filesystem to gatsby-config
- [x] Generate individual product pages via gatsby-node
- [x] Add "View All Whipmaking Materials" button on material product pages
- [x] Define GraphQL schema for variant priceDiff field
- [x] Fix Snipcart shipping: resolved $100 minimum order threshold
- [x] Create product listings:
  - [x] Concho ($3.49, variants: Silver/Brass/Copper)
  - [x] Core Material ($19.99, 50' length)
  - [x] Whipmaker's Fid ($9.99)
  - [x] Steel Handle Rod ($4.99-$5.99, variants: 8"/10"/12")
  - [x] Core Shot ($7.99, variants: #8 Steel/#9 Nickel Plated Lead)
  - [x] Textile Tape ($4.99)
  - [x] Vinyl Tape Measure ($6.99, variants: Yellow/Blue/White)
- [x] Add paracord listing *(custom layout — color chart with lens zoom)*
  - [x] Custom ParacordPage template with lens zoom + preview overlay
  - [x] 37 color options, 3 length options (100ft/250ft/1000ft)
  - [x] Snipcart integration with color and length custom fields
  - [x] Banner image with paracord1.jpg
  - [ ] Create a dedicated paracord banner image for the listing
  - [ ] Add quantity limits to 1000ft paracord spools (different limit per color)
- [ ] Inventory management for whipmaking materials
  - [x] Set up per-variant inventory in Snipcart dashboard (Paracord 1000ft, Concho, Core Material, Fid, Steel Handle Rod, Core Shot, Textile Tape, Vinyl Tape Measure)
  - [x] Display stock levels on product pages via Snipcart Products API
- [x] Update kevlar poppers listing (renamed to "10 Kevlar Poppers", 6 new photos, Assorted color option)
- [x] Add nylon poppers listing ("10 Nylon Poppers", $25, 3 images)
- [x] Update BullwhipAddedModal to offer both Kevlar and Nylon poppers
- [x] Add "View All Accessories" button on accessory product pages
- [x] Remove unused AddPoppersModal component
- [x] Add quantity selector to whipmaking materials, tools, and accessories product pages
- [x] Add Whip Making Blueprints page (`/whip-making-blueprints`)
  - [x] 17 blueprint listings (7 bullwhip, 7 handle patterns, 3 bundles)
  - [x] Snipcart digital delivery with file GUIDs (live mode)
  - [x] `data-item-shippable="false"` for all digital products
  - [x] AddedToCartModal on all add-to-cart buttons
  - [x] Hero section with embedded YouTube intro video and sales copy
  - [x] Free 6-part YouTube video series section with thumbnail grid
  - [x] Handle pattern preview images with labels (alphabetical)
  - [x] Featured complete bundle at top and bottom of page
  - [x] Blueprint and pattern sample images
  - [x] Added to Whipmaking nav dropdown (top position, desktop + mobile)
  - [x] Renamed "Whipmaking Materials" to "Tools and Materials" in nav
  - [x] Updated /whipmaking-materials page header to "Whip Making Tools and Materials"
- [x] Set up SendGrid domain authentication for email deliverability
  - [x] Authenticated whipworks.com domain via Snipcart SendGrid settings
  - [x] Added CNAME DNS records in AWS Route 53
  - [x] Changed Snipcart sender email to orders@whipworks.com
- [ ] Create styled and compelling email templates in Snipcart
- [x] Set up @whipworks.com email accounts to send/receive through personal Gmail
  - [x] Email forwarding via Squarespace/Mailgun to personal Gmail
  - [x] Gmail "Send mail as" alias for adam@whipworks.com
  - [x] Added SPF TXT record (Google, SendGrid, Mailgun, Amazon SES)
  - [x] Updated contact form Lambda: Node.js 20.x, AWS SDK v3, sender changed to inquiries@whipworks.com
  - [x] Verified inquiries@whipworks.com in SES (us-east-2)

## Phase 4B: Specialty Whip Listing Updates
- [ ] Update all specialty whip listings with new black-backdrop photography
  - [x] The Indy Bullwhip (retire Classic style, update images for Raider/Kingdom Finder/Junior)
  - [x] The Catwhip (update images for Black/Imperial Red variants)
  - [x] The Belmont (NEW listing)
  - [x] The Harlequin (NEW listing)
  - [x] The Joking Bullwhip (NEW listing)
  - [x] The Mando Bullwhip (NEW listing)
  - [x] The Z Whip (new images, description, specs, added 10" handle option)
  - [x] The One Winged Bullwhip (new images, description, specs)
  - [x] The Star Spangled Bullwhip (new images, description, specs)
  - [ ] The Pride Whip (awaiting new photos)
- [ ] Update pricing for all Specialty Whip listings
- [ ] Update /specialty-whips landing page layout (Filson-inspired grid)
- [x] Update individual specialty whip page layout (Filson-inspired two-column)

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
  - [ ] Heel loop yes/no (reuse from Phase 3)
  - [ ] Lashing type — Heavy or Light
  - [ ] Number of lashings *(Light: 24/36/48/60, Heavy: locked at 9)*
  - [ ] Lashing length — 16", 18", 20", 22", 24" *(same for both types)*
  - [ ] Price breakdown component *(awaiting pricing from Adam)*
  - [ ] Snipcart integration with all custom fields
- [ ] Add flogger to "Custom Whips" nav dropdown
- [ ] Add flogger nav thumbnail image

### 5B: Snakewhip ✅
- [x] Build "Design a Snakewhip" page (/design-snakewhip)
  - [x] Primary color selection (reuse existing color picker)
  - [x] Secondary color selection (reuse existing color picker)
  - [x] Handle design selection (Herringbone default/free, others +$15 upcharge)
  - [x] Add Herringbone handle pattern to Three.js 3D preview
  - [x] Concho selection (reuse existing ConchoPicker)
  - [x] Heel loop (reuse HeelLoopPicker from Phase 3)
  - [x] Waxing yes/no (reuse existing)
  - [x] Length selection (3'-12', base $149)
  - [x] Price breakdown component (PriceBreakdownSnakewhip)
  - [x] Snipcart integration with all custom fields
- [x] Add snakewhip to "Custom Whips" nav dropdown
- [x] Add snakewhip nav thumbnail image
- [x] Snakewhip gallery with 3 whips (SnW1, SnW2, SnW29)
- [x] 3D preview improvements: onLoad callbacks, 3-point lighting, ACES Filmic tone mapping, MeshPhysicalMaterial with clearcoat
- [x] Collapsible summary sections with slide animation (framer-motion) on all 3 designers
- [x] Sticky "Return to Top" button on all designer pages
- [x] Previous/Next navigation buttons on all designers
- [x] Herringbone handle design available on all 3 designers
- [ ] Update Contact page internal links to include flogger, snakewhip, and materials pages

## Phase 6: SEO & Performance ✅
- [x] Set up Google Analytics (GA4) — Measurement ID: G-W5F0T5B7KR
- [x] Set up Google Search Console — verified via GA4
- [x] Add structured data (JSON-LD) for products
- [x] Improve meta descriptions and page titles across all pages
- [x] Add/generate sitemap (gatsby-plugin-sitemap)
- [x] Submit sitemap to Google Search Console
- [x] Add alt text to all images *(completed in Phase 1)*
- [x] Optimize image loading and Core Web Vitals (lazy loading on below-the-fold images)
- [x] Review and improve internal linking
  - [x] Homepage: added Design a Stockwhip button
  - [x] Contact page: links to Specialty Whips and custom Bullwhip options
  - [x] Accessories page: links to Bullwhip and Stockwhip designers
  - [x] Specialty whip pages: "View all Specialty Whips" button + "Design your own" CTA

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

## Phase 9: LinkTree Replacement (`/links`)
- [ ] Build link-in-bio page as Gatsby route (`www.whipworks.com/links`)
  - [ ] WhipWorks branding (logo, colors, rustic aesthetic)
  - [ ] Links: Shop, Instagram, YouTube, Etsy, Contact
  - [ ] Mobile-first responsive design
- [ ] Deploy and verify
- [ ] Update social media bios to point to `www.whipworks.com/links`
- [ ] Cancel LinkTree subscription (~$100/month savings)
- [ ] *(Optional)* Set up `links.whipworks.com` subdomain redirect to `/links`
