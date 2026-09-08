const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/access-form.tsx';
let content = fs.readFileSync(file, 'utf8');

// The file has a complex `className={isPremium ? "..." : "..."}` pattern.
// Let's replace the whole `className={isPremium ? ... : ...}` block
content = content.replace(/className=\{isPremium[\s\S]*?\}/g, 'className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 transition-all duration-300"');
content = content.replace(/className=\{isPremium[\s\S]*?\}/g, 'className="w-full max-w-[480px] bg-white border border-gray-200 p-8 sm:p-10 shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col"');

// Actually, `isPremium` might be used for text coloring too. Let's just remove `isPremium` logic for classes.
content = content.replace(/isPremium\s*\?\s*"[^"]+"\s*:\s*"[^"]+"/g, '""');

// Remove orbs and decorators
content = content.replace(/\{isPremium && \([\s\S]*?<\/>\s*\)\}/, '');
content = content.replace(/\{!isPremium && \([\s\S]*?<\/div>\s*\)\}/, '');

fs.writeFileSync(file, content, 'utf8');
