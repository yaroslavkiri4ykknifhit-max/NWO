const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/landing-page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the image block with an <h1> text block
content = content.replace(
  /<div className="flex justify-center mb-4">[\s\S]*?<img src="\/logo-gothic\.jpg"[\s\S]*?<\/div>/,
  `<h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "clamp(3rem, 10vw, 8.5rem)" }} className="text-center mb-4 leading-none font-normal tracking-tight text-black">
              New Way Out
            </h1>`
);

fs.writeFileSync(file, content, 'utf8');
