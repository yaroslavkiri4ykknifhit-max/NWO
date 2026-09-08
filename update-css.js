const fs = require('fs');
const file = '/Users/macbook/.gemini/antigravity/scratch/NWO-mentorship/app/globals.css';
let css = fs.readFileSync(file, 'utf8');

// Replace dark colors with light ones in premium classes
css = css.replace(/rgba\(184, 255, 61/g, 'rgba(0, 0, 0'); // Lime green -> Black
css = css.replace(/#b8ff3d/g, '#000000'); // Lime hex -> Black hex

css = css.replace(/rgba\(124, 58, 237/g, 'rgba(100, 100, 100'); // Purple -> Gray
css = css.replace(/#7c3aed/g, '#666666'); // Purple hex -> Gray hex

css = css.replace(/#050706/g, '#f9fafb'); // Dark background -> Light gray
css = css.replace(/rgba\(5, 7, 6, 0.88\)/g, 'rgba(255, 255, 255, 0.88)');
css = css.replace(/#080a09/g, '#ffffff'); // Sidebar background -> White
css = css.replace(/#070908, #0a0d0b 48%, #060807/g, '#ffffff, #f9fafb 48%, #ffffff'); // Lesson viewer background

css = css.replace(/rgba\(17, 21, 18, 0.97\), rgba\(7, 9, 8, 0.99\)/g, 'rgba(255, 255, 255, 0.97), rgba(250, 250, 250, 0.99)'); // Card gradients -> white
css = css.replace(/rgba\(255, 255, 255, 0.055\)/g, 'rgba(0, 0, 0, 0.055)');
css = css.replace(/rgba\(255, 255, 255, 0.06\)/g, 'rgba(0, 0, 0, 0.06)');
css = css.replace(/rgba\(255, 255, 255, 0.022\)/g, 'rgba(0, 0, 0, 0.05)');

css = css.replace(/rgba\(255, 255, 255, 0.045\), rgba\(255, 255, 255, 0.018\)/g, 'rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01)'); // Lesson content
css = css.replace(/rgba\(255, 255, 255, 0.09\)/g, 'rgba(0, 0, 0, 0.1)'); // Borders

css = css.replace(/color: #f6f8f6 !important;/g, 'color: #121212 !important;');
css = css.replace(/color: rgba\(245, 248, 245, 0.7\) !important;/g, 'color: rgba(0, 0, 0, 0.7) !important;');
css = css.replace(/color: rgba\(242, 247, 243, 0.88\) !important;/g, 'color: rgba(0, 0, 0, 0.88) !important;');
css = css.replace(/color: rgba\(242, 247, 243, 0.64\) !important;/g, 'color: rgba(0, 0, 0, 0.5) !important;');
css = css.replace(/color: rgba\(245, 250, 246, 0.9\) !important;/g, 'color: rgba(0, 0, 0, 0.9) !important;');
css = css.replace(/color: rgba\(248, 250, 248,/g, 'color: rgba(0, 0, 0,'); // text-white/XX

fs.writeFileSync(file, css, 'utf8');
console.log('CSS updated successfully');
