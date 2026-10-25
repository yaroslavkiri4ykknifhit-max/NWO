# NWO cinematic redesign

The home page follows one route: introduction → four practical skills → format selection → author → four concise FAQs → first lesson. Free, Black, mentorship, journal and article pages share the same navigation and dark editorial design. Prices are preserved from the existing source: Black $17, mentorship $170/30 days.

Account logic, Google Apps Script integration, invite activation, WebAuthn and progress storage remain in place. The header links directly to `/premium/#login`. Lessons use quiet dark reading surfaces. Scroll animation is progressive enhancement; content is readable without JavaScript and reduced-motion preferences disable parallax and reveals.

## Artwork

Project asset: `public/art/impasto-blue.webp` (292,498 bytes). Generated with the built-in imagegen tool, then exported as WebP. No runtime image service is required.

Generation prompt:

> Use case: stylized-concept. Asset type: background artwork for a premium Russian sales education website, New Way Out. Create one wide cinematic abstract impasto oil painting. A monumental dark wave / folded ridge of thick palette knife oil paint rises diagonally in the RIGHT TWO THIRDS, with deep carved folds and tiny cracks, icy muted blue and desaturated steel silver highlights catching a narrow dramatic chiaroscuro light. The LEFT THIRD is almost pure black with sparse subtle brush strokes, usable negative space for white website typography. Deep black background, charcoal, Prussian blue, no warm colors. Tactile real physical oil paint, exquisite palette knife ridges and cracked paint skin, atmospheric depth. Restrained, mysterious, gallery quality, editorial fine art photograph of a painting with raking light. Not a glossy CGI render. No text, letters, symbols, logos, borders or watermark. Landscape aspect ratio.

## Validation

- Frozen installation with pnpm 10 (matches GitHub Actions).
- Production static export and TypeScript checks pass.
- All seven public content pages have one H1; internal page links and referenced local assets resolve.
- Browser QA: desktop home/program selection, 390px and 320px responsive layouts, mobile menu, direct Black login, free lesson opening/completion, progress restored after reload.
- Local course QA uses the repository's existing demo data when the Apps Script environment variable is absent. Live email delivery and paid account access need the existing production API configuration; they were not exercised with a real account.
