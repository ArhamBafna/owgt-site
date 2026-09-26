const fs = require('fs');
const path = require('path');

const dir = 'assets/icons';

const svgs = {
  'trophy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#FFD700" d="M3 2h10v4H3zm2 4h6v4H5zm2 4h2v2H7zm-2 2h6v2H5z"/></svg>`,
  'coin.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#FFD700"/><circle cx="8" cy="8" r="4" fill="#DAA520"/></svg>`,
  'console.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="12" height="14" x="2" y="1" fill="#CCCCCC" rx="1"/><rect width="8" height="6" x="4" y="3" fill="#88CC88"/><circle cx="5" cy="12" r="1" fill="#FF4444"/><circle cx="11" cy="11" r="1" fill="#4444FF"/></svg>`,
  'icecream.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#FFAACC" d="M6 2h4v4H6zM4 4h8v4H4z"/><path fill="#D2B48C" d="M6 8h4v4H6zM7 12h2v2H7z"/></svg>`,
  'spaceinvader.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#33FF33" d="M5 2h6v2H5zM3 4h10v2H3zM1 6h14v2H1zM1 8h4v2H1zM11 8h4v2h-4zM3 10h2v2H3zM11 10h2v2h-2zM5 12h2v2H5zM9 12h2v2H9z"/></svg>`,
  'email_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="14" height="10" x="1" y="3" fill="#FFFFFF" stroke="#000000" stroke-width="1"/><path d="M1 4l7 4 7-4" stroke="#000000" stroke-width="1" fill="none"/></svg>`
};

for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(dir, name), content);
}
console.log('SVGs created');
