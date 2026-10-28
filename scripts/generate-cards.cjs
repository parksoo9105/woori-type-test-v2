const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const cards = [
  {
    id: 'type-1',
    svgFile: 'type-01-face-to-face.svg',
    pillText: 'TYPE 01 · RED',
    pillWidth: 104,
    pillBg: 'rgba(0,0,0,0.25)',
    pillBorder: 'rgba(255,255,255,0.3)',
    pillTextCol: '#FFFFFF',
    tagColor: '#FF654F',
    title: '마주보는 정원사',
    subtitle: '익숙한 이들과 깊게 연결되는 우리',
    descLine1: '익숙한 관계를 소중히 여기며,',
    descLine2: '오랜 시간 신뢰와 유대감을 가꾸어가는 유형'
  },
  {
    id: 'type-2',
    svgFile: 'type-02-online.svg',
    pillText: 'TYPE 02 · BLUE',
    pillWidth: 106,
    pillBg: 'rgba(0,0,0,0.25)',
    pillBorder: 'rgba(255,255,255,0.3)',
    pillTextCol: '#FFFFFF',
    tagColor: '#4169E1',
    title: '연결망의 항해자',
    subtitle: '온라인으로 연결되는 우리',
    descLine1: '새로운 사람과 생각에 열린 태도로 다가가며',
    descLine2: '다양한 관계의 가능성을 탐색하는 유형'
  },
  {
    id: 'type-3',
    svgFile: 'type-03-open.svg',
    pillText: 'TYPE 03 · GREEN',
    pillWidth: 116,
    pillBg: 'rgba(26,46,18,0.20)',
    pillBorder: 'rgba(26,46,18,0.25)',
    pillTextCol: '#1a2e12',
    tagColor: '#658E1B',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    descLine1: '새로운 만남에 열린 태도로 다가가며',
    descLine2: '깊은 유대감과 신뢰를 쌓아가는 유형'
  },
  {
    id: 'type-4',
    svgFile: 'type-04-own-pace.svg',
    pillText: 'TYPE 04 · PURPLE',
    pillWidth: 122,
    pillBg: 'rgba(0,0,0,0.25)',
    pillBorder: 'rgba(255,255,255,0.3)',
    pillTextCol: '#FFFFFF',
    tagColor: '#8064D8',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    descLine1: '자신만의 관점과 속도를 소중히 여기며',
    descLine2: '관계에서도 적절한 거리를 유지하는 유형'
  }
];

function buildPosterSvg(c) {
  const rawSvg = fs.readFileSync(path.join(__dirname, '../src/assets/abstract', c.svgFile), 'utf8');
  // Extract inner SVG children
  const match = rawSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const svgInner = match ? match[1] : '';

  const pillX = 344 - c.pillWidth;
  const pillCenterX = pillX + c.pillWidth / 2;

  return `<svg width="600" height="1000" viewBox="0 0 600 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="cardFrameClip_${c.id}">
      <rect x="4" y="4" width="592" height="992" rx="36" ry="36" />
    </clipPath>
    <clipPath id="innerArtworkClip_${c.id}">
      <rect x="36" y="36" width="528" height="704" rx="24" ry="24" />
    </clipPath>
  </defs>

  <!-- Outer Card Frame (White Card with clean rounded border) -->
  <rect x="4" y="4" width="592" height="992" rx="36" fill="#FFFFFF" stroke="#E4E2D8" stroke-width="2" />

  <!-- Inner Artwork Box (From assets/abstract SVG asset) -->
  <g clip-path="url(#innerArtworkClip_${c.id})">
    <g transform="translate(36, 36) scale(1.46666667)">
      ${svgInner}

      <!-- Top-Right Category Pill -->
      <g>
        <rect x="${pillX}" y="16" width="${c.pillWidth}" height="26" rx="13" fill="${c.pillBg}" stroke="${c.pillBorder}" stroke-width="1" />
        <text x="${pillCenterX}" y="33.5" fill="${c.pillTextCol}" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.05em" text-anchor="middle">
          ${c.pillText}
        </text>
      </g>
    </g>
  </g>

  <!-- Archetype Info on White Card Body -->
  <!-- 1. Category Tag -->
  <text x="40" y="784" fill="${c.tagColor}" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="15" font-weight="800" letter-spacing="0.08em">
    ${c.pillText}
  </text>
  
  <!-- 2. Archetype Main Title -->
  <text x="40" y="828" fill="#171923" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="30" font-weight="800" letter-spacing="-0.03em">
    ${c.title}
  </text>
  
  <!-- 3. Archetype Subtitle -->
  <text x="40" y="868" fill="#475569" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="18" font-weight="700" letter-spacing="-0.01em">
    ${c.subtitle}
  </text>

  <!-- 4. Archetype Description (2 lines) -->
  <text x="40" y="915" fill="#64748B" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="16.5" font-weight="500" letter-spacing="-0.01em">
    ${c.descLine1}
  </text>
  <text x="40" y="944" fill="#64748B" font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" font-size="16.5" font-weight="500" letter-spacing="-0.01em">
    ${c.descLine2}
  </text>
</svg>`;
}

async function run() {
  const publicCardsDir = path.resolve(__dirname, '../public/cards');
  const assetsCardsDir = path.resolve(__dirname, '../src/assets/cards');
  const previewDir = '/Users/nabi-psy/.gemini/antigravity/brain/8e0dfb23-e205-468b-9ce4-8056b2ca2f16';

  if (!fs.existsSync(publicCardsDir)) fs.mkdirSync(publicCardsDir, { recursive: true });
  if (!fs.existsSync(assetsCardsDir)) fs.mkdirSync(assetsCardsDir, { recursive: true });

  for (const c of cards) {
    const svgStr = buildPosterSvg(c);
    const pngBuf = await sharp(Buffer.from(svgStr)).png().toBuffer();

    // 1. Write to public/cards/card-type-X.png and public/cards/type-X.png
    fs.writeFileSync(path.join(publicCardsDir, `card-${c.id}.png`), pngBuf);
    fs.writeFileSync(path.join(publicCardsDir, `${c.id}.png`), pngBuf);

    // 2. Write to src/assets/cards/card-type-X.png
    fs.writeFileSync(path.join(assetsCardsDir, `card-${c.id}.png`), pngBuf);

    // 3. Write to brain directory for artifact preview
    fs.writeFileSync(path.join(previewDir, `poster-card-${c.id}.png`), pngBuf);

    console.log(`Generated and saved poster card ${c.id} (${c.title})`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
