const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace bg-[#faf8f3] with bg-white
content = content.replace(/bg-\[#faf8f3\]/g, 'bg-white');

// Replace font-sans text-slate-800 with font-ui text-[#121212]
content = content.replace(/font-sans text-slate-800/g, 'font-ui text-[#121212]');

// Remove decorative SVGs
content = content.replace(/<div className="absolute top-8 right-12.*?<\/div>/s, '');
content = content.replace(/<div className="absolute bottom-16 left-12.*?<\/div>/s, '');
content = content.replace(/<div className="absolute top-32 left-1\/4.*?<\/div>/s, '');
content = content.replace(/<div className="absolute bottom-1\/3 right-1\/4.*?<\/div>/s, '');

// Fix big header text
content = content.replace(/className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"/g, 'className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6"');
content = content.replace(/className="text-green-600"/g, '');

// Fix cards
content = content.replace(/bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200\/60/g, 'bg-white p-6 sm:p-8 border border-gray-200');
content = content.replace(/bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200\/60/g, 'bg-white p-6 sm:p-8 border border-gray-200');
content = content.replace(/rounded-xl/g, 'rounded-none');
content = content.replace(/rounded-2xl/g, 'rounded-none');
content = content.replace(/rounded-full/g, 'rounded-none');

// Fix primary button
content = content.replace(/bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600\/20/g, 'bg-black text-white hover:bg-gray-800');
content = content.replace(/text-green-700 bg-green-50/g, 'bg-gray-100 text-black');
content = content.replace(/text-amber-700 bg-amber-50/g, 'bg-gray-100 text-black');
content = content.replace(/text-blue-700 bg-blue-50/g, 'bg-gray-100 text-black');

// Premium card
content = content.replace(/bg-gradient-to-br from-amber-50 to-orange-50\/50 border-amber-200\/50/g, 'bg-black text-white border-black');
content = content.replace(/text-slate-800/g, 'text-gray-900');
content = content.replace(/text-slate-600/g, 'text-gray-600');

fs.writeFileSync(file, content, 'utf8');
