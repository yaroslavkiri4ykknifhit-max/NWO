# NWO — reference-matched event landing

Reference: https://www.brandscalingbootcamp.com/lp-1 (user explicitly requested identical visual structure with NWO copy).

Rebuilt the home page to follow the reference section by section:

1. Fixed 74px translucent red-black header with event logo and participation status.
2. Red event badge, 46px headline with red/yellow highlights, narrow subtitle.
3. 712px media area, event label, 400px oval gradient CTA and two small check captions.
4. Horizontal moving topic strip.
5. Full-width, rounded outlined two-column problem panel.
6. Centered quote panel over the reference's diagonal black background.
7. Outlined walkthrough panel, two columns and icon benefit grid.
8. Three glass cards for what, where and when.
9. Five alternating agenda sections with oversized gray numbering and device illustrations.
10. Two horizontally moving rows of teaching examples.
11. Three linked material preview cards.
12. Side-by-side red and gold pricing cards with inclusions and exclusions.
13. Three illustrated takeaway columns.
14. Centered red gradient reassurance panel.
15. Full-width why-free panel.
16. Participation steps, host, FAQ and compact footer.

Fonts and colors match the inspected reference: Syne / Inter, #ffbf00 yellow, bright red accents, #0d0d0d background. Syne uses Inter fallback for Cyrillic. The generic grid and dark diagonal background are retained reference assets (`public/art/bootcamp-grid.svg`, `public/art/bootcamp-pattern.jpg`). NWO illustrations use HTML/CSS device mockups with original Russian labels.

The host photo, courses, learning pages and contact belong to NWO. No Brez logos, person photos, testimonials, checkout links, tracking scripts or invented student results are included. Existing teaching screenshots are labeled as examples. No promotional video was provided: the hero media area links to the actual free lesson and is labeled accordingly. The date remains unconfirmed, so no artificial countdown is shown. Telegram opens a prepared inquiry; the visitor must send it. Black remains the existing separate $17 course, not a required event upgrade.

Validation: production Next static export with TypeScript; desktop and 320/390px layout inspection; anchor navigation; FAQ; lesson links; external contact destinations; no horizontal text clipping. Existing learning/account backend is unchanged.
