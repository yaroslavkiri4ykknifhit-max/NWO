const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update CSP to allow Google Fonts
content = content.replace(
  /font-src 'self' data:;/,
  "font-src 'self' data: https://fonts.gstatic.com;"
);

content = content.replace(
  /style-src 'self' 'unsafe-inline';/,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
);

// Add the link tag to head
content = content.replace(
  /<head>/,
  `<head>\n        <link rel="preconnect" href="https://fonts.googleapis.com" />\n        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />\n        <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap" rel="stylesheet" />`
);

fs.writeFileSync(file, content, 'utf8');
