const fs = require('fs');
const path = require('path');

const types = [
  {
    slug: 'type-01',
    legacySlug: 't1',
    id: 'type-1',
    typeTag: 'TYPE 01 · RED',
    title: '마주보는 정원사',
    subtitle: '익숙한 이들과 깊게 연결되는 우리',
    oneLine: '익숙한 관계를 소중히 여기며, 오랜 시간 신뢰와 유대감을 가꾸어가는 유형',
    detailedDescription: '당신은 익숙한 사람들과의 관계를 소중히 여기며, 얼굴을 마주하고 시간을 함께 보내는 관계에서 깊고 지속적인 연결을 가꾸는 편입니다. 이미 형성된 신뢰 속에서 안도감을 느끼며, 소수의 사람들과 단단한 유대를 만들어가는 것이 당신의 큰 강점입니다.',
    reflectionQuestion: '지금 내가 아끼는 울타리 바깥에는 어떤 사람들이 살아가고 있을까요?'
  },
  {
    slug: 'type-02',
    legacySlug: 't2',
    id: 'type-2',
    typeTag: 'TYPE 02 · BLUE',
    title: '연결망의 항해자',
    subtitle: '새로운 사람과 생각에 열린 우리',
    oneLine: '새로운 사람과 생각에 열린 태도로 다가가며 다양한 관계의 가능성을 탐색하는 유형',
    detailedDescription: '당신은 온라인 커뮤니티나 디지털 공간에서 다양한 사람과 생각을 접하며 새로운 관계의 가능성을 열어두는 편입니다. 물리적 거리에 얽매이지 않고 관심사와 취향을 중심으로 유연하게 연결되는 방식을 편안하게 느낍니다.',
    reflectionQuestion: '화면 너머에서 마음이 통했던 사람들과 현실에서 마주한다면 어떤 느낌일까요?'
  },
  {
    slug: 'type-03',
    legacySlug: 't3',
    id: 'type-3',
    typeTag: 'TYPE 03 · GREEN',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    oneLine: '새로운 만남에 열린 태도로 다가가며 깊은 유대감과 신뢰를 쌓아가는 유형',
    detailedDescription: '당신은 일상에서 충분한 연결감을 느끼면서도, 새로운 사람과 낯선 관점을 호기심을 갖고 적극적으로 마주하는 사람입니다. 온·오프라인 경계 없이 차이를 나누고 공감대를 넓혀가며 풍성한 관계의 지평을 개척합니다.',
    reflectionQuestion: '서로 다른 생각과 배경을 가진 사람들과 앞으로 어떤 의미 있는 이야기를 만들어가고 싶나요?'
  },
  {
    slug: 'type-04',
    legacySlug: 't4',
    id: 'type-4',
    typeTag: 'TYPE 04 · PURPLE',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    oneLine: '자신만의 관점과 속도를 소중히 여기며 관계에서도 적절한 거리를 유지하는 유형',
    detailedDescription: '당신은 무리한 소속감이나 관계 확장에 휘둘리지 않고, 자신만의 독립적인 시선과 적정 거리를 지키는 편입니다. 타인의 기대에 맞추기보다 내면의 고유한 호흡과 독립성을 존중할 때 가장 편안함을 느낍니다.',
    reflectionQuestion: '내가 가장 자연스럽고 온전하게 편안함을 느끼는 관계의 거리는 어느 정도인가요?'
  }
];

function buildPrerenderedHtml(c) {
  return `<div class="relative min-h-screen bg-[#F5F3EE] text-[#171923] flex flex-col items-center justify-center py-2 sm:py-6 selection:bg-[#E4E2D8] overflow-x-hidden font-sans cursor-pointer" onclick="try{sessionStorage.clear();localStorage.clear();}catch(e){};window.location.href='https://woori-type-test-v2.vercel.app';">
  <main class="w-full max-w-2xl min-h-screen sm:min-h-0 sm:my-auto relative z-10 transition-all duration-300">
    <a
      href="https://woori-type-test-v2.vercel.app"
      onclick="try{sessionStorage.clear();localStorage.clear();}catch(e){};window.location.href='https://woori-type-test-v2.vercel.app';"
      class="flex flex-col min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-6 text-[#171923] no-underline block cursor-pointer"
      title="화면을 터치하여 나도 테스트 시작하기"
    >
      <!-- 1. Type Title & Subtitle -->
      <header class="text-center space-y-1 pt-1">
        <span class="block text-[12px] font-bold text-[#64748B] tracking-[0.16em] uppercase font-sans">
          ${c.typeTag}
        </span>
        <h1 class="text-[32px] sm:text-[38px] font-extrabold text-[#171923] tracking-[-0.03em] leading-tight">
          ${c.title}
        </h1>
        <p class="text-[14.5px] font-semibold text-[#475569] tracking-tight">
          ${c.subtitle}
        </p>
      </header>

      <!-- 2. Existing Result Card Image -->
      <div class="flex flex-col items-center">
        <div class="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.02]">
          <img
            src="/cards/card-${c.id}.png"
            alt="${c.title} - ${c.subtitle}"
            class="w-full aspect-[3/5] object-contain rounded-3xl shadow-[0_16px_36px_-6px_rgba(23,25,35,0.12)] border border-[#E4E2D8] bg-white block"
          />
        </div>
        <p class="text-[12px] text-[#64748B] mt-2.5 font-medium tracking-tight">
          화면을 터치하면 테스트 첫 화면으로 이동합니다
        </p>
      </div>

      <!-- 3. One Line Summary -->
      <div class="bg-white border-l-4 border-[#171923] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80">
        <p class="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em]">
          ${c.oneLine}
        </p>
      </div>

      <!-- 4. Full Type Description -->
      <div class="bg-white rounded-2xl p-6 space-y-3 border border-[#E4E2D8] shadow-xs text-left">
        <h2 class="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
          유형 상세 설명
        </h2>
        <p class="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
          ${c.detailedDescription}
        </p>
      </div>

      <!-- 5. Reflection Question -->
      <div class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-2.5 shadow-xs text-left">
        <div class="flex items-center gap-2 text-amber-950 font-bold text-[14.5px]">
          <span class="text-amber-800 font-bold">💬</span>
          <span>생각해 볼 질문</span>
        </div>
        <p class="text-[15px] font-medium text-amber-950 leading-[1.6] pl-8 tracking-[-0.01em]">
          &ldquo;${c.reflectionQuestion}&rdquo;
        </p>
      </div>
    </a>
  </main>
  <script>
    document.addEventListener('click', function(e) {
      try { sessionStorage.clear(); localStorage.clear(); } catch(err) {}
      window.location.href = 'https://woori-type-test-v2.vercel.app';
    });
  </script>
</div>`;
}

function generateStaticResults() {
  const distIndexPath = path.resolve(__dirname, '../dist/index.html');
  const baseHtml = fs.existsSync(distIndexPath)
    ? fs.readFileSync(distIndexPath, 'utf8')
    : fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

  for (const c of types) {
    const pageTitle = `나의 우리유형은 '${c.title}' | 우리유형 테스트`;
    const ogTitle = `나의 우리유형은 '${c.title}'`;
    const ogDesc = '여섯 개의 질문으로 알아보는 나의 우리유형';
    const ogImage = `https://woori-type-test-v2.vercel.app/woori-${c.slug}.png?v=2`;
    const pageUrl = `https://woori-type-test-v2.vercel.app/result/${c.slug}`;

    let pageHtml = baseHtml;

    // 1. Replace Title
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

    // 2. Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${ogDesc}" />`
    );

    // 3. Replace OG Tags
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${ogTitle}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${ogDesc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image" content="${ogImage}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:image:width"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image:width" content="1200" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image:height" content="630" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${pageUrl}" />`
    );

    if (!pageHtml.includes('property="og:url"')) {
      pageHtml = pageHtml.replace(
        /(<meta property="og:image"[^>]*>)/i,
        `$1\n    <meta property="og:url" content="${pageUrl}" />`
      );
    }

    // 4. Replace Twitter Tags
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${ogTitle}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${ogDesc}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:image" content="${ogImage}" />`
    );

    // 5. Pre-render Content into <div id="root">
    const prerendered = buildPrerenderedHtml(c);
    pageHtml = pageHtml.replace(
      /<div id="root"><\/div>/i,
      `<div id="root">${prerendered}</div>`
    );

    // 6. Write to /result/${c.slug}/index.html and /result/${c.slug}.html (Primary & Legacy routes)
    const targets = [c.slug, c.legacySlug];
    for (const targetSlug of targets) {
      // 1) Folder with index.html
      const distTargetDir = path.resolve(__dirname, `../dist/result/${targetSlug}`);
      if (!fs.existsSync(distTargetDir)) fs.mkdirSync(distTargetDir, { recursive: true });
      fs.writeFileSync(path.join(distTargetDir, 'index.html'), pageHtml);

      const publicTargetDir = path.resolve(__dirname, `../public/result/${targetSlug}`);
      if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true });
      fs.writeFileSync(path.join(publicTargetDir, 'index.html'), pageHtml);

      // 2) Direct file /result/${targetSlug}.html (for cleanUrls support on Vercel/Static CDNs)
      const distResultDir = path.resolve(__dirname, '../dist/result');
      if (!fs.existsSync(distResultDir)) fs.mkdirSync(distResultDir, { recursive: true });
      fs.writeFileSync(path.join(distResultDir, `${targetSlug}.html`), pageHtml);

      const publicResultDir = path.resolve(__dirname, '../public/result');
      if (!fs.existsSync(publicResultDir)) fs.mkdirSync(publicResultDir, { recursive: true });
      fs.writeFileSync(path.join(publicResultDir, `${targetSlug}.html`), pageHtml);
    }

    console.log(`Generated static result page for /result/${c.slug} & /result/${c.legacySlug} (${c.title})`);
  }

  // 7. Generate static HTML files for SPA sub-routes (/admin, /display, /verify)
  const spaRoutes = ['admin', 'display', 'verify'];
  for (const route of spaRoutes) {
    const distRouteDir = path.resolve(__dirname, `../dist/${route}`);
    if (!fs.existsSync(distRouteDir)) fs.mkdirSync(distRouteDir, { recursive: true });
    fs.writeFileSync(path.join(distRouteDir, 'index.html'), baseHtml);

    const publicRouteDir = path.resolve(__dirname, `../public/${route}`);
    if (!fs.existsSync(publicRouteDir)) fs.mkdirSync(publicRouteDir, { recursive: true });
    fs.writeFileSync(path.join(publicRouteDir, 'index.html'), baseHtml);

    fs.writeFileSync(path.resolve(__dirname, `../dist/${route}.html`), baseHtml);
    fs.writeFileSync(path.resolve(__dirname, `../public/${route}.html`), baseHtml);
    console.log(`Generated static HTML for /${route}`);
  }
}

generateStaticResults();
