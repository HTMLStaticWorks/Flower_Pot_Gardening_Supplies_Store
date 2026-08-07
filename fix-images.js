const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Add loading="lazy" to images that don't have it, unless they are hero images or logo/portrait at the very top.
    // To be safe, we can just add loading="lazy" to ALL images, then remove it from the top logo.
    // Or we can add it to all images except those containing 'hero' or 'logo'.
    
    // We'll replace <img ...> with <img loading="lazy" ...> if it doesn't already have loading="lazy"
    content = content.replace(/<img(?![^>]*loading="lazy")([^>]*)>/gi, (match, p1) => {
        // Don't lazy load the main hero images in index-2.html or index.html to ensure fast LCP
        if (p1.includes('hero-2-img') || p1.includes('garden,greenhouse') || p1.includes('logo')) {
            return match;
        }
        return `<img loading="lazy"${p1}>`;
    });

    fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    console.log(`Updated ${file}`);
});
