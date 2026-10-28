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
    reason: '얼굴을 마주하고 함께하는 시간 속에서 깊은 유대감과 편안함을 느끼며 지속적인 신뢰를 쌓아갑니다.',
    reflectionQuestion: '지금 내가 아끼는 울타리 바깥에는 어떤 사람들이 살아가고 있을까요?'
  },
  {
    slug: 'type-02',
    legacySlug: 't2',
    id: 'type-2',
    typeTag: 'TYPE 02 · BLUE',
    title: '연결망의 항해자',
    subtitle: '온라인으로 연결되는 우리',
    oneLine: '물리적 거리와 상관없이 취향과 생각으로 언제 어디서나 이어지는 관계',
    detailedDescription: '당신은 온라인 커뮤니티나 디지털 공간에서 다양한 사람과 생각을 접하며 새로운 관계의 가능성을 열어두는 편입니다. 물리적 거리에 얽매이지 않고 관심사와 취향을 중심으로 유연하게 연결되는 방식을 편안하게 느낍니다.',
    reason: '화면 너머 다양한 사람과 생각을 향해 열려 있으며, 취향과 관심사를 중심으로 유연하게 관계를 맺습니다.',
    reflectionQuestion: '화면 너머에서 마음이 통했던 사람들과 현실에서 마주한다면 어떤 느낌일까요?'
  },
  {
    slug: 'type-03',
    legacySlug: 't3',
    id: 'type-3',
    typeTag: 'TYPE 03 · GREEN',
    title: '다리를 놓는 탐험가',
    subtitle: '새로운 만남에 열린 우리',
    oneLine: '다양한 사람들과의 만남 속에서 새로운 생각과 가능성을 기꺼이 받아들이는 관계',
    detailedDescription: '당신은 일상에서 충분한 연결감을 느끼면서도, 새로운 사람과 낯선 관점을 호기심을 갖고 적극적으로 마주하는 사람입니다. 온·오프라인 경계 없이 차이를 나누고 공감대를 넓혀가며 풍성한 관계의 지평을 개척합니다.',
    reason: '새로운 사람들과의 만남 속에서 차이를 마주하고 새로운 생각과 지평을 기꺼이 확장해 나갑니다.',
    reflectionQuestion: '서로 다른 생각과 배경을 가진 사람들과 앞으로 어떤 의미 있는 이야기를 만들어가고 싶나요?'
  },
  {
    slug: 'type-04',
    legacySlug: 't4',
    id: 'type-4',
    typeTag: 'TYPE 04 · PURPLE',
    title: '고요한 등대',
    subtitle: '나만의 속도로 관계 맺는 우리',
    oneLine: '서로의 독립된 공간과 고유한 템포를 존중하며 편안하게 지속되는 관계',
    detailedDescription: '당신은 무리한 소속감이나 관계 확장에 휘둘리지 않고, 자신만의 독립적인 시선과 적정 거리를 지키는 편입니다. 타인의 기대에 맞추기보다 내면의 고유한 호흡과 독립성을 존중할 때 가장 편안함을 느낍니다.',
    reason: '나만의 독립된 시선과 편안한 거리를 지키며, 서로의 고유한 템포를 존중할 때 깊은 안정을 느낍니다.',
    reflectionQuestion: '내가 가장 자연스럽고 온전하게 편안함을 느끼는 관계의 거리는 어느 정도인가요?'
  }
];

function buildPrerenderedHtml(c) {
  return `<div class="relative min-h-screen bg-[#F5F3EE] text-[#171923] flex flex-col items-center justify-center py-4 sm:py-8 selection:bg-[#E4E2D8] overflow-x-hidden font-sans">
  <main class="w-full max-w-xl px-4 sm:px-6 py-6 sm:py-10 animate-fadeIn relative z-10 space-y-7 text-[#171923]">
    
    <!-- 1. Shared Result Welcome Banner -->
    <div class="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-center space-y-2.5 shadow-xs">
      <div class="flex items-center justify-center gap-1.5">
        <span class="text-amber-600 font-bold">✨</span>
        <p class="text-xs sm:text-sm font-bold text-amber-950">친구가 공유한 테스트 결과입니다</p>
      </div>
      <p class="text-[12.5px] text-amber-800 leading-relaxed max-w-md mx-auto">
        나는 어떤 &lsquo;우리&rsquo;에 속해 있을까요? 6개의 질문을 통해 지금 나의 관계 리듬을 발견해 보세요.
      </p>
      <a
        href="https://woori-type-test-v2.vercel.app"
        onclick="try{sessionStorage.clear();localStorage.clear();}catch(e){}"
        class="mt-1 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#007CC3] text-white text-[13.5px] font-semibold hover:bg-[#0066A0] transition-all shadow-sm active:scale-95 no-underline"
      >
        <span>나도 테스트하기 →</span>
      </a>
    </div>

    <!-- 2. Archetype Card Visual -->
    <section class="flex flex-col items-center text-center space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#E4E2D8] text-[#64748B] text-[11px] font-semibold tracking-widest uppercase shadow-2xs font-sans">
        <span>RELATIONSHIP ARCHETYPE</span>
      </div>

      <div class="w-64 sm:w-72 transition-transform duration-300 hover:scale-[1.01]">
        <div class="relative aspect-[9/16] w-full rounded-3xl overflow-hidden select-none shadow-[0_16px_36px_-6px_rgba(23,25,35,0.12)]">
          <img
            src="/cards/card-${c.id}.png"
            alt="${c.title} - ${c.subtitle}"
            class="w-full h-full object-cover block select-none"
            draggable="false"
          />
        </div>
      </div>

      <!-- Type Tag & Title & Subtitle -->
      <header class="space-y-1.5 pt-1">
        <span class="block text-[12px] font-bold text-[#64748B] tracking-[0.18em] uppercase font-mono">
          ${c.typeTag}
        </span>
        <h1 class="font-serif text-[32px] sm:text-[38px] font-bold text-[#000000] tracking-[-0.02em] leading-tight break-keep">
          ${c.title}
        </h1>
        <p class="font-serif text-[15px] sm:text-[16.5px] font-medium text-[#443E3B] tracking-[-0.01em]">
          ${c.subtitle}
        </p>
      </header>

      <!-- One Line Summary -->
      <div class="w-full bg-white border-l-4 border-[#007CC3] rounded-2xl p-5 text-center shadow-xs border border-[#E4E2D8]/80 mt-1">
        <p class="text-[15.5px] sm:text-[16.5px] font-medium text-[#171923] leading-snug tracking-[-0.01em] break-keep">
          &ldquo;${c.oneLine}&rdquo;
        </p>
      </div>
    </section>

    <!-- 3. Type Description -->
    <section class="space-y-4">
      <div class="bg-white rounded-2xl p-6 space-y-3 border border-[#E4E2D8] shadow-xs text-left">
        <h2 class="text-[12px] font-bold uppercase tracking-wider text-[#64748B] font-sans">
          관계를 맺는 방식
        </h2>
        <p class="text-[15px] sm:text-[16px] text-[#334155] leading-[1.7] break-keep font-normal tracking-[-0.01em]">
          ${c.detailedDescription}
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 space-y-2.5 border border-[#E4E2D8] shadow-xs text-left">
        <div class="flex items-center gap-2 text-[#171923] font-bold text-[14.5px]">
          <span class="text-[#007CC3]">✨</span>
          <span>연결감을 느끼는 순간과 성향</span>
        </div>
        <p class="text-[14.5px] text-[#475569] leading-[1.65] break-keep pl-6 font-normal tracking-[-0.01em]">
          ${c.reason}
        </p>
      </div>

      <div class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-2.5 shadow-xs text-left">
        <div class="flex items-center gap-2 text-amber-950 font-bold text-[14.5px]">
          <span class="text-amber-800">💬</span>
          <span>관계에 대해 생각해 볼 질문</span>
        </div>
        <p class="font-serif text-[15.5px] font-semibold text-amber-950 leading-[1.6] pl-6 tracking-[-0.01em] break-keep">
          &ldquo;${c.reflectionQuestion}&rdquo;
        </p>
      </div>
    </section>

    <!-- 4. Prominent Bottom CTA -->
    <footer class="pt-2 pb-6 flex flex-col items-center gap-3">
      <a
        href="https://woori-type-test-v2.vercel.app"
        onclick="try{sessionStorage.clear();localStorage.clear();}catch(e){}"
        class="w-full max-w-sm inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-[15.5px] shadow-[0_6px_20px_rgba(0,102,204,0.32)] transition-all no-underline"
      >
        <span>나도 테스트하기 →</span>
      </a>
      <span class="text-[11.5px] text-[#888888] font-sans">
        약 1분 소요 · 총 6문항 · 로그인 없이 바로 시작
      </span>
    </footer>
  </main>
</div>`;
}

function generateStaticResults() {
  const distIndexPath = path.resolve(__dirname, '../dist/index.html');
  const baseHtml = fs.existsSync(distIndexPath)
    ? fs.readFileSync(distIndexPath, 'utf8')
    : fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

  for (const c of types) {
    const pageTitle = `나의 '우리' 유형: ${c.title} - 우리 유형 테스트 | MY 'WE' ARCHETYPE TEST`;
    const ogTitle = `나의 '우리' 유형: ${c.title}`;
    const ogDesc = `${c.subtitle} | ${c.oneLine}`;
    const ogImage = `https://woori-type-test-v2.vercel.app/cards/share-${c.slug}.png?v=3`;
    const pageUrl = `https://woori-type-test-v2.vercel.app/result/${c.slug}`;

    let pageHtml = baseHtml;

    // 1. Replace Title
    pageHtml = pageHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${pageTitle}</title>`
    );

    // 2. Replace Description
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
      `<meta property="og:image:width" content="600" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image:height" content="1000" />`
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
