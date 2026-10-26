# NWO unified visual system

All published routes now use one visual language: Inter body type, Syne headings (Inter Cyrillic fallback), #0d0d0d backgrounds, red gradient actions, #ffbf00 accents and rounded glass panels.

Coverage: home, free and Black program introductions, learning dashboards, lesson viewer and outline, sign-in and access states, mentorship, journal and articles, custom 404, loading states and standalone loader preview. Course data, authentication, invite redemption and progress APIs retain their existing behavior.

`components/brand.tsx` supplies the shared wordmark and code-native brand artwork. Every former personal-portrait placement uses this artwork, with variants for the open course, Black, host and story slots. The personal `public/founder.jpg` file is removed from the deployable tree. Old homepage preview screenshots are replaced with the current photo-free version. OG cards and app icons now use the same red/yellow branding.

Removed the previous white/gothic and blue/serif CSS systems. Shared presentation and learning styles live in `app/editorial.css`; semantic tokens and Tailwind mapping live in `app/globals.css`. The reference-matched home layout keeps its own CSS module and uses the same brand primitives.

Validation: production static export and TypeScript; export scan for portrait references and missing local assets; desktop and 320/390px layout inspection; free lesson selection, completion and next-lesson action; sign-in surface inspection without sending email or changing account state. The authenticated Black dashboard shares the verified learning components; no production account was used for authentication testing.
