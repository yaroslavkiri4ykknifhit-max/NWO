const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/components/lesson-sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove premium specific CSS class but keep the layout
content = content.replace(/isPremium && "premium-course-sidebar"/g, '""');

// Use clean gray/white
content = content.replace(/bg-sidebar/g, 'bg-white');
content = content.replace(/border-sidebar-border/g, 'border-gray-200');
content = content.replace(/text-sidebar-foreground/g, 'text-black');
content = content.replace(/text-muted-foreground/g, 'text-gray-500');
content = content.replace(/hover:bg-sidebar-accent\/50/g, 'hover:bg-gray-50');
content = content.replace(/hover:bg-sidebar-accent/g, 'hover:bg-gray-100');
content = content.replace(/bg-sidebar-accent\/15/g, 'bg-gray-50');
content = content.replace(/bg-sidebar-accent/g, 'bg-gray-100');
content = content.replace(/text-accent/g, 'text-black');
content = content.replace(/bg-secondary text-secondary-foreground/g, 'bg-gray-100 text-black');

fs.writeFileSync(file, content, 'utf8');
