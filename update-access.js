const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/access-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out premium and standard wrappers
content = content.replace(/className={cn\("min-h-\[80vh\] flex flex-col items-center justify-center p-4", isPremium \? "premium-access" : "bg-gradient-to-br from-slate-50 to-slate-100"\)}/g, 'className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-white"');

// Fix card wrapper
content = content.replace(/className={cn\("relative mx-auto w-full max-w-md overflow-hidden rounded-2xl p-8 shadow-2xl backdrop-blur-xl sm:p-10", isPremium \? "premium-login-card" : "border border-slate-200 bg-white\/70"\)}/g, 'className="relative mx-auto w-full max-w-md p-8 sm:p-10 bg-white border border-gray-200 shadow-xl"');

// Remove orbs and background decorations
content = content.replace(/isPremium && \(\s*<>\s*<div className="premium-login-orb premium-login-orb-one" \/>\s*<div className="premium-login-orb premium-login-orb-two" \/>\s*<\/>\s*\)/g, '');
content = content.replace(/!isPremium && \(\s*<div className="absolute inset-0 bg-white\/40 backdrop-blur-3xl z-0" \/>\s*\)/g, '');
content = content.replace(/<div className={cn\("absolute inset-0", isPremium \? "premium-grid opacity-20" : ""\)} \/>/g, '');

// Typography
content = content.replace(/className={cn\("text-3xl font-black tracking-tight", isPremium \? "text-white" : "text-slate-900"\)}/g, 'className="text-3xl font-display font-bold text-black"');
content = content.replace(/className={cn\("text-sm font-medium", isPremium \? "text-slate-400" : "text-slate-500"\)}/g, 'className="text-sm text-gray-500 mt-2"');

// Inputs
content = content.replace(/className={cn\("h-12 border transition-all", isPremium \? "bg-black\/50 border-white\/10 text-white placeholder:text-slate-500 focus:border-blue-500\/50 focus:ring-blue-500\/20" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500\/20"\)}/g, 'className="h-12 border border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-0 rounded-none"');

// Buttons
content = content.replace(/className={cn\("w-full h-12 text-base font-bold shadow-lg transition-all", isPremium \? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900\/20" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900\/20"\)}/g, 'className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs rounded-none"');

content = content.replace(/className={cn\("w-full h-12 text-base font-bold shadow-lg transition-all", isPremium \? "bg-accent hover:bg-accent\/90 text-black shadow-accent\/20" : "bg-green-600 hover:bg-green-700 text-white shadow-green-600\/20"\)}/g, 'className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs rounded-none"');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated access-form");
