const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/landing-page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Logo
content = content.replace(
  /<h1[^>]*>[\s\S]*?New Way Out[\s\S]*?<\/h1>/,
  `<div className="flex justify-center mb-4">
              <img src="/logo-gothic.jpg" alt="New Way Out" className="h-16 md:h-24 object-contain mix-blend-multiply" />
            </div>`
);

// Update Founder Photo
content = content.replace(
  /<div className="aspect-\[4\/3\] w-full bg-gray-200 border border-gray-300 relative overflow-hidden flex items-center justify-center">[\s\S]*?<\/div>/,
  `<div className="aspect-[4/3] w-full bg-gray-200 border border-gray-300 relative overflow-hidden flex items-center justify-center">
                  <img src="/founder.jpg" alt="Ярослав Киричук" className="object-cover w-full h-full hover:scale-[1.02] transition-transform duration-700" />
                </div>`
);

fs.writeFileSync(file, content, 'utf8');
