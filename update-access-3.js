const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/access-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix nested min-h-screen
content = content.replace(/<div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 transition-all duration-300">\s*<div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 transition-all duration-300">/g, '<div className="min-h-screen flex items-center justify-center bg-white p-4 transition-all duration-300"><div className="w-full max-w-md bg-white border border-gray-200 p-8 shadow-xl">');

// Fix text colors that might be white
content = content.replace(/text-white\/80/g, 'text-gray-500');
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-slate-900/g, 'text-black');
content = content.replace(/text-slate-500/g, 'text-gray-500');

// Fix colors
content = content.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-black hover:bg-gray-800 text-white');
content = content.replace(/bg-slate-900 hover:bg-slate-800/g, 'bg-black hover:bg-gray-800 text-white');
content = content.replace(/bg-green-600 hover:bg-green-700/g, 'bg-black hover:bg-gray-800 text-white');
content = content.replace(/border-slate-100\/80/g, 'border-gray-200');

fs.writeFileSync(file, content, 'utf8');
