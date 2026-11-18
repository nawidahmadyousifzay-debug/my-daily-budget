import sharp from 'sharp'; import fs from 'node:fs/promises';
await fs.mkdir('public/icons',{recursive:true});
const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="110" fill="#14233d"/><rect x="100" y="145" width="312" height="235" rx="30" fill="#fff"/><path d="M100 205h312" stroke="#315fce" stroke-width="26"/><circle cx="160" cy="275" r="20" fill="#138a55"/><path d="M210 275h145M145 330h210" stroke="#14233d" stroke-width="18" stroke-linecap="round"/><text x="256" y="445" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">AFN</text></svg>`);
for(const size of [192,512]) await sharp(svg).resize(size,size).png().toFile(`public/icons/icon-${size}.png`);
