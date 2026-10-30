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
