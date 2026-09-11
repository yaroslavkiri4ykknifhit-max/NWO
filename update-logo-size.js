const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/landing-page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Increase font size significantly
content = content.replace(
  /fontSize: "clamp\(3rem, 10vw, 8.5rem\)"/,
  'fontSize: "clamp(4rem, 18vw, 15rem)"'
);

fs.writeFileSync(file, content, 'utf8');
