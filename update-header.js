const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/course-header.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out premium wrapper
content = content.replace(/isPremium && "premium-course-header"/g, '""');

// Fix colors
content = content.replace(/bg-white border-slate-200/g, 'bg-white border-gray-200');
content = content.replace(/text-slate-900/g, 'text-black');
content = content.replace(/text-slate-500/g, 'text-gray-500');
content = content.replace(/text-slate-600/g, 'text-gray-600');
content = content.replace(/text-accent/g, 'text-black');
content = content.replace(/bg-accent\/10/g, 'bg-gray-100');
content = content.replace(/bg-secondary/g, 'bg-gray-100');
content = content.replace(/text-secondary-foreground/g, 'text-black');
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-gray-50');
content = content.replace(/hover:bg-white\/5/g, 'hover:bg-gray-50');
content = content.replace(/border-slate-200/g, 'border-gray-200');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated header");
