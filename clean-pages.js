const fs = require('fs');

function clean(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/premium-surface /g, '');
  content = content.replace(/premium-paywall /g, '');
  content = content.replace(/premium-access /g, '');
  content = content.replace(/free-course-surface /g, '');
  content = content.replace(/bg-background/g, 'bg-white');
  content = content.replace(/text-foreground/g, 'text-black');
  
  // also fix loader color
  content = content.replace(/text-\[\#b8ff3d\]/g, 'text-black');
  content = content.replace(/text-green-600/g, 'text-black');
  content = content.replace(/text-white\/40/g, 'text-gray-500');
  
  fs.writeFileSync(file, content, 'utf8');
}

clean('/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/app/premium/page.tsx');
clean('/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/app/free/page.tsx');

console.log("Pages cleaned");
