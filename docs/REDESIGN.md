# NWO visual redesign

The site remains a Next.js static export deployed by the existing GitHub Pages workflow. The custom domain, lesson data, authentication, pricing and Telegram destinations are preserved.

## Visual system

- Black, red, orange and off-white flat surfaces; condensed Oswald headings and Manrope body text.
- Homepage: native vertical scroll, sticky opening scene, scroll-linked arrow scaling and rotation, color wipe, text fill and programme movement. No wheel, touch or keyboard scroll interception.
- Inner pages: shared header, footer, typography, posters, buttons, course outline, lesson and authentication surfaces. Only short existing reveals remain.
- Content is server rendered; programme and FAQ details use native disclosures. Reduced motion removes continuous transforms and entrance animations. Mobile uses a shorter, unpinned opening scene.
- Homepage retains the event programme, author, course formats and prices, scheduling status, registration instructions, FAQ, journal links and original result conditions.

Fonts are distributed under their accompanying OFL licenses. `app/font-data.css` embeds the small WOFF files to avoid external font requests. Regenerate with `node scripts/generate-font-css.mjs` after changing source fonts.

## Validation

- `pnpm install --frozen-lockfile`, `pnpm build`, `tsc --noEmit`, `git diff --check`.
- All 12 static route outputs generated; 132 internal links checked without missing destinations.
- Browser review at desktop and 375 / 768 px iframe widths: typography, native scrolling, mobile menu, programme disclosure, course introductions, journal, mentorship, free-course navigation and lesson completion.
- Paid access was not exercised with a real account; its existing data and authentication logic were left intact. Local preview uses the repository's existing public-course fallback when the deployment secret is absent.

`pnpm-workspace.yaml` mirrors the existing lodash override so frozen installation works with both pnpm 10 (CI) and pnpm 11 (local runtime).

## Mobile refinement

- Body copy is 15–16 px, secondary copy at least 12 px, primary button text 14 px; menu toggle is 48 px.
- Full-width primary actions, smaller decorative posters, shorter opening spacing, and poster artwork that avoids its captions.
- Native safe-area padding and viewport-fit support without restricting zoom. Form fields use 16 px text to avoid focus zoom on iOS.
- The menu has a dismissing backdrop, deduplicated destinations, and a scrollable height limit for landscape phones. Footer links and lesson controls have larger touch areas.
- Homepage scroll effects register no scroll listener below 768 px. Internal page reveals use shorter travel and duration; pages without parallax have no scroll handler.
- Chrome iframe QA at 320×568, 375×667, 390×844, 430×844, 667×375, and 768×900: no horizontal overflow or out-of-bounds headings, paragraphs or links on the homepage. Also checked course introductions, mentorship, journal and an article at 320 px, plus lesson navigation and outline at 375 px. Real-device Safari testing was not available.
