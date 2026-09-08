const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/lesson-viewer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove premium specific CSS class
content = content.replace(/isPremium && "premium-lesson-viewer"/g, '""');

// Fix text colors and fonts
content = content.replace(/text-slate-700/g, 'text-black');
content = content.replace(/font-sans/g, 'font-ui');
content = content.replace(/bg-background/g, 'bg-white');
content = content.replace(/text-slate-500/g, 'text-gray-500');

// Fix blockquote
content = content.replace(/border-\[\#2b9348\]/g, 'border-black');
content = content.replace(/bg-\[\#f5f9f4\]\/60/g, 'bg-gray-50');
content = content.replace(/rounded-r-xl/g, 'rounded-none');
content = content.replace(/rounded-xl/g, 'rounded-none');
content = content.replace(/rounded-2xl/g, 'rounded-none');

// Header formatting
content = content.replace(/className="mb-8"/g, 'className="mb-12 border-b border-gray-200 pb-8"');
content = content.replace(/text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight/g, 'text-4xl sm:text-5xl font-display font-bold leading-tight mb-4');
content = content.replace(/text-blue-600 bg-blue-50/g, 'text-black bg-gray-50 border border-gray-200');

// Video frame
content = content.replace(/className={cn\("aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-8 border border-slate-200 shadow-sm", isPremium && "premium-video-frame"\)}/g, 'className="aspect-video w-full bg-gray-100 mb-12 border border-gray-200"');

// Lesson content background
content = content.replace(/className={cn\("bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10", isPremium && "premium-lesson-content"\)}/g, 'className="bg-white border border-gray-200 p-8 sm:p-12"');
content = content.replace(/lesson-reading-content prose prose-slate max-w-none/g, 'prose prose-lg prose-gray max-w-none font-ui');

// Finish button
content = content.replace(/bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600\/20/g, 'bg-black hover:bg-gray-800 text-white shadow-none rounded-none uppercase tracking-widest text-xs font-bold');

// Next button
content = content.replace(/bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/g, 'bg-white hover:bg-gray-50 text-black border border-gray-200 rounded-none uppercase tracking-widest text-xs font-bold');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated viewer");
