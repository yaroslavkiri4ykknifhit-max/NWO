const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/landing-page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the dirty inline style
content = content.replace(
  /<style dangerouslySetInnerHTML=\{\{__html: `[\s\S]*?`\}\} \/>/,
  ''
);

fs.writeFileSync(file, content, 'utf8');
