const fs = require('fs');
const https = require('https');

const data = JSON.parse(fs.readFileSync('raw-source-code/image-urls.json', 'utf8'));

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    // Strip wix CDN crop/resize params if any to get high res
    // example: ...~mv2.jpg/v1/fill/... -> ...~mv2.jpg
    let cleanUrl = url;
    if (url.includes('/v1/')) {
        cleanUrl = url.split('/v1/')[0];
    }
    const file = fs.createWriteStream(dest);
    https.get(cleanUrl, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
          return https.get(response.headers.location, res => {
             res.pipe(file);
             file.on('finish', () => { file.close(); resolve(); });
          });
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

(async () => {
  let i = 1;
  for (const url of data.imgs) {
    if (url.includes('svg')) continue;
    
    // Attempt to parse name
    let name = 'image_' + i + '.jpg';
    if (url.includes('owgt-logo')) name = 'owgt-logo.png';
    else if (url.includes('IMG_3617')) name = 'board_member_1.jpg';
    else if (url.includes('IMG_4034')) name = 'board_member_2.jpg';
    else if (url.includes('arham')) name = 'board_member_3.jpg';
    else if (url.includes('templatesdrive')) name = 'robot_kids.jpg';
    else if (url.includes('Coding.jpg')) name = 'coding_bg.jpg';
    else if (url.includes('~mv2.png')) name = 'hero_bg.png';
    
    console.log('Downloading', name);
    await download(url, `assets/images/${name}`);
    i++;
  }
  console.log('Images downloaded');
})();
