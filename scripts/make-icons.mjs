import sharp from 'sharp';

const svg = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="100%" height="100%" rx="${size * 0.2}" fill="#1d4ed8"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="sans-serif" font-weight="700" font-size="${size * 0.62}" fill="#fff">е</text>
    </svg>`,
  );

for (const [file, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(svg(size)).png().toFile(`public/icons/${file}`);
  console.log('wrote', file);
}
