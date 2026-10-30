import { readFileSync, writeFileSync } from 'node:fs';

// Source fonts and OFL licenses live together in app/fonts.
// Inline WOFF keeps typography reliable on static hosts and offline previews.
const faces = [['Manrope', 400], ['Manrope', 600], ['Manrope', 800], ['Oswald', 700]];
const css = ['/* Local OFL fonts, embedded so static hosts need no font service or extra requests. */'];
for (const [family, weight] of faces) {
  const file = new URL(`../app/fonts/${family.toLowerCase()}-${weight}.woff`, import.meta.url);
  const data = readFileSync(file).toString('base64');
  css.push(`@font-face{font-family:${family};font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff;base64,${data}) format('woff')}`);
}
writeFileSync(new URL('../app/font-data.css', import.meta.url), `${css.join('\n')}\n`);
