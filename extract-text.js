const fs = require('fs');

const html = fs.readFileSync('raw-source-code/hydrated-index.html', 'utf8');

// simple regex to strip tags
let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<[^>]+>/g, '\n')
               .replace(/^\s*[\r\n]/gm, '');

// Clean up multiple newlines
text = text.replace(/\n\s*\n/g, '\n');

fs.writeFileSync('raw-source-code/extracted-text.txt', text);
console.log('Done extracting text');
