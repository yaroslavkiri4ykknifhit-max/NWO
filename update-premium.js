const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/premium-dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file currently has a complex structure with absolute positioned gradients, 
// a big "ТЫ ВНУТРИ" text, and a sticky card. We will clean it up to NYT style.
content = content.replace(/className="flex-1 overflow-y-auto premium-dashboard font-sans relative"/g, 'className="flex-1 overflow-y-auto bg-white font-ui text-[#121212] relative"');

// Remove dark background gradient section
content = content.replace(/<div className="absolute inset-0 pointer-events-none z-0">.*?<\/div>\s*<\/div>/s, '');

// Fix texts
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-\[\#c6ff3d\]/g, ''); // Remove explicit green
content = content.replace(/text-slate-400/g, 'text-gray-500');
content = content.replace(/text-slate-300/g, 'text-gray-700');
content = content.replace(/text-emerald-400/g, 'text-gray-500');

// Fix big headers
content = content.replace(/className="premium-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white\/70 uppercase tracking-tighter"/g, 'className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tight leading-[0.9]"');
content = content.replace(/className="premium-display font-black text-\[\#c6ff3d\] uppercase tracking-tighter"/g, 'className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tight leading-[0.9]"');

// Fix buttons
content = content.replace(/className="premium-primary-button inline-flex items-center gap-3 bg-\[\#c6ff3d\] hover:bg-\[\#d4ff66\] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-\[0_0_40px_rgba\(198,255,61,0.2\)\] transition-all"/g, 'className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all"');

// Fix cards
content = content.replace(/className="premium-membership-card sticky top-10 w-full sm:w-\[420px\] shrink-0"/g, 'className="sticky top-10 w-full sm:w-[420px] shrink-0"');
content = content.replace(/className="relative rounded-3xl overflow-hidden border border-\[\#c6ff3d\]\/20 bg-black\/80 backdrop-blur-2xl shadow-2xl p-1"/g, 'className="relative border border-gray-200 bg-white shadow-xl p-1"');
content = content.replace(/className="absolute inset-0 bg-gradient-to-br from-\[\#c6ff3d\]\/5 to-transparent opacity-50"/g, '');
content = content.replace(/className="relative h-full rounded-\[1.4rem\] border border-white\/5 bg-[#050706] p-8 flex flex-col"/g, 'className="relative h-full border border-gray-100 bg-white p-8 flex flex-col"');
content = content.replace(/className="w-12 h-12 rounded-2xl bg-\[\#c6ff3d\]\/10 border border-\[\#c6ff3d\]\/20 flex items-center justify-center text-\[\#c6ff3d\]"/g, 'className="w-12 h-12 bg-gray-100 flex items-center justify-center text-black"');

content = content.replace(/bg-white\/10/g, 'bg-gray-200');
content = content.replace(/bg-\[\#c6ff3d\]/g, 'bg-black');
content = content.replace(/bg-[#080a09]/g, 'bg-white');
content = content.replace(/border-white\/10/g, 'border-gray-200');

fs.writeFileSync(file, content, 'utf8');
