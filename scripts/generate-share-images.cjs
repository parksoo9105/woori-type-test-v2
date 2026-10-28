const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const shareConfigs = [
  {
    slug: 'type-01',
    legacySlug: 't1',
    id: 'type-1',
    svgFile: 'type-01-face-to-face.svg',
    pillText: 'TYPE 01 · RED',
    tagColor: '#FF654F',
    title: '마주보는 정원사'
  },
  {
    slug: 'type-02',
    legacySlug: 't2',
    id: 'type-2',
    svgFile: 'type-02-online.svg',
    pillText: 'TYPE 02 · BLUE',
    tagColor: '#4169E1',
    title: '연결망의 항해자'
  },
  {
    slug: 'type-03',
    legacySlug: 't3',
    id: 'type-3',
    svgFile: 'type-03-open.svg',
    pillText: 'TYPE 03 · GREEN',
    tagColor: '#658E1B',
    title: '다리를 놓는 탐험가'
  },
  {
    slug: 'type-04',
    legacySlug: 't4',
    id: 'type-4',
    svgFile: 'type-04-own-pace.svg',
    pillText: 'TYPE 04 · PURPLE',
    tagColor: '#8064D8',
    title: '고요한 등대'
  }
];

function buildShareSvg(c) {
  const rawSvg = fs.readFileSync(path.join(__dirname, '../src/assets/abstract', c.svgFile), 'utf8');
  const match = rawSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const svgInner = match ? match[1] : '';

  return `<svg width='1200' height='630' viewBox='0 0 1200 630' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <clipPath id='artClip_${c.slug}'>
      <rect x='640' y='70' width='490' height='490' rx='32' />
    </clipPath>
    <filter id='shadow_${c.slug}' x='-10%' y='-10%' width='130%' height='130%'>
      <feDropShadow dx='0' dy='14' stdDeviation='20' flood-color='#171923' flood-opacity='0.08'/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width='1200' height='630' fill='#F8F7F3' />
  <rect x='20' y='20' width='1160' height='590' rx='36' fill='#FFFFFF' stroke='#E4E2D8' stroke-width='2' />

  <!-- Left: Pure Text Information (Clean, high contrast, large typography) -->
  <g transform='translate(90, 0)'>
    <!-- Upper: Lead-in headline -->
    <text x='0' y='180' fill='#64748B' font-family="'Pretendard', -apple-system, sans-serif, 'Apple SD Gothic Neo'" font-size='32' font-weight='700' letter-spacing='-0.01em'>나의 '우리' 유형은</text>

    <!-- Center: Type Tag & Type Name -->
    <text x='0' y='260' fill='${c.tagColor}' font-family="'Pretendard', -apple-system, sans-serif, 'Apple SD Gothic Neo'" font-size='22' font-weight='800' letter-spacing='0.08em'>${c.pillText}</text>
    <text x='0' y='345' fill='#171923' font-family="'Pretendard', -apple-system, sans-serif, 'Apple SD Gothic Neo'" font-size='62' font-weight='900' letter-spacing='-0.03em'>${c.title}</text>

    <!-- Lower: Brand name -->
    <text x='0' y='490' fill='#94A3B8' font-family="'Pretendard', -apple-system, sans-serif, 'Apple SD Gothic Neo'" font-size='22' font-weight='700' letter-spacing='0.12em'>우리 유형 테스트</text>
  </g>

  <!-- Right: Archetype Representative Graphic Artwork -->
  <g filter='url(#shadow_${c.slug})'>
    <g clip-path='url(#artClip_${c.slug})'>
      <g transform='translate(640, 70) scale(1.3611111)'>
        ${svgInner}
      </g>
    </g>
    <rect x='640' y='70' width='490' height='490' rx='32' fill='none' stroke='#E4E2D8' stroke-width='1.5' />
  </g>
</svg>`;
}

async function run() {
  if (process.env.VERCEL === '1' || process.env.CI) {
    console.log('Detected Vercel/CI environment: Preserving pre-rendered static PNGs with native Korean fonts.');
    return;
  }

  const publicShareDir = path.resolve(__dirname, '../public/share');
  if (!fs.existsSync(publicShareDir)) fs.mkdirSync(publicShareDir, { recursive: true });

  const distShareDir = path.resolve(__dirname, '../dist/share');
  if (!fs.existsSync(distShareDir)) fs.mkdirSync(distShareDir, { recursive: true });

  for (const c of shareConfigs) {
    const svgStr = buildShareSvg(c);
    const pngBuf = await sharp(Buffer.from(svgStr)).png().toBuffer();

    // 1. Primary slug (share-type-01.png)
    fs.writeFileSync(path.join(publicShareDir, `share-${c.slug}.png`), pngBuf);
    fs.writeFileSync(path.join(distShareDir, `share-${c.slug}.png`), pngBuf);

    // 2. Cache-busting versioned slug (share-type-01-v2.png)
    fs.writeFileSync(path.join(publicShareDir, `share-${c.slug}-v2.png`), pngBuf);
    fs.writeFileSync(path.join(distShareDir, `share-${c.slug}-v2.png`), pngBuf);

    // 3. Legacy backwards-compatible slug (share-t1.png)
    fs.writeFileSync(path.join(publicShareDir, `share-${c.legacySlug}.png`), pngBuf);
    fs.writeFileSync(path.join(distShareDir, `share-${c.legacySlug}.png`), pngBuf);

    console.log(`Generated 1200x630 share images for ${c.title} (${c.slug})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
