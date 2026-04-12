# WhipWorks.com

E-commerce site for custom handmade paracord whips. Built with Gatsby 5, Chakra UI, Snipcart, and Three.js.

## Tech Stack

- **Framework:** Gatsby 5 + TypeScript
- **UI:** Chakra UI (dark theme)
- **Commerce:** Snipcart (cart, checkout, inventory)
- **3D Preview:** Three.js (interactive whip handle visualization)
- **Content:** Markdown with YAML frontmatter
- **Hosting:** AWS S3 + CloudFront
- **Analytics:** Google Analytics (GA4)

## Development

```bash
npm install
npm run develop     # http://localhost:8000
```

## Build & Deploy

```bash
npm run build       # Build to public/
npm run deploy      # Deploy to S3
```

To invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation --distribution-id E3JS36YMAEJ3WR --paths "/*"
```

## Documentation

- [architecture.md](architecture.md) - Comprehensive architecture reference with Mermaid diagrams
- [project-plan.md](project-plan.md) - Development roadmap and phase tracking
