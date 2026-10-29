// ==========================================================================
// VinhBaPhone Mock Database - Products, Categories, Promos & Banners
// 100% Model-Matched Product Images + Studio SVG Fallback Engine
// ==========================================================================

// Bespoke Studio Product SVG Generator (100% Model & Brand Matched)
window.generateExactProductSvgDataUri = function(category = '', name = '', brand = '') {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const b = (brand || '').toUpperCase() || (
    n.includes('iphone') || n.includes('ipad') || n.includes('macbook') || n.includes('airpods') || n.includes('apple') ? 'APPLE' :
    n.includes('samsung') || n.includes('galaxy') ? 'SAMSUNG' :
    n.includes('xiaomi') || n.includes('redmi') || n.includes('poco') ? 'XIAOMI' :
    n.includes('oppo') || n.includes('reno') ? 'OPPO' :
    n.includes('vivo') ? 'VIVO' :
    n.includes('realme') ? 'REALME' :
    n.includes('asus') || n.includes('rog') || n.includes('tuf') ? 'ASUS' :
    n.includes('lenovo') || n.includes('legion') || n.includes('thinkpad') || n.includes('loq') ? 'LENOVO' :
    n.includes('dell') || n.includes('xps') || n.includes('inspiron') ? 'DELL' :
    n.includes('hp') || n.includes('victus') ? 'HP' :
    n.includes('acer') || n.includes('nitro') ? 'ACER' :
    n.includes('msi') ? 'MSI' :
    n.includes('sony') || n.includes('playstation') || n.includes('ps5') ? 'SONY' :
    n.includes('marshall') ? 'MARSHALL' :
    n.includes('jbl') ? 'JBL' :
    n.includes('garmin') ? 'GARMIN' :
    n.includes('huawei') ? 'HUAWEI' :
    n.includes('roborock') ? 'ROBOROCK' :
    n.includes('dreame') ? 'DREAME' :
    n.includes('anker') ? 'ANKER' :
    n.includes('baseus') ? 'BASEUS' :
    n.includes('ugreen') ? 'UGREEN' :
    n.includes('nintendo') || n.includes('switch') ? 'NINTENDO' :
    n.includes('sandisk') ? 'SANDISK' :
    n.includes('kingston') ? 'KINGSTON' :
    n.includes('lg') ? 'LG' :
    n.includes('logitech') ? 'LOGITECH' :
    n.includes('keychron') ? 'KEYCHRON' : 'VINHBAPHONE'
  );

  // Clean model title for studio label
  const cleanTitle = (name || 'Sản phẩm chính hãng')
    .replace(/Chính Hãng|VN\/A|Mới Nhất|Cực Phẩm|Siêu Mỏng|Chống Ồn|Độc Đáo/gi, '')
    .trim();
  const line1 = cleanTitle.slice(0, 26);
  const line2 = cleanTitle.slice(26, 54);

  // Pick realistic device color palette from product name
  let bodyFill = '#1e293b';
  let bodyStroke = '#475569';
  let accentColor = '#2563eb';
  let screenGrad1 = '#0f172a';
  let screenGrad2 = '#1e3a8a';

  if (n.includes('sa mạc') || n.includes('desert') || n.includes('vàng') || n.includes('gold') || n.includes('starlight') || n.includes('ánh sao') || n.includes('cream')) {
    bodyFill = '#d6c5b3'; bodyStroke = '#b49a7e'; accentColor = '#b45309'; screenGrad1 = '#292524'; screenGrad2 = '#78350f';
  } else if (n.includes('hồng') || n.includes('pink') || n.includes('rose')) {
    bodyFill = '#f4cfd6'; bodyStroke = '#e199a8'; accentColor = '#e11d48'; screenGrad1 = '#4c0519'; screenGrad2 = '#9f1239';
  } else if (n.includes('tím') || n.includes('lavender') || n.includes('purple') || n.includes('lilac')) {
    bodyFill = '#d8b4fe'; bodyStroke = '#a855f7'; accentColor = '#7c3aed'; screenGrad1 = '#2e1065'; screenGrad2 = '#5b21b6';
  } else if (n.includes('xanh') || n.includes('blue') || n.includes('mint') || n.includes('ultramarine') || n.includes('cyan') || n.includes('green')) {
    bodyFill = '#93c5fd'; bodyStroke = '#3b82f6'; accentColor = '#0284c7'; screenGrad1 = '#082f49'; screenGrad2 = '#0369a1';
  } else if (n.includes('trắng') || n.includes('white') || n.includes('bạc') || n.includes('silver')) {
    bodyFill = '#e2e8f0'; bodyStroke = '#94a3b8'; accentColor = '#2563eb'; screenGrad1 = '#0f172a'; screenGrad2 = '#334155';
  } else if (n.includes('xám') || n.includes('titan') || n.includes('grey') || n.includes('gray')) {
    bodyFill = '#64748b'; bodyStroke = '#475569'; accentColor = '#38bdf8'; screenGrad1 = '#0f172a'; screenGrad2 = '#1e293b';
  } else if (n.includes('cam') || n.includes('orange')) {
    bodyFill = '#fb923c'; bodyStroke = '#ea580c'; accentColor = '#ea580c'; screenGrad1 = '#431407'; screenGrad2 = '#9a3412';
  }

  let illustration = '';

  // 1. FOLDABLE PHONES (Z Fold / Z Flip / Find N3 Flip)
  if (n.includes('z fold') || n.includes('fold')) {
    illustration = `
      <!-- Galaxy Z Fold Unfolded Book-Style Dual Screen -->
      <rect x="85" y="55" width="112" height="175" rx="12" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
      <rect x="197" y="55" width="112" height="175" rx="12" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
      <rect x="92" y="62" width="210" height="161" rx="8" fill="url(#scrGrad)"/>
      <line x1="197" y1="58" x2="197" y2="227" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      <circle cx="150" cy="140" r="38" fill="rgba(56,189,248,0.22)"/>
      <circle cx="235" cy="135" r="44" fill="rgba(168,85,247,0.25)"/>
      <text x="197" y="140" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16">GALAXY AI</text>
      <text x="197" y="160" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-weight="600" font-size="10">7.6" Dynamic AMOLED 2X</text>
    `;
  } else if (n.includes('z flip') || n.includes('flip')) {
    illustration = `
      <!-- Clamshell Flip Phone -->
      <rect x="128" y="48" width="144" height="92" rx="16" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
      <rect x="128" y="142" width="144" height="92" rx="16" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
      <rect x="132" y="136" width="136" height="8" rx="4" fill="#334155"/>
      <!-- Flex Window Cover Screen -->
      <rect x="140" y="60" width="120" height="68" rx="10" fill="url(#scrGrad)"/>
      <text x="200" y="95" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="800" font-size="14">10:45</text>
      <text x="200" y="112" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-weight="700" font-size="9">FLEX WINDOW</text>
      <!-- Dual Cameras -->
      <circle cx="154" cy="162" r="10" fill="#0f172a" stroke="#fff" stroke-width="2"/>
      <circle cx="178" cy="162" r="10" fill="#0f172a" stroke="#fff" stroke-width="2"/>
    `;
  }
  // 2. SMARTPHONES (iPhone, S24 Ultra, Xiaomi, OPPO, vivo, realme, ROG Phone, Nokia)
  else if (c === 'phone' || (c === 'used' && (n.includes('iphone') || n.includes('galaxy') || n.includes('xiaomi')))) {
    const isUltra = n.includes('s24 ultra') || n.includes('s23 ultra');
    const isIphonePro = n.includes('iphone') && n.includes('pro');
    const isLeica = n.includes('xiaomi 14 ultra') || n.includes('leica');
    const isRog = n.includes('rog phone');
    const rx = isUltra ? '8' : '22';
    illustration = `
      <!-- Back Phone Body -->
      <rect x="115" y="45" width="120" height="195" rx="${rx}" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
      ${isLeica ? `
        <circle cx="175" cy="105" r="42" fill="#0f172a" stroke="#d4af37" stroke-width="3"/>
        <circle cx="160" cy="92" r="9" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
        <circle cx="190" cy="92" r="9" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
        <circle cx="160" cy="118" r="9" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
        <circle cx="190" cy="118" r="9" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
        <text x="175" y="108" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-weight="900" font-size="8">LEICA</text>
      ` : isUltra ? `
        <circle cx="138" cy="70" r="10" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="138" cy="95" r="10" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="138" cy="120" r="10" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="160" cy="82" r="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="160" cy="107" r="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- S-Pen Stylus -->
        <rect x="92" y="65" width="8" height="165" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      ` : isIphonePro ? `
        <rect x="124" y="54" width="56" height="56" rx="14" fill="rgba(15,23,42,0.18)" stroke="${bodyStroke}" stroke-width="1.5"/>
        <circle cx="139" cy="69" r="11" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="139" cy="95" r="11" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="164" cy="82" r="11" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      ` : isRog ? `
        <polygon points="125,55 175,55 185,95 125,95" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
        <text x="175" y="155" text-anchor="middle" fill="#ef4444" font-family="sans-serif" font-weight="900" font-size="15">ROG</text>
      ` : `
        <rect x="124" y="54" width="48" height="56" rx="12" fill="#0f172a" stroke="${bodyStroke}" stroke-width="2"/>
        <circle cx="140" cy="70" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="140" cy="94" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      `}
      <!-- Overlapping Front Display -->
      <rect x="175" y="52" width="118" height="190" rx="${rx}" fill="#0f172a" stroke="#334155" stroke-width="3"/>
      <rect x="181" y="58" width="106" height="178" rx="${isUltra ? '4' : '18'}" fill="url(#scrGrad)"/>
      <!-- Dynamic Island / Punch Hole -->
      <rect x="216" y="64" width="36" height="9" rx="4.5" fill="#000000"/>
      <text x="234" y="138" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="13">${b}</text>
      <text x="234" y="156" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-weight="700" font-size="9">120Hz OLED</text>
    `;
  }
  // 3. TABLETS & IPADS
  else if (c === 'tablet' || (c === 'used' && n.includes('ipad'))) {
    illustration = `
      <rect x="85" y="52" width="230" height="172" rx="16" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="4"/>
      <rect x="95" y="62" width="210" height="152" rx="10" fill="url(#scrGrad)"/>
      <circle cx="200" cy="138" r="45" fill="rgba(56,189,248,0.2)"/>
      <text x="200" y="135" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="18">${b}</text>
      <text x="200" y="155" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-weight="600" font-size="11">${line1.slice(0,22)}</text>
      <!-- Stylus Pen -->
      <line x1="115" y1="234" x2="285" y2="234" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/>
      <line x1="115" y1="234" x2="285" y2="234" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
    `;
  }
  // 4. LAPTOPS & MACBOOKS
  else if (c === 'laptop' || (c === 'used' && n.includes('macbook'))) {
    const isGaming = n.includes('gaming') || n.includes('tuf') || n.includes('rog') || n.includes('legion') || n.includes('loq') || n.includes('victus') || n.includes('nitro') || n.includes('cyborg') || n.includes('msi');
    illustration = `
      <!-- Laptop Lid & Display -->
      <rect x="82" y="55" width="236" height="148" rx="10" fill="#0f172a" stroke="${isGaming ? '#ef4444' : '#475569'}" stroke-width="3.5"/>
      <rect x="90" y="63" width="220" height="132" rx="6" fill="url(#scrGrad)"/>
      <!-- Notch / Webcam -->
      <rect x="182" y="63" width="36" height="6" rx="3" fill="#000"/>
      <text x="200" y="125" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="18">${b}</text>
      <text x="200" y="145" text-anchor="middle" fill="${isGaming ? '#f87171' : '#93c5fd'}" font-family="sans-serif" font-weight="700" font-size="11">${isGaming ? 'GAMING RTX SERIES' : 'PRO PERFORMANCE'}</text>
      <!-- Laptop Base -->
      <polygon points="55,203 345,203 360,220 40,220" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="2.5"/>
      <rect x="170" y="204" width="60" height="6" rx="3" fill="#334155"/>
      ${isGaming ? `<line x1="65" y1="221" x2="335" y2="221" stroke="#ec4899" stroke-width="3"/>` : ''}
    `;
  }
  // 5. AUDIO (Headphones, Earbuds, Speakers)
  else if (c === 'audio') {
    if (n.includes('loa') || n.includes('marshall') || n.includes('jbl') || n.includes('xb100') || n.includes('ult field')) {
      const isMarshall = n.includes('marshall');
      illustration = `
        <rect x="85" y="75" width="230" height="135" rx="${isMarshall ? '14' : '45'}" fill="#1e293b" stroke="${isMarshall ? '#d4af37' : accentColor}" stroke-width="4"/>
        <rect x="98" y="88" width="204" height="109" rx="${isMarshall ? '8' : '36'}" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <circle cx="145" cy="142" r="32" fill="#1e293b" stroke="${isMarshall ? '#d4af37' : '#38bdf8'}" stroke-width="3"/>
        <circle cx="255" cy="142" r="32" fill="#1e293b" stroke="${isMarshall ? '#d4af37' : '#38bdf8'}" stroke-width="3"/>
        <text x="200" y="148" text-anchor="middle" fill="${isMarshall ? '#f59e0b' : '#ffffff'}" font-family="serif" font-weight="900" font-size="18">${b}</text>
      `;
    } else if (n.includes('airpods pro') || n.includes('airpods 3') || n.includes('airpods 4') || n.includes('minor') || n.includes('soundpeats') || n.includes('true wireless')) {
      illustration = `
        <!-- Charging Case -->
        <rect x="125" y="95" width="150" height="115" rx="34" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="127" y1="138" x2="273" y2="138" stroke="#cbd5e1" stroke-width="2.5"/>
        <circle cx="200" cy="162" r="4" fill="#10b981"/>
        <!-- Left & Right Earbuds -->
        <circle cx="165" cy="72" r="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="153" y="78" width="10" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
        <circle cx="235" cy="72" r="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="237" y="78" width="10" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
      `;
    } else {
      // Over-ear ANC Headphones
      illustration = `
        <path d="M120,150 A80,80 0 0,1 280,150" fill="none" stroke="${bodyFill}" stroke-width="16" stroke-linecap="round"/>
        <ellipse cx="122" cy="165" rx="26" ry="38" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
        <ellipse cx="278" cy="165" rx="26" ry="38" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3"/>
        <text x="200" y="165" text-anchor="middle" fill="#334155" font-family="sans-serif" font-weight="900" font-size="14">${b}</text>
      `;
    }
  }
  // 6. SMARTWATCHES
  else if (c === 'watch') {
    const isRound = n.includes('garmin') || n.includes('galaxy watch') || n.includes('huawei watch gt');
    illustration = `
      <!-- Watch Strap -->
      <rect x="166" y="38" width="68" height="205" rx="14" fill="${accentColor}" stroke="#334155" stroke-width="2"/>
      ${isRound ? `
        <circle cx="200" cy="140" r="62" fill="${bodyFill}" stroke="#cbd5e1" stroke-width="5"/>
        <circle cx="200" cy="140" r="50" fill="url(#scrGrad)"/>
      ` : `
        <rect x="138" y="78" width="124" height="124" rx="30" fill="${bodyFill}" stroke="#cbd5e1" stroke-width="5"/>
        <rect x="148" y="88" width="104" height="104" rx="22" fill="url(#scrGrad)"/>
      `}
      <text x="200" y="135" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="20">09:41</text>
      <text x="200" y="155" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-weight="700" font-size="10">♥ 72 BPM • GPS</text>
    `;
  }
  // 7. SMARTHOME
  else if (c === 'smarthome') {
    if (n.includes('robot') || n.includes('roborock') || n.includes('dreame')) {
      illustration = `
        <circle cx="200" cy="145" r="72" fill="#f8fafc" stroke="#94a3b8" stroke-width="5"/>
        <circle cx="200" cy="145" r="56" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="200" cy="115" r="18" fill="#0f172a" stroke="${accentColor}" stroke-width="3"/>
        <text x="200" y="168" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="13">${b} AI</text>
      `;
    } else if (n.includes('camera') || n.includes('ezviz') || n.includes('c500')) {
      illustration = `
        <ellipse cx="200" cy="198" rx="48" ry="18" fill="#cbd5e1"/>
        <rect x="165" y="160" width="70" height="38" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="200" cy="120" r="52" fill="#ffffff" stroke="#94a3b8" stroke-width="3.5"/>
        <circle cx="200" cy="120" r="26" fill="#0f172a"/>
        <circle cx="200" cy="120" r="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      `;
    } else if (n.includes('khóa') || n.includes('lock')) {
      illustration = `
        <rect x="155" y="48" width="90" height="188" rx="18" fill="#0f172a" stroke="#475569" stroke-width="3.5"/>
        <circle cx="200" cy="88" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="200" y="135" text-anchor="middle" fill="#93c5fd" font-family="monospace" font-weight="700" font-size="13">1 2 3</text>
        <text x="200" y="155" text-anchor="middle" fill="#93c5fd" font-family="monospace" font-weight="700" font-size="13">4 5 6</text>
        <rect x="165" y="175" width="70" height="14" rx="7" fill="#334155"/>
      `;
    } else {
      // Air Purifier / Smart Lamp
      illustration = `
        <rect x="140" y="52" width="120" height="182" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3.5"/>
        <circle cx="200" cy="105" r="26" fill="#0f172a"/>
        <text x="200" y="110" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-weight="900" font-size="14">PM 008</text>
        <rect x="155" y="150" width="90" height="65" rx="8" fill="#e2e8f0"/>
      `;
    }
  }
  // 8. PC, MONITORS & GAMING CONSOLES
  else if (c === 'pc' || c === 'gaming') {
    if (n.includes('ps5') || n.includes('playstation')) {
      illustration = `
        <!-- PS5 Console & DualSense -->
        <path d="M125,52 Q145,45 165,52 L160,215 L130,215 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
        <rect x="138" y="56" width="14" height="158" rx="4" fill="#0f172a"/>
        <line x1="138" y1="65" x2="138" y2="180" stroke="#3b82f6" stroke-width="2"/>
        <!-- Controller -->
        <rect x="190" y="125" width="105" height="68" rx="28" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="222" cy="162" r="10" fill="#0f172a"/>
        <circle cx="262" cy="162" r="10" fill="#0f172a"/>
        <text x="242" y="112" text-anchor="middle" fill="#1e3a8a" font-family="sans-serif" font-weight="900" font-size="16">PS5 SLIM</text>
      `;
    } else if (n.includes('nintendo') || n.includes('switch')) {
      illustration = `
        <rect x="75" y="88" width="38" height="105" rx="16" fill="#06b6d4" stroke="#0891b2" stroke-width="2.5"/>
        <rect x="287" y="88" width="38" height="105" rx="16" fill="#f43f5e" stroke="#e11d48" stroke-width="2.5"/>
        <rect x="113" y="88" width="174" height="105" rx="6" fill="#0f172a" stroke="#334155" stroke-width="3"/>
        <rect x="122" y="96" width="156" height="89" rx="4" fill="url(#scrGrad)"/>
        <text x="200" y="145" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="15">SWITCH OLED</text>
      `;
    } else if (n.includes('tay cầm') || n.includes('controller') || n.includes('xbox')) {
      illustration = `
        <rect x="105" y="90" width="190" height="110" rx="45" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="4"/>
        <circle cx="155" cy="135" r="14" fill="#0f172a"/>
        <circle cx="245" cy="155" r="14" fill="#0f172a"/>
        <circle cx="200" cy="112" r="8" fill="#10b981"/>
      `;
    } else if (n.includes('bàn phím') || n.includes('keychron')) {
      illustration = `
        <rect x="70" y="95" width="260" height="95" rx="12" fill="#1e293b" stroke="#475569" stroke-width="3.5"/>
        <rect x="82" y="108" width="236" height="20" rx="4" fill="#334155"/>
        <rect x="82" y="135" width="236" height="20" rx="4" fill="#334155"/>
        <rect x="82" y="162" width="160" height="16" rx="4" fill="#ef4444"/>
      `;
    } else if (n.includes('chuột') || n.includes('logitech')) {
      illustration = `
        <rect x="152" y="62" width="96" height="158" rx="48" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
        <rect x="195" y="78" width="10" height="28" rx="5" fill="#38bdf8"/>
        <text x="200" y="165" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="16">G</text>
      `;
    } else {
      // Monitor / PC Display
      illustration = `
        <rect x="72" y="55" width="256" height="148" rx="8" fill="#0f172a" stroke="#334155" stroke-width="4"/>
        <rect x="80" y="63" width="240" height="132" rx="4" fill="url(#scrGrad)"/>
        <text x="200" y="128" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="18">${b}</text>
        <text x="200" y="148" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="700" font-size="11">ULTRA HD • 180Hz IPS</text>
        <rect x="186" y="203" width="28" height="24" fill="#475569"/>
        <rect x="140" y="225" width="120" height="8" rx="4" fill="#334155"/>
      `;
    }
  }
  // 9. STORAGE & ACCESSORIES
  else {
    if (c === 'storage' || n.includes('ssd') || n.includes('thẻ nhớ') || n.includes('usb')) {
      illustration = `
        <rect x="115" y="72" width="170" height="130" rx="18" fill="${bodyFill}" stroke="${accentColor}" stroke-width="4"/>
        <text x="200" y="132" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="20">${b}</text>
        <text x="200" y="156" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="800" font-size="12">HIGH-SPEED NVMe SSD</text>
      `;
    } else {
      // GaN Charger / Power Bank / MagSafe Case
      illustration = `
        <rect x="132" y="58" width="136" height="162" rx="22" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3.5"/>
        <rect x="152" y="78" width="96" height="44" rx="10" fill="#0f172a"/>
        <text x="200" y="106" text-anchor="middle" fill="#10b981" font-family="monospace" font-weight="900" font-size="18">⚡100%</text>
        <text x="200" y="168" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16">${b}</text>
        <text x="200" y="188" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-weight="700" font-size="10">FAST CHARGE PRO</text>
      `;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#eef2ff"/>
      </linearGradient>
      <linearGradient id="scrGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${screenGrad1}"/>
        <stop offset="100%" stop-color="${screenGrad2}"/>
      </linearGradient>
      <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.14"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="28" fill="url(#bgGrad)"/>
    <!-- Top Brand Pill -->
    <rect x="24" y="20" width="110" height="24" rx="12" fill="#0f172a"/>
    <text x="79" y="36" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="800" font-size="10">${b}</text>
    <rect x="276" y="20" width="100" height="24" rx="12" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
    <text x="326" y="36" text-anchor="middle" fill="#059669" font-family="sans-serif" font-weight="800" font-size="9.5">✓ CHÍNH HÃNG</text>
    <!-- Studio Illustration -->
    <g filter="url(#dropShadow)" transform="translate(0, 8)">
      ${illustration}
    </g>
    <!-- Bottom Model Label Plate -->
    <rect x="24" y="292" width="352" height="84" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="200" y="324" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="14.5">${line1}</text>
    <text x="200" y="346" text-anchor="middle" fill="#475569" font-family="sans-serif" font-weight="700" font-size="12.5">${line2 || 'Bảo hành 12 tháng • 1 đổi 1 30 ngày'}</text>
    <text x="200" y="365" text-anchor="middle" fill="#2563eb" font-family="sans-serif" font-weight="800" font-size="10">VINHBAPHONE AUTHORIZED RESELLER</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};

const APP_DATA = {
  storeLocations: [
    { city: "Hồ Chí Minh", count: "85 cửa hàng" },
    { city: "Hà Nội", count: "52 cửa hàng" },
    { city: "Đà Nẵng", count: "12 cửa hàng" },
    { city: "Bình Dương", count: "15 cửa hàng" },
    { city: "Hải Phòng", count: "8 cửa hàng" },
    { city: "Cần Thơ", count: "7 cửa hàng" },
    { city: "Đồng Nai", count: "9 cửa hàng" },
    { city: "Bà Rịa - Vũng Tàu", count: "6 cửa hàng" }
  ],

  categories: [
    {
        "id": "phone",
        "name": "Điện thoại",
        "icon": "📱",
        "subcategories": [
            "Apple iPhone",
            "Samsung Galaxy",
            "Xiaomi",
            "OPPO",
            "vivo",
            "realme",
            "ASUS ROG Phone",
            "Nokia"
        ]
    },
    {
        "id": "laptop",
        "name": "Laptop",
        "icon": "💻",
        "subcategories": [
            "MacBook",
            "ASUS Gaming",
            "Dell XPS & Inspiron",
            "Lenovo Legion & ThinkPad",
            "HP",
            "Acer",
            "MSI Gaming"
        ]
    },
    {
        "id": "tablet",
        "name": "Máy tính bảng",
        "icon": "📟",
        "subcategories": [
            "iPad Pro & Air",
            "Samsung Galaxy Tab",
            "Xiaomi Pad",
            "Lenovo Legion Tab",
            "Bút cảm ứng",
            "Bàn phím tablet"
        ]
    },
    {
        "id": "audio",
        "name": "Âm thanh",
        "icon": "🎧",
        "subcategories": [
            "Tai nghe Bluetooth",
            "Loa Bluetooth",
            "Tai nghe chụp tai",
            "Apple AirPods",
            "Marshall",
            "JBL",
            "Sony"
        ]
    },
    {
        "id": "watch",
        "name": "Đồng hồ thông minh",
        "icon": "⌚",
        "subcategories": [
            "Apple Watch",
            "Samsung Galaxy Watch",
            "Garmin",
            "Huawei Watch",
            "Vòng đeo tay thể thao"
        ]
    },
    {
        "id": "smarthome",
        "name": "Nhà thông minh",
        "icon": "🏠",
        "subcategories": [
            "Robot hút bụi Roborock",
            "Máy lọc không khí Xiaomi",
            "Camera an ninh 360",
            "Khóa cửa vân tay",
            "Đèn thông minh"
        ]
    },
    {
        "id": "accessories",
        "name": "Phụ kiện",
        "icon": "🔌",
        "subcategories": [
            "Củ sạc GaN Anker",
            "Pin dự phòng 100W",
            "Cáp sạc Type-C & Lightning",
            "Ốp lưng & Bao da",
            "Dán cường lực",
            "Hub chuyển đổi 8-in-1"
        ]
    },
    {
        "id": "pc",
        "name": "PC, Màn hình",
        "icon": "🖥️",
        "subcategories": [
            "Màn hình Gaming 180Hz",
            "Màn hình đồ họa UltraSharp",
            "Chuột & Bàn phím cơ",
            "PC Gaming RTX"
        ]
    },
    {
        "id": "gaming",
        "name": "Thiết bị Gaming",
        "icon": "🎮",
        "subcategories": [
            "PlayStation 5",
            "Nintendo Switch OLED",
            "Tay cầm Xbox",
            "Tai nghe Gaming"
        ]
    },
    {
        "id": "storage",
        "name": "Thiết bị Lưu trữ",
        "icon": "💾",
        "subcategories": [
            "Ổ cứng di động SSD",
            "Thẻ nhớ MicroSD tốc độ cao",
            "USB 3.2 Type-C"
        ]
    },
    {
        "id": "used",
        "name": "Máy cũ Like New 99%",
        "icon": "💎",
        "subcategories": [
            "iPhone Cũ Đẹp 99%",
            "MacBook Like New",
            "iPad Cũ Lướt",
            "Galaxy S Ultra Cũ 99%"
        ]
    },
    {
        "id": "tradein",
        "name": "Thu cũ đổi mới",
        "icon": "🔄",
        "subcategories": [
            "Lên đời iPhone 16",
            "Lên đời Galaxy S24 Ultra",
            "Trợ giá đến 4 triệu",
            "Định giá trong 5 phút"
        ]
    }
],

  heroSlides: [
    {
        "id": 1,
        "title": "iPhone 16 Pro Max",
        "subtitle": "Titan Sa Mạc cực phẩm • Trợ giá thu cũ 4 triệu",
        "tag": "HOT NHẤT MÙA",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
        "badge": "Titan Sa Mạc"
    },
    {
        "id": 2,
        "title": "Galaxy S24 Ultra AI",
        "subtitle": "Quyền năng Galaxy AI thế hệ mới • Đặt trước nhận quà 7 triệu",
        "tag": "MỚI RA MẮT",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
        "badge": "Quyền năng AI"
    },
    {
        "id": 3,
        "title": "MacBook Air M3 2024",
        "subtitle": "Sức mạnh tối thượng Apple Silicon • Pin 18 tiếng đỉnh cao",
        "tag": "CHÍNH HÃNG APPLE",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-inch-2024_1__3.png",
        "badge": "Mỏng nhẹ đỉnh cao"
    },
    {
        "id": 4,
        "title": "Sony WH-1000XM5",
        "subtitle": "Tai nghe chống ồn chủ động số 1 thế giới • Âm thanh Hi-Res",
        "tag": "HI-RES AUDIO",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-chup-tai-sony-wh-1000x-_2_.png",
        "badge": "Chống ồn đỉnh cao"
    }
],

  sideBanners: [
    {
        "id": "side-1",
        "title": "THU CŨ LÊN ĐỜI",
        "desc": "Trợ giá thu lại đến 4.000.000₫",
        "color": "#ffefe5",
        "accent": "#ea580c",
        "icon": "🔄"
    },
    {
        "id": "side-2",
        "title": "ĐẶC QUYỀN VINHMEMBER VIP",
        "desc": "Tích điểm hoàn tiền & Ưu đãi sinh nhật",
        "color": "#fdf2f8",
        "accent": "#db2777",
        "icon": "👑"
    },
    {
        "id": "side-3",
        "title": "TRẢ GÓP 0% LÃI SUẤT",
        "desc": "Kỳ hạn linh hoạt, duyệt hồ sơ 5 phút",
        "color": "#eff6ff",
        "accent": "#2563eb",
        "icon": "💳"
    }
],

  // Products Database (100% Exact Model Image Matches)
  products: [
    {
        "id": 101,
        "name": "iPhone 16 Pro Max 256GB - Titan Sa Mạc",
        "category": "phone",
        "brand": "Apple",
        "price": 33490000,
        "originalPrice": 34990000,
        "discountPercent": 4,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
        "rating": 5.0,
        "reviewsCount": 428,
        "isFlashSale": true,
        "soldCount": 46,
        "totalStock": 50,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 500k",
        "specs": {
            "screen": "6.9 inch Super Retina XDR OLED 120Hz ProMotion",
            "cpu": "Apple A18 Pro 3nm",
            "ram": "8 GB",
            "rom": "256 GB",
            "battery": "4.685 mAh, sạc nhanh MagSafe 25W",
            "camera": "Chính 48MP + Góc siêu rộng 48MP + Tele 5x 12MP"
        },
        "colors": [
            "Titan Sa Mạc",
            "Titan Tự Nhiên",
            "Titan Trắng",
            "Titan Đen"
        ],
        "storageOptions": [
            "256GB",
            "512GB",
            "1TB"
        ],
        "promoText": "Thu cũ đổi mới trợ giá 4 triệu • Tặng củ sạc nhanh 20W chính hãng"
    },
    {
        "id": 102,
        "name": "Samsung Galaxy S24 Ultra 5G 12GB 256GB",
        "category": "phone",
        "brand": "Samsung",
        "price": 25490000,
        "originalPrice": 31990000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
        "rating": 4.9,
        "reviewsCount": 315,
        "isFlashSale": true,
        "soldCount": 48,
        "totalStock": 50,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "6.8 inch Dynamic AMOLED 2X, 120Hz, 2600 nits, kính Corning Armor",
            "cpu": "Snapdragon 8 Gen 3 for Galaxy 4nm",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "5.000 mAh, sạc siêu nhanh 45W",
            "camera": "200MP + 50MP + 12MP + 10MP, Zoom quang 100x"
        },
        "colors": [
            "Xám Titan",
            "Đen Titan",
            "Tím Titan",
            "Vàng Titan"
        ],
        "storageOptions": [
            "256GB",
            "512GB",
            "1TB"
        ],
        "promoText": "Tặng Ốp lưng chính hãng • Giảm 1 triệu khi thanh toán qua VNPay"
    },
    {
        "id": 103,
        "name": "MacBook Air M3 13.6 inch 16GB 256GB - Midnight",
        "category": "laptop",
        "brand": "Apple",
        "price": 24790000,
        "originalPrice": 27990000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-inch-2024_1__3.png",
        "rating": 4.9,
        "reviewsCount": 185,
        "isFlashSale": true,
        "soldCount": 38,
        "totalStock": 40,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "13.6 inch Liquid Retina, độ sáng 500 nits True Tone",
            "cpu": "Apple M3 8 nhân CPU & 8 nhân GPU",
            "ram": "8 GB Unified Memory",
            "rom": "256 GB SSD siêu tốc",
            "battery": "Thời lượng pin lên đến 18 giờ liên tục",
            "camera": "1080p FaceTime HD camera"
        },
        "colors": [
            "Midnight",
            "Starlight",
            "Space Gray",
            "Silver"
        ],
        "storageOptions": [
            "256GB SSD",
            "512GB SSD"
        ],
        "promoText": "Tặng Balo cao cấp VinhBaPhone • Giảm thêm 400k cho Sinh Viên"
    },
    {
        "id": 104,
        "name": "Tai nghe Chụp tai Sony WH-1000XM5 Chống Ồn",
        "category": "audio",
        "brand": "Sony",
        "price": 6490000,
        "originalPrice": 8490000,
        "discountPercent": 24,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-chup-tai-sony-wh-1000x-_2_.png",
        "rating": 5.0,
        "reviewsCount": 142,
        "isFlashSale": true,
        "soldCount": 29,
        "totalStock": 30,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Cảm ứng trượt đa điểm trên earcup",
            "cpu": "Bộ xử lý kép V1 + HD Noise Cancelling QN1",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "30 giờ chơi nhạc khi bật ANC, sạc 3 phút nghe 3 giờ",
            "camera": "8 micro chống ồn định hướng chùm tia Precise Voice"
        },
        "colors": [
            "Đen Huyền Bí",
            "Bạc Bạch Kim",
            "Xanh Midnight"
        ],
        "storageOptions": [
            "WH-1000XM5"
        ],
        "promoText": "Tặng bao da chống sốc • Tặng tài khoản Spotify Premium 3 tháng"
    },
    {
        "id": 105,
        "name": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Dây Alpine",
        "category": "watch",
        "brand": "Apple",
        "price": 19690000,
        "originalPrice": 21990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-watch-ultra-2-49mm-vien-titan-day-alpine-loop-xanh-duong_1_.png",
        "rating": 5.0,
        "reviewsCount": 98,
        "isFlashSale": true,
        "soldCount": 22,
        "totalStock": 25,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "49mm Sapphire, độ sáng cực đại 3000 nits ngoài trời",
            "cpu": "Apple S9 SiP 64-bit lõi kép Neural Engine 4 nhân",
            "ram": "2 GB",
            "rom": "64 GB",
            "battery": "Lên đến 36 giờ (chế độ tiết kiệm pin 72 giờ)",
            "camera": "Cảm biến ECG, SpO2, đo độ sâu dưới nước 40m"
        },
        "colors": [
            "Titanium Tự Nhiên"
        ],
        "storageOptions": [
            "49mm GPS + Cellular"
        ],
        "promoText": "Tặng dây đeo thể thao dự phòng trị giá 990.000₫"
    },
    {
        "id": 106,
        "name": "iPad mini 7 128GB Wifi Chip A17 Pro Mới Nhất",
        "category": "tablet",
        "brand": "Apple",
        "price": 13490000,
        "originalPrice": 14990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-mini-7-2024-wifi-128gb_1_.png",
        "rating": 4.9,
        "reviewsCount": 84,
        "isFlashSale": true,
        "soldCount": 35,
        "totalStock": 40,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "8.3 inch Liquid Retina True Tone, dải màu P3",
            "cpu": "Apple A17 Pro 6 nhân hỗ trợ Apple Intelligence",
            "ram": "8 GB",
            "rom": "128 GB",
            "battery": "Lên đến 10 giờ lướt web xem video",
            "camera": "12MP Rộng sau + 12MP Siêu rộng trước Center Stage"
        },
        "colors": [
            "Xanh Dương",
            "Tím",
            "Ánh Sao",
            "Xám Không Gian"
        ],
        "storageOptions": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "promoText": "Hỗ trợ Apple Pencil Pro • Tặng củ sạc nhanh 20W chính hãng"
    },
    {
        "id": 201,
        "name": "Xiaomi 14 Ultra 16GB 512GB Camera Leica",
        "category": "phone",
        "brand": "Xiaomi",
        "price": 27990000,
        "originalPrice": 32990000,
        "discountPercent": 15,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1__2.png",
        "rating": 4.9,
        "reviewsCount": 96,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "6.73 inch LTPO AMOLED 120Hz WQHD+ 3000 nits",
            "cpu": "Qualcomm Snapdragon 8 Gen 3 4nm",
            "ram": "16 GB LPDDR5X",
            "rom": "512 GB UFS 4.0",
            "battery": "5.000 mAh, sạc có dây 90W, không dây 80W",
            "camera": "4 camera 50MP cảm biến 1 inch Leica Summilux"
        },
        "colors": [
            "Đen Da Thuần Chay",
            "Trắng Sứ"
        ],
        "storageOptions": [
            "512GB"
        ],
        "promoText": "Tặng Photography Kit chuyên nghiệp Leica trị giá 3.990.000₫"
    },
    {
        "id": 202,
        "name": "iPhone 15 128GB - Hồng Pastel",
        "category": "phone",
        "brand": "Apple",
        "price": 18790000,
        "originalPrice": 22990000,
        "discountPercent": 18,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-hong-1.png",
        "rating": 4.9,
        "reviewsCount": 480,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 250k",
        "specs": {
            "screen": "6.1 inch Super Retina XDR, Dynamic Island 2000 nits",
            "cpu": "Apple A16 Bionic 6 nhân",
            "ram": "6 GB",
            "rom": "128 GB",
            "battery": "3.349 mAh, sạc USB-C 20W",
            "camera": "48MP Dual Camera, Chân dung thế hệ mới"
        },
        "colors": [
            "Hồng Pastel",
            "Xanh Mint",
            "Vàng Nhạt",
            "Đen"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng dán màn hình cường lực Kingbull • Giảm 30% khi mua ốp lưng"
    },
    {
        "id": 203,
        "name": "OPPO Find N3 Flip 12GB 256GB Gập Độc Đáo",
        "category": "phone",
        "brand": "OPPO",
        "price": 18990000,
        "originalPrice": 22990000,
        "discountPercent": 17,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-n3-flip_1_.png",
        "rating": 4.8,
        "reviewsCount": 72,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "Chính 6.8 inch AMOLED 120Hz, Phụ 3.26 inch dọc tiện lợi",
            "cpu": "MediaTek Dimensity 9200",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "4.300 mAh, sạc siêu nhanh SUPERVOOC 44W",
            "camera": "Hasselblad 50MP + 48MP + 32MP Tele"
        },
        "colors": [
            "Hồng Thạch Anh",
            "Đen Hổ Phách",
            "Vàng Kim"
        ],
        "storageOptions": [
            "256GB"
        ],
        "promoText": "Gói bảo hành rơi vỡ 1 năm OPPO Care trị giá 2.5 triệu"
    },
    {
        "id": 204,
        "name": "Samsung Galaxy A55 5G 8GB 128GB Viền Kim Loại",
        "category": "phone",
        "brand": "Samsung",
        "price": 9290000,
        "originalPrice": 9990000,
        "discountPercent": 7,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a55_1_.png",
        "rating": 4.8,
        "reviewsCount": 215,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "6.6 inch Super AMOLED FHD+ 120Hz, kính Gorilla Glass Victus+",
            "cpu": "Exynos 1480 8 nhân (GPU AMD RDNA)",
            "ram": "8 GB",
            "rom": "128 GB",
            "battery": "5.000 mAh, sạc 25W",
            "camera": "50MP OIS + 12MP Góc siêu rộng + 5MP Macro"
        },
        "colors": [
            "Xanh Iceblue",
            "Tím Lilac",
            "Đen Navy"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng củ sạc Samsung 25W • Trợ giá thu cũ 1 triệu"
    },
    {
        "id": 205,
        "name": "iPhone 16 Plus 128GB - Xanh Lưu Ly (Ultramarine)",
        "category": "phone",
        "brand": "Apple",
        "price": 24990000,
        "originalPrice": 25990000,
        "discountPercent": 4,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-1.png",
        "rating": 5.0,
        "reviewsCount": 168,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "6.7 inch Super Retina XDR OLED, Dynamic Island 2000 nits",
            "cpu": "Apple A18 Bionic tiến trình 3nm tối tân",
            "ram": "8 GB",
            "rom": "128 GB",
            "battery": "Thời lượng xem video lên đến 27 giờ",
            "camera": "Fusion 48MP + Góc siêu rộng 12MP chụp Macro"
        },
        "colors": [
            "Xanh Lưu Ly",
            "Hồng Thạch Anh",
            "Xanh Mòng Két",
            "Trắng",
            "Đen"
        ],
        "storageOptions": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "promoText": "Thu cũ đổi mới trợ giá 3 triệu • Tặng sạc MagSafe 15W"
    },
    {
        "id": 206,
        "name": "Samsung Galaxy S24 Plus 5G 12GB 256GB AI",
        "category": "phone",
        "brand": "Samsung",
        "price": 19990000,
        "originalPrice": 26990000,
        "discountPercent": 26,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxy-s24-plus-tim.png",
        "rating": 4.9,
        "reviewsCount": 118,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 350k",
        "specs": {
            "screen": "6.7 inch Dynamic AMOLED 2X QHD+ 120Hz 2600 nits",
            "cpu": "Exynos 2400 10 nhân đồ họa Xclipse 940",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "4.900 mAh, sạc siêu tốc 45W",
            "camera": "50MP Dual Pixel OIS + 12MP Góc rộng + 10MP Tele 3x"
        },
        "colors": [
            "Tím Cobalt",
            "Vàng Amber",
            "Đen Onyx",
            "Xám Marble"
        ],
        "storageOptions": [
            "256GB",
            "512GB"
        ],
        "promoText": "Trợ giá thu cũ 2.5 triệu • Tặng sạc 45W Samsung chính hãng"
    },
    {
        "id": 207,
        "name": "Samsung Galaxy Z Fold6 5G 12GB 256GB Galaxy AI",
        "category": "phone",
        "brand": "Samsung",
        "price": 38990000,
        "originalPrice": 43990000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6-xam-1.png",
        "rating": 5.0,
        "reviewsCount": 94,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 600k",
        "specs": {
            "screen": "Màn chính 7.6 inch Dynamic AMOLED 2X 120Hz, Màn phụ 6.3 inch",
            "cpu": "Qualcomm Snapdragon 8 Gen 3 for Galaxy",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "4.400 mAh, sạc nhanh 25W",
            "camera": "50MP OIS + 12MP Ultra-wide + 10MP Tele 3x"
        },
        "colors": [
            "Lavender",
            "Xám Metal",
            "Xanh Navy"
        ],
        "storageOptions": [
            "256GB",
            "512GB",
            "1TB"
        ],
        "promoText": "Tặng Ốp kèm S-Pen chính hãng • Gói Samsung Care+ rơi vỡ 1 năm"
    },
    {
        "id": 208,
        "name": "Samsung Galaxy Z Flip6 5G 12GB 256GB Nhỏ Gọn",
        "category": "phone",
        "brand": "Samsung",
        "price": 23990000,
        "originalPrice": 28990000,
        "discountPercent": 17,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-flip-6-xanh-1.png",
        "rating": 4.9,
        "reviewsCount": 86,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "Màn chính 6.7 inch FHD+ 120Hz, Màn phụ Flex Window 3.4 inch",
            "cpu": "Snapdragon 8 Gen 3 for Galaxy",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "4.000 mAh, sạc 25W",
            "camera": "50MP Dual Pixel OIS + 12MP Ultra-wide"
        },
        "colors": [
            "Hồng Pastel Pink",
            "Xanh Mint",
            "Xám Silver"
        ],
        "storageOptions": [
            "256GB",
            "512GB"
        ],
        "promoText": "Tặng ốp lưng Flipsuit thông minh • Trợ giá thu cũ 3 triệu"
    },
    {
        "id": 209,
        "name": "iPhone 13 128GB - Thiết Kế Sang Trọng Bền Bỉ",
        "category": "phone",
        "brand": "Apple",
        "price": 13490000,
        "originalPrice": 15990000,
        "discountPercent": 16,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png",
        "rating": 4.9,
        "reviewsCount": 540,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "6.1 inch Super Retina XDR OLED True Tone",
            "cpu": "Apple A15 Bionic 6 nhân mượt mà",
            "ram": "4 GB",
            "rom": "128 GB",
            "battery": "3.240 mAh, hỗ trợ sạc MagSafe 15W",
            "camera": "Kép 12MP chống rung cảm biến Sensor-shift"
        },
        "colors": [
            "Trắng Ánh Sao",
            "Đen Midnight",
            "Xanh Green",
            "Hồng Pink"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng củ sạc 20W chính hãng • Giảm 50% dán kính cường lực"
    },
    {
        "id": 210,
        "name": "Xiaomi Redmi Note 13 6GB 128GB Màn AMOLED 120Hz",
        "category": "phone",
        "brand": "Xiaomi",
        "price": 4290000,
        "originalPrice": 4890000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_redmi_note_13_6gb_128gb_-_1.png",
        "rating": 4.8,
        "reviewsCount": 350,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "6.67 inch AMOLED FHD+ 120Hz viền siêu mỏng",
            "cpu": "Snapdragon 685 6nm tiết kiệm điện",
            "ram": "6 GB (Mở rộng RAM +6GB)",
            "rom": "128 GB",
            "battery": "5.000 mAh, sạc nhanh 33W",
            "camera": "108MP siêu nét 3X In-sensor Zoom + 8MP + 2MP"
        },
        "colors": [
            "Đen Bán Dạ",
            "Xanh Băng Tuyết",
            "Vàng Hoàng Hôn"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng củ sạc nhanh 33W và ốp lưng zin trong hộp"
    },
    {
        "id": 211,
        "name": "Xiaomi Redmi Note 13 Pro+ 5G 12GB 256GB Camera 200MP",
        "category": "phone",
        "brand": "Xiaomi",
        "price": 8990000,
        "originalPrice": 9990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-plus_1_.png",
        "rating": 4.9,
        "reviewsCount": 115,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "6.67 inch AMOLED 1.5K 120Hz cong 3D 3000 nits, chuẩn IP68/IP69K",
            "cpu": "Snapdragon 7s Gen 3 4nm",
            "ram": "12 GB",
            "rom": "256 GB",
            "battery": "6.200 mAh Silicon-Carbon, sạc HyperCharge 90W",
            "camera": "200MP OIS Light Hunter 800 + 50MP Tele 2.5x + 8MP Góc rộng"
        },
        "colors": [
            "Xanh Ngọc Bích",
            "Trắng Sứ",
            "Đen Huyền Vũ"
        ],
        "storageOptions": [
            "256GB",
            "512GB"
        ],
        "promoText": "Kháng nước chuẩn IP68/IP69K • Tặng củ sạc 90W kèm máy"
    },
    {
        "id": 212,
        "name": "OPPO Reno10 Pro+ 5G 12GB 256GB Kính Tiềm Vọng",
        "category": "phone",
        "brand": "OPPO",
        "price": 12990000,
        "originalPrice": 14990000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno10-pro-plus-tim.png",
        "rating": 4.8,
        "reviewsCount": 88,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 250k",
        "specs": {
            "screen": "6.74 inch 1.5K AMOLED 120Hz cong 3D rực rỡ",
            "cpu": "Qualcomm Snapdragon 8+ Gen 1 4nm",
            "ram": "12 GB LPDDR5",
            "rom": "256 GB",
            "battery": "4.700 mAh, sạc siêu tốc SUPERVOOC 100W",
            "camera": "64MP Tele tiềm vọng OIS 3x + 50MP Sony IMX890 OIS + 8MP"
        },
        "colors": [
            "Tím Thạch Anh",
            "Xám Ánh Trăng"
        ],
        "storageOptions": [
            "256GB"
        ],
        "promoText": "Tặng sạc SUPERVOOC 100W • Trả góp 0% duyệt 5 phút"
    },
    {
        "id": 251,
        "name": "iPad Pro M4 11 inch Wifi 256GB Tandem OLED Space Black",
        "category": "tablet",
        "brand": "Apple",
        "price": 27990000,
        "originalPrice": 28990000,
        "discountPercent": 3,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-m4-11-inch-1.png",
        "rating": 5.0,
        "reviewsCount": 135,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "11 inch Ultra Retina XDR Tandem OLED, 120Hz ProMotion, 1600 nits",
            "cpu": "Apple M4 9 nhân CPU, 10 nhân GPU, độ mỏng 5.3mm",
            "ram": "8 GB Unified Memory",
            "rom": "256 GB",
            "battery": "Lên đến 10 giờ lướt web Wi-Fi",
            "camera": "12MP Rộng + Cảm biến LiDAR Scanner"
        },
        "colors": [
            "Đen Không Gian",
            "Bạc Silver"
        ],
        "storageOptions": [
            "256GB",
            "512GB",
            "1TB"
        ],
        "promoText": "Giảm thêm 500k khi mua kèm Bút Apple Pencil Pro • Trợ giá thu cũ 2 triệu"
    },
    {
        "id": 252,
        "name": "Samsung Galaxy Tab S9 FE 5G 6GB 128GB Bút S-Pen",
        "category": "tablet",
        "brand": "Samsung",
        "price": 9490000,
        "originalPrice": 11990000,
        "discountPercent": 21,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-s9-fe_1_.png",
        "rating": 4.8,
        "reviewsCount": 92,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "10.9 inch LCD 90Hz WQXGA sắc nét, chuẩn kháng nước IP68",
            "cpu": "Exynos 1380 8 nhân mạnh mẽ",
            "ram": "6 GB",
            "rom": "128 GB (Hỗ trợ thẻ nhớ MicroSD 1TB)",
            "battery": "8.000 mAh, sạc nhanh 45W",
            "camera": "8MP sau + 12MP góc siêu rộng trước"
        },
        "colors": [
            "Xám Tự Nhiên",
            "Xanh Nhiệt Đới",
            "Bạc"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng bút S-Pen kháng nước IP68 trong hộp • Bao da bàn phím giảm 40%"
    },
    {
        "id": 253,
        "name": "iPad Air 6 11 inch M2 128GB Wifi Starlight",
        "category": "tablet",
        "brand": "Apple",
        "price": 15490000,
        "originalPrice": 16990000,
        "discountPercent": 9,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-6-m2-11-inch_1_.png",
        "rating": 4.9,
        "reviewsCount": 160,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "11 inch Liquid Retina True Tone, dải màu rộng P3",
            "cpu": "Apple M2 8 nhân CPU & 9 nhân GPU",
            "ram": "8 GB Unified Memory",
            "rom": "128 GB",
            "battery": "Thời lượng pin suốt ngày dài 10 tiếng",
            "camera": "12MP trước ngang với tính năng Center Stage"
        },
        "colors": [
            "Xanh Dương",
            "Tím",
            "Ánh Sao",
            "Xám Không Gian"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng gói dán màn hình Paperlike vẽ tranh • Trả góp 0%"
    },
    {
        "id": 254,
        "name": "iPad Gen 10 10.9 inch Wifi 64GB - Blue",
        "category": "tablet",
        "brand": "Apple",
        "price": 9290000,
        "originalPrice": 10990000,
        "discountPercent": 15,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-10-9-inch-2022.png",
        "rating": 4.8,
        "reviewsCount": 410,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "10.9 inch Liquid Retina sắc nét với True Tone",
            "cpu": "Apple A14 Bionic 6 nhân mượt mà",
            "ram": "4 GB",
            "rom": "64 GB",
            "battery": "Lướt web xem video liên tục 10 tiếng",
            "camera": "12MP Sau + 12MP Ultra-wide Ngang Center Stage"
        },
        "colors": [
            "Bạc Silver",
            "Xanh Blue",
            "Hồng Pink",
            "Vàng Yellow"
        ],
        "storageOptions": [
            "64GB",
            "256GB"
        ],
        "promoText": "Tặng bao da thông minh gấp gập • Mua Apple Pencil USB-C giảm 300k"
    },
    {
        "id": 255,
        "name": "Samsung Galaxy Tab S9+ 5G 12GB 256GB Kèm Bút S-Pen",
        "category": "tablet",
        "brand": "Samsung",
        "price": 11990000,
        "originalPrice": 13990000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-s9-plus-1.png",
        "rating": 4.9,
        "reviewsCount": 65,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 250k",
        "specs": {
            "screen": "11.2 inch Dynamic LCD 90Hz WQXGA, kháng nước IP68",
            "cpu": "Exynos 1580 8 nhân hiệu năng cao",
            "ram": "8 GB",
            "rom": "128 GB (hỗ trợ thẻ MicroSD 1.5TB)",
            "battery": "8.500 mAh, sạc nhanh 45W",
            "camera": "13MP sau + 12MP trước góc rộng"
        },
        "colors": [
            "Xám Moonstone",
            "Xanh Nhiệt Đới",
            "Bạc"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng bút S-Pen thế hệ mới • Bao da bàn phím giảm 50%"
    },
    {
        "id": 256,
        "name": "Samsung Galaxy Tab A9+ Wifi 4GB 64GB Màn 90Hz",
        "category": "tablet",
        "brand": "Samsung",
        "price": 4490000,
        "originalPrice": 5490000,
        "discountPercent": 18,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-a9-plus.png",
        "rating": 4.7,
        "reviewsCount": 185,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "11.0 inch TFT LCD 90Hz WUXGA sống động",
            "cpu": "Qualcomm Snapdragon 695 5G",
            "ram": "4 GB",
            "rom": "64 GB (hỗ trợ thẻ nhớ MicroSD)",
            "battery": "7.040 mAh, sạc 15W",
            "camera": "8MP sau + 5MP trước"
        },
        "colors": [
            "Đen Graphite",
            "Bạc Ánh Kim",
            "Xanh Hải Quân"
        ],
        "storageOptions": [
            "64GB",
            "128GB"
        ],
        "promoText": "Tặng củ sạc nhanh Samsung 15W • Miễn phí cài đặt ứng dụng học tập"
    },
    {
        "id": 257,
        "name": "Xiaomi Redmi Pad Pro 6GB 128GB Màn 12.1 inch 120Hz",
        "category": "tablet",
        "brand": "Xiaomi",
        "price": 6490000,
        "originalPrice": 7490000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-pad-pro_1_.png",
        "rating": 4.8,
        "reviewsCount": 98,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 120k",
        "specs": {
            "screen": "12.1 inch 2.5K 120Hz Dolby Vision 600 nits",
            "cpu": "Snapdragon 7s Gen 2 4nm mạnh mẽ",
            "ram": "6 GB LPDDR4X",
            "rom": "128 GB UFS 2.2",
            "battery": "10.000 mAh siêu khủng, sạc nhanh 33W",
            "camera": "8MP sau + 8MP trước góc rộng"
        },
        "colors": [
            "Xám Titan",
            "Xanh Biển"
        ],
        "storageOptions": [
            "128GB",
            "256GB"
        ],
        "promoText": "Tặng bao da gập dựng thông minh trị giá 450.000₫"
    },
    {
        "id": 258,
        "name": "Lenovo Legion Tab Y700 12GB 256GB Màn 144Hz Gaming",
        "category": "tablet",
        "brand": "Lenovo",
        "price": 9990000,
        "originalPrice": 11490000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-lenovo-legion-y700-2023.png",
        "rating": 4.9,
        "reviewsCount": 62,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "8.8 inch 2.5K 144Hz PureSight Gaming 500 nits",
            "cpu": "Snapdragon 8+ Gen 1 tản nhiệt buồng hơi Legion ColdFront",
            "ram": "12 GB LPDDR5X",
            "rom": "256 GB UFS 3.1",
            "battery": "6.550 mAh, sạc nhanh 45W 2 cổng Type-C",
            "camera": "13MP + 2MP sau, 8MP trước"
        },
        "colors": [
            "Storm Grey"
        ],
        "storageOptions": [
            "256GB"
        ],
        "promoText": "Tặng Ốp lưng tản nhiệt Legion • 2 cổng Type-C cắm sạc khi chơi game"
    },
    {
        "id": 301,
        "name": "Laptop ASUS TUF Gaming A15 FA506NCG Ryzen 7 RTX 3050",
        "category": "laptop",
        "brand": "ASUS",
        "price": 23490000,
        "originalPrice": 26990000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_9_14.png",
        "rating": 4.9,
        "reviewsCount": 156,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "15.6 inch FHD IPS 144Hz Adaptive-Sync chống chói",
            "cpu": "AMD Ryzen 7 7435HS (8 nhân 16 luồng) + NVIDIA RTX 3050",
            "ram": "16 GB DDR5 4800MHz (Nâng cấp tối đa 64GB)",
            "rom": "512 GB SSD NVMe PCIe Gen 4",
            "battery": "90WHrs siêu trâu, sạc nhanh Type-C 100W",
            "camera": "720P HD camera"
        },
        "colors": [
            "Mecha Gray"
        ],
        "storageOptions": [
            "512GB SSD"
        ],
        "promoText": "Tặng Balo TUF Gaming + Chuột ASUS Gaming M3 trị giá 990k"
    },
    {
        "id": 302,
        "name": "Laptop Lenovo Legion 5 15IRX10 i7-13650HX RTX 4060",
        "category": "laptop",
        "brand": "Lenovo",
        "price": 34990000,
        "originalPrice": 38990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_902_1.png",
        "rating": 5.0,
        "reviewsCount": 84,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 500k",
        "specs": {
            "screen": "15.6 inch WQXGA (2560x1600) IPS 165Hz 100% sRGB",
            "cpu": "Intel Core i7-14650HX 16 nhân 24 luồng",
            "ram": "16 GB DDR5 5600MHz",
            "rom": "1 TB SSD PCIe Gen 4",
            "battery": "80Wh, sạc siêu tốc 230W",
            "camera": "FHD 1080p có E-shutter che webcam vật lý"
        },
        "colors": [
            "Storm Grey"
        ],
        "storageOptions": [
            "1TB SSD"
        ],
        "promoText": "Tặng Balo Legion cao cấp + Chuột Gaming Legion M300"
    },
    {
        "id": 303,
        "name": "Laptop Dell Inspiron 14 5440 Core i5-1334U 16GB 512GB",
        "category": "laptop",
        "brand": "Dell",
        "price": 17990000,
        "originalPrice": 19490000,
        "discountPercent": 8,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_29.png",
        "rating": 4.8,
        "reviewsCount": 86,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "14.0 inch FHD+ (1920x1200) WVA tỉ lệ 16:10 chống lóa",
            "cpu": "Intel Core 5 120U 10 nhân 12 luồng up to 5.0 GHz",
            "ram": "16 GB DDR5 5200MHz",
            "rom": "512 GB SSD M.2 PCIe",
            "battery": "4-cell 54Wh",
            "camera": "FHD RGB camera tích hợp micro kép"
        },
        "colors": [
            "Bạc Platinum"
        ],
        "storageOptions": [
            "512GB SSD"
        ],
        "promoText": "Bảo hành tận nơi 12 tháng Dell ProSupport • Tặng túi chống sốc"
    },
    {
        "id": 304,
        "name": "MacBook Pro 14 inch Apple M3 / M4 Pro Space Black",
        "category": "laptop",
        "brand": "Apple",
        "price": 47990000,
        "originalPrice": 49990000,
        "discountPercent": 4,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook_1__7_5.png",
        "rating": 5.0,
        "reviewsCount": 92,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 600k",
        "specs": {
            "screen": "14.2 inch Liquid Retina XDR, 120Hz ProMotion, 1600 nits peak",
            "cpu": "Apple M-Series Pro SiP 10 nhân CPU 14 nhân GPU",
            "ram": "16 GB Unified Memory",
            "rom": "512 GB SSD siêu tốc 6GB/s",
            "battery": "Pin 18 giờ liên tục, sạc MagSafe 3 70W",
            "camera": "1080p FaceTime HD camera, 6 loa Spatial Audio"
        },
        "colors": [
            "Space Black (Đen Không Gian)",
            "Silver (Bạc)"
        ],
        "storageOptions": [
            "512GB SSD",
            "1TB SSD"
        ],
        "promoText": "Tặng Balo chống sốc Tomtoc cao cấp • Trợ giá thu cũ lên đời 3 triệu"
    },
    {
        "id": 305,
        "name": "MacBook Air M2 13.6 inch 16GB/256GB Starlight",
        "category": "laptop",
        "brand": "Apple",
        "price": 22490000,
        "originalPrice": 24990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-2022-starlight.png",
        "rating": 4.9,
        "reviewsCount": 310,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "13.6 inch Liquid Retina 500 nits True Tone",
            "cpu": "Apple M2 8 nhân CPU & 8 nhân GPU",
            "ram": "16 GB Unified Memory đa nhiệm vượt trội",
            "rom": "256 GB SSD",
            "battery": "Thời lượng pin 18 tiếng, sạc MagSafe 3",
            "camera": "1080p FaceTime HD"
        },
        "colors": [
            "Midnight",
            "Starlight",
            "Space Gray",
            "Silver"
        ],
        "storageOptions": [
            "256GB SSD",
            "512GB SSD"
        ],
        "promoText": "Giảm thêm 500.000₫ cho Học sinh - Sinh viên • Tặng túi chống sốc"
    },
    {
        "id": 306,
        "name": "Laptop ASUS ROG Zephyrus G16 OLED Gaming Siêu Mỏng",
        "category": "laptop",
        "brand": "ASUS",
        "price": 49990000,
        "originalPrice": 54990000,
        "discountPercent": 9,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_945_1_28.png",
        "rating": 5.0,
        "reviewsCount": 46,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 700k",
        "specs": {
            "screen": "16 inch 2.5K OLED 240Hz ROG Nebula 0.2ms 100% DCI-P3 G-Sync",
            "cpu": "Intel Core Ultra 9 185H tích hợp Intel AI Boost NPU",
            "ram": "32 GB LPDDR5X 7467MHz",
            "rom": "1 TB SSD PCIe Gen 4",
            "battery": "90WHrs 4-cell, sạc Type-C 100W",
            "camera": "1080p FHD IR hỗ trợ Windows Hello mở khóa khuôn mặt"
        },
        "colors": [
            "Platinum White",
            "Eclipse Gray"
        ],
        "storageOptions": [
            "1TB SSD"
        ],
        "promoText": "Tặng Balo ROG Ranger + Chuột ROG Gladius III Wireless trị giá 2.5 triệu"
    },
    {
        "id": 307,
        "name": "Laptop Lenovo LOQ 15 Ryzen 7 RTX 4050 16GB",
        "category": "laptop",
        "brand": "Lenovo",
        "price": 20990000,
        "originalPrice": 23990000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_8_16.png",
        "rating": 4.8,
        "reviewsCount": 142,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "15.6 inch FHD IPS 144Hz 100% sRGB G-Sync",
            "cpu": "AMD Ryzen 7 7435HS 8 nhân 16 luồng",
            "ram": "16 GB DDR5 4800MHz (2 khe rời)",
            "rom": "512 GB SSD NVMe M.2",
            "battery": "60Wh hỗ trợ sạc nhanh Rapid Charge Pro",
            "camera": "HD 720p có E-shutter che webcam"
        },
        "colors": [
            "Luna Grey"
        ],
        "storageOptions": [
            "512GB SSD"
        ],
        "promoText": "Tặng Balo Lenovo Gaming + Chuột Legion Gaming M300"
    },
    {
        "id": 308,
        "name": "Laptop Lenovo ThinkPad E14 Gen 7 Core Ultra 16GB",
        "category": "laptop",
        "brand": "Lenovo",
        "price": 19490000,
        "originalPrice": 21990000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_59.png",
        "rating": 4.9,
        "reviewsCount": 78,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "14.0 inch WUXGA (1920x1200) IPS 300 nits chống chói MIL-STD-810H",
            "cpu": "Intel Core Ultra 5 125H AI NPU",
            "ram": "16 GB DDR5 5600MHz",
            "rom": "512 GB SSD M.2 PCIe Gen 4",
            "battery": "57Wh, bàn phím gõ êm số 1 thế giới chống tràn nước",
            "camera": "FHD 1080p với Privacy Shutter"
        },
        "colors": [
            "Đen ThinkPad Truyền Thống"
        ],
        "storageOptions": [
            "512GB SSD"
        ],
        "promoText": "Bảo hành 24 tháng chính hãng tận nơi Lenovo Premier Support"
    },
    {
        "id": 309,
        "name": "Laptop Dell XPS 13 Core Ultra 7 OLED Màn Vô Cực",
        "category": "laptop",
        "brand": "Dell",
        "price": 43990000,
        "originalPrice": 47990000,
        "discountPercent": 8,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_945_1__1_9_1.png",
        "rating": 5.0,
        "reviewsCount": 52,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 500k",
        "specs": {
            "screen": "13.4 inch 3K+ OLED cảm ứng viền siêu mỏng InfinityEdge 500 nits",
            "cpu": "Intel Core Ultra 7 155H 16 nhân 22 luồng tích hợp NPU",
            "ram": "32 GB LPDDR5X 7467MHz",
            "rom": "1 TB SSD NVMe PCIe Gen 4",
            "battery": "55Wh thời lượng pin đến 18 giờ, sạc Type-C 60W",
            "camera": "1080p FHD RGB-IR Camera hỗ trợ Windows Hello"
        },
        "colors": [
            "Bạc Platinum",
            "Đen Graphite"
        ],
        "storageOptions": [
            "1TB SSD"
        ],
        "promoText": "Bảo hành tận nơi 24 tháng Dell ProSupport Plus • Tặng chuột Dell Wireless"
    },
    {
        "id": 401,
        "name": "Tai nghe Apple AirPods Pro 2 Type-C MagSafe Case",
        "category": "audio",
        "brand": "Apple",
        "price": 5390000,
        "originalPrice": 6190000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_1_.png",
        "rating": 5.0,
        "reviewsCount": 380,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Cảm ứng vuốt chạm điều chỉnh âm lượng trên thân tai nghe",
            "cpu": "Chip Apple H2 âm thanh thích ứng thế hệ mới",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "6 giờ nghe một lần sạc, 30 giờ cùng hộp sạc MagSafe Type-C",
            "camera": "Micro kép chùm tia lọc gió và chống ồn chủ động gấp 2 lần"
        },
        "colors": [
            "Trắng"
        ],
        "storageOptions": [
            "Type-C MagSafe"
        ],
        "promoText": "Tặng Ốp bảo vệ Elago trị giá 350.000₫ • Khắc tên miễn phí"
    },
    {
        "id": 402,
        "name": "Loa Bluetooth Marshall Stanmore III Chính Hãng ASH",
        "category": "audio",
        "brand": "Marshall",
        "price": 8990000,
        "originalPrice": 10490000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-marshall-stanmore-iii-ksp-1.png",
        "rating": 5.0,
        "reviewsCount": 115,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "Bảng điều khiển cơ học cổ điển núm xoay đồng thau",
            "cpu": "Bộ khuếch đại Class D tổng công suất 80W uy lực",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Cắm điện trực tiếp 100-240V, dải tần 45-20.000Hz",
            "camera": "Bluetooth 5.2, cổng RCA, Jack 3.5mm"
        },
        "colors": [
            "Black and Brass",
            "Cream",
            "Brown"
        ],
        "storageOptions": [
            "80W Phân Phối ASH"
        ],
        "promoText": "Bảo hành 12 tháng 1 đổi 1 từ ASH Vietnam • Tặng kèm dây AUX mạ vàng"
    },
    {
        "id": 403,
        "name": "Loa Bluetooth Marshall Acton III Nhỏ Gọn Cực Chất",
        "category": "audio",
        "brand": "Marshall",
        "price": 6490000,
        "originalPrice": 7290000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-marshall-acton-iii-ksp.png",
        "rating": 4.9,
        "reviewsCount": 94,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "Núm vặn chỉnh Bass, Treble, Volume analog",
            "cpu": "1 loa Woofer 30W + 2 loa Tweeter 15W Class D",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Cắm nguồn điện trực tiếp, công suất 60W",
            "camera": "Bluetooth 5.2 kết nối đa nguồn phát"
        },
        "colors": [
            "Black",
            "Cream",
            "Brown"
        ],
        "storageOptions": [
            "Acton III Standard"
        ],
        "promoText": "Tặng túi nỉ bảo vệ Marshall • Bảo hành chính hãng ASH 12 tháng"
    },
    {
        "id": 404,
        "name": "Loa Bluetooth Marshall Emberton II Âm Thanh 360°",
        "category": "audio",
        "brand": "Marshall",
        "price": 4290000,
        "originalPrice": 4990000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-marshall-emberton-ksp_1_1.png",
        "rating": 5.0,
        "reviewsCount": 165,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "Nút đồng điều hướng joystick đa chiều",
            "cpu": "2 củ loa toàn dải 2 inch 10W và 2 màng cộng hưởng thụ động",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "30+ giờ chơi nhạc di động, kháng nước bụi IP67",
            "camera": "Chế độ Stack Mode ghép nối nhiều loa cùng lúc"
        },
        "colors": [
            "Black and Brass",
            "Cream"
        ],
        "storageOptions": [
            "Emberton II 360°"
        ],
        "promoText": "Tặng cáp sạc Type-C bọc dù cao cấp + Túi đựng chống sốc"
    },
    {
        "id": 405,
        "name": "Tai nghe True Wireless Marshall Minor IV Chính Hãng",
        "category": "audio",
        "brand": "Marshall",
        "price": 3290000,
        "originalPrice": 3690000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-bluetooth-marshall-minor-4-logo.jpg",
        "rating": 4.9,
        "reviewsCount": 128,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "N/A",
            "cpu": "Driver dynamic 12mm tinh chỉnh âm sắc Marshall",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "30 giờ chơi nhạc (7 giờ tai nghe + 23 giờ hộp sạc)",
            "camera": "Bluetooth 5.3 LE Audio, cảm ứng chạm đa điểm"
        },
        "colors": [
            "Đen Họa Tiết Da"
        ],
        "storageOptions": [
            "Minor IV Standard"
        ],
        "promoText": "Bảo hành 1 đổi 1 trong 12 tháng từ nhà phân phối ASH Vietnam"
    },
    {
        "id": 406,
        "name": "Tai nghe Chụp tai Sony WH-CH720N Chống Ồn Siêu Nhẹ",
        "category": "audio",
        "brand": "Sony",
        "price": 2490000,
        "originalPrice": 2990000,
        "discountPercent": 17,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_379_1_7.png",
        "rating": 4.8,
        "reviewsCount": 110,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "N/A",
            "cpu": "Bộ xử lý tích hợp V1 chống ồn đỉnh cao của Sony",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Lên đến 35 giờ (bật NC), sạc nhanh 3 phút dùng 60 phút",
            "camera": "Trọng lượng siêu nhẹ chỉ 192g, micro đàm thoại rõ nét"
        },
        "colors": [
            "Đen",
            "Trắng Kem",
            "Xanh Biển"
        ],
        "storageOptions": [
            "WH-CH720N"
        ],
        "promoText": "Tặng giá treo tai nghe bằng gỗ cao cấp trị giá 250.000₫"
    },
    {
        "id": 407,
        "name": "Loa Bluetooth Sony SRS-XB100 Extra Bass Nhỏ Gọn",
        "category": "audio",
        "brand": "Sony",
        "price": 1190000,
        "originalPrice": 1490000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-sony-srs-xb100-spa-0.png",
        "rating": 4.9,
        "reviewsCount": 210,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "N/A",
            "cpu": "Bộ khuếch tán âm thanh Sound Diffusion Processor",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Lên đến 16 giờ pin, kháng nước kháng bụi chuẩn IP67",
            "camera": "Micro khử tiếng vọng đàm thoại rảnh tay trong trẻo"
        },
        "colors": [
            "Đen Nhám",
            "Xanh Dương",
            "Cam Tươi",
            "Xám Bạc"
        ],
        "storageOptions": [
            "XB100 Portable"
        ],
        "promoText": "Kèm dây đeo đa năng treo balo tiện lợi • Bảo hành 12 tháng Sony VN"
    },
    {
        "id": 408,
        "name": "Loa Bluetooth Sony ULT Field 1 Âm Trầm Bùng Nổ",
        "category": "audio",
        "brand": "Sony",
        "price": 2890000,
        "originalPrice": 3290000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-sony-ult-field-1-spa.png",
        "rating": 4.9,
        "reviewsCount": 78,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Nút bấm ULT riêng biệt kích hoạt âm trầm",
            "cpu": "Hệ thống củ loa ULT Power Sound tăng cường dải bass",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "12 giờ nghe nhạc liên tục, chống nước chống bụi chuẩn IP67",
            "camera": "Thiết kế chống sốc rơi rớt, dây đeo đa hướng"
        },
        "colors": [
            "Đen",
            "Xám Trắng",
            "Xanh Forest",
            "Cam San Hô"
        ],
        "storageOptions": [
            "ULT Field 1"
        ],
        "promoText": "Bảo hành 12 tháng Sony Việt Nam • Tặng túi chống sốc du lịch"
    },
    {
        "id": 409,
        "name": "Tai nghe Apple AirPods 3 Hộp Sạc Lightning",
        "category": "audio",
        "brand": "Apple",
        "price": 3890000,
        "originalPrice": 4490000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_170_20.png",
        "rating": 4.9,
        "reviewsCount": 290,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "N/A",
            "cpu": "Chip tai nghe Apple H1, Spatial Audio theo dõi đầu",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "6 giờ nghe liên tục, lên đến 30 giờ cùng hộp sạc",
            "camera": "Kháng mồ hôi và nước chuẩn IPX4"
        },
        "colors": [
            "Trắng"
        ],
        "storageOptions": [
            "Lightning Case"
        ],
        "promoText": "Tặng Ốp silicon bảo vệ thời trang trị giá 190.000₫"
    },
    {
        "id": 501,
        "name": "Đồng hồ Garmin Forerunner 965 Màn AMOLED",
        "category": "watch",
        "brand": "Garmin",
        "price": 14990000,
        "originalPrice": 16590000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/a/garmin_forerunner_965_-_1.png",
        "rating": 5.0,
        "reviewsCount": 86,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "1.4 inch AMOLED cảm ứng siêu sáng, viền Titanium cao cấp",
            "cpu": "Định vị đa băng tần GPS SatIQ, bản đồ tích hợp màu",
            "ram": "N/A",
            "rom": "32 GB lưu trữ bản đồ và nhạc Spotify offline",
            "battery": "Lên đến 23 ngày ở chế độ smartwatch, 31 giờ GPS",
            "camera": "Đo VO2 Max, độ sẵn sàng luyện tập, ECG, nhịp tim Elevate"
        },
        "colors": [
            "Đen Viền Titan",
            "Vàng Chanh Amp Yellow",
            "Trắng Dây Xám"
        ],
        "storageOptions": [
            "47mm Titanium"
        ],
        "promoText": "Tặng gói dán PPF màn hình trọn đời • Giáo án chạy bộ Marathon chuyên sâu"
    },
    {
        "id": 502,
        "name": "Đồng hồ thông minh Samsung Galaxy Watch Ultra",
        "category": "watch",
        "brand": "Samsung",
        "price": 14990000,
        "originalPrice": 16990000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-watch-ultra_1_.png",
        "rating": 5.0,
        "reviewsCount": 68,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "1.5 inch Super AMOLED 3000 nits, kính Sapphire, vỏ Titanium cấp 4",
            "cpu": "Exynos W1000 tiến trình 3nm 5 nhân siêu tiết kiệm pin",
            "ram": "2 GB",
            "rom": "32 GB",
            "battery": "590 mAh lên đến 100 giờ tập luyện, sạc không dây nhanh",
            "camera": "Cảm biến BioActive thế hệ mới, đo huyết áp, ECG, cảnh báo ngưng thở khi ngủ"
        },
        "colors": [
            "Xám Titan",
            "Trắng Titan",
            "Bạc Titan"
        ],
        "storageOptions": [
            "47mm LTE + GPS"
        ],
        "promoText": "Tặng dây đeo thể thao phụ trị giá 1.2 triệu • Trợ giá thu cũ 2 triệu"
    },
    {
        "id": 503,
        "name": "Apple Watch Series 10 Nhôm GPS 46mm Dây Thể Thao Jet Black",
        "category": "watch",
        "brand": "Apple",
        "price": 10790000,
        "originalPrice": 11490000,
        "discountPercent": 6,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-watch-series-10-46mm_1_.png",
        "rating": 5.0,
        "reviewsCount": 138,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "46mm Màn hình OLED góc rộng sáng hơn 40% ở góc nghiêng",
            "cpu": "Apple S10 SiP 4 nhân Neural Engine",
            "ram": "1 GB",
            "rom": "64 GB",
            "battery": "Sạc nhanh 80% chỉ trong 30 phút, pin 18 giờ",
            "camera": "Cảm biến độ sâu, đo nhiệt độ nước, phát hiện ngưng thở khi ngủ"
        },
        "colors": [
            "Đen Bóng Jet Black",
            "Vàng Hồng Rose Gold",
            "Bạc Silver"
        ],
        "storageOptions": [
            "46mm GPS"
        ],
        "promoText": "Tặng miếng dán màn hình PPF trọn đời • Dây đeo thể thao chính hãng"
    },
    {
        "id": 504,
        "name": "Apple Watch SE 2023 GPS 40mm Viền Nhôm",
        "category": "watch",
        "brand": "Apple",
        "price": 5690000,
        "originalPrice": 6390000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-watch-se-2023-40mm.png",
        "rating": 4.8,
        "reviewsCount": 260,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "40mm Retina LTPO OLED độ sáng 1000 nits",
            "cpu": "Apple S8 SiP lõi kép 64-bit",
            "ram": "1 GB",
            "rom": "32 GB",
            "battery": "Lên đến 18 giờ thời lượng pin",
            "camera": "Cảm biến nhịp tim quang học thế hệ 2, phát hiện té ngã"
        },
        "colors": [
            "Đen Midnight",
            "Ánh Sao Starlight",
            "Bạc Silver"
        ],
        "storageOptions": [
            "40mm GPS"
        ],
        "promoText": "Trả góp 0% duyệt 5 phút • Giảm thêm 100k cho học sinh sinh viên"
    },
    {
        "id": 505,
        "name": "Robot hút bụi lau nhà Roborock Qrevo Edge Tự Giặt Giẻ",
        "category": "smarthome",
        "brand": "Roborock",
        "price": 21990000,
        "originalPrice": 25990000,
        "discountPercent": 15,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/o/robot-hut-bui-lau-nha-roborock-qrevo-edge-2.jpg",
        "rating": 5.0,
        "reviewsCount": 74,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 500k",
        "specs": {
            "screen": "Điều khiển thông minh qua app Roborock tiếng Việt",
            "cpu": "Điều hướng LiDAR PreciSense kết hợp Reactive AI né chướng ngại vật",
            "ram": "N/A",
            "rom": "Lưu bản đồ 3D 4 tầng nhà",
            "battery": "Lực hút cực đại 18.500 Pa, pin 5.200 mAh dọn dẹp 300m2",
            "camera": "Dock sạc tự giặt giẻ nước nóng 75°C, tự sấy khô tĩnh âm, tự hút rác"
        },
        "colors": [
            "Trắng Tinh Khôi",
            "Đen Huyền Bí"
        ],
        "storageOptions": [
            "Qrevo Edge Bản Quốc Tế"
        ],
        "promoText": "Tặng combo 3 chai nước lau sàn chính hãng + 2 bộ chổi quét thay thế"
    },
    {
        "id": 506,
        "name": "Máy lọc không khí Xiaomi Air Purifier Max Phòng Lớn",
        "category": "smarthome",
        "brand": "Xiaomi",
        "price": 5490000,
        "originalPrice": 6990000,
        "discountPercent": 21,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-loc-khong-khi-xiaomi-air-purifier-max-27.jpg",
        "rating": 4.9,
        "reviewsCount": 320,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "Màn hình cảm ứng OLED hiển thị chỉ số bụi mịn PM2.5 thời gian thực",
            "cpu": "Cảm biến laser kép PM2.5 và chất lượng không khí",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Công suất lọc cực khủng 1000 m3/h (CADR), phòng đến 120m2",
            "camera": "Hệ thống lọc kép than hoạt tính loại bỏ 99.97% vi khuẩn và formaldehyde"
        },
        "colors": [
            "Trắng Tinh Tế"
        ],
        "storageOptions": [
            "Phòng đến 120m2"
        ],
        "promoText": "Tặng lõi lọc than hoạt tính dự phòng trị giá 990.000₫"
    },
    {
        "id": 507,
        "name": "Camera an ninh xoay 360 độ Xiaomi Mi C500 Pro 3K",
        "category": "smarthome",
        "brand": "Xiaomi",
        "price": 1190000,
        "originalPrice": 1490000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-xiaomi-mi-home-security-c500-pro.png",
        "rating": 4.9,
        "reviewsCount": 460,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "Độ phân giải siêu nét 3K 5MP (2960 x 1666) HDR",
            "cpu": "Chip bảo mật phần cứng MJA1 mã hóa dữ liệu đầu cuối",
            "ram": "N/A",
            "rom": "Hỗ trợ thẻ nhớ MicroSD 256GB và NAS / Cloud",
            "battery": "Góc xoay ngang 360 độ, xoay dọc 114 độ",
            "camera": "Cảm biến hồng ngoại nhìn đêm có màu, AI nhận diện người & tiếng khóc trẻ em"
        },
        "colors": [
            "Trắng"
        ],
        "storageOptions": [
            "3K 5MP Pro"
        ],
        "promoText": "Tặng kèm thẻ nhớ SanDisk 64GB chuyên dụng camera giám sát"
    },
    {
        "id": 508,
        "name": "Camera an ninh xoay 360 EZVIZ H6c Pro 2K+ 4MP",
        "category": "smarthome",
        "brand": "EZVIZ",
        "price": 790000,
        "originalPrice": 990000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera_ip_360_5mp_ezviz_h6c_g1.jpg",
        "rating": 4.8,
        "reviewsCount": 380,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 30k",
        "specs": {
            "screen": "Độ phân giải 2K+ (2560 x 1440) 4MP sắc nét",
            "cpu": "AI phát hiện hình dáng người và tự động theo dõi chuyển động",
            "ram": "N/A",
            "rom": "Hỗ trợ thẻ nhớ MicroSD lên đến 512GB",
            "battery": "Bao quát toàn cảnh 360 độ không điểm mù",
            "camera": "Đàm thoại 2 chiều nút chạm cảm ứng gọi điện trực tiếp"
        },
        "colors": [
            "Trắng"
        ],
        "storageOptions": [
            "2K+ 4MP"
        ],
        "promoText": "Tặng kèm thẻ nhớ 32GB • Miễn phí công lắp đặt tại nhà"
    },
    {
        "id": 410,
        "name": "Củ sạc nhanh Anker Nano GaN 45W Type-C Siêu Nhỏ",
        "category": "accessories",
        "brand": "Anker",
        "price": 590000,
        "originalPrice": 790000,
        "discountPercent": 25,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/u/cu-sac-anker-nano-45w-a121d_1.png",
        "rating": 5.0,
        "reviewsCount": 280,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 30k",
        "specs": {
            "screen": "Thiết kế siêu nhỏ gọn chân gập tiện lợi",
            "cpu": "Công nghệ GaN thế hệ mới tản nhiệt mát lạnh",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Công suất 45W sạc siêu nhanh 2.0 cho Galaxy S24 & iPhone 16",
            "camera": "Kiểm soát nhiệt độ an toàn ActiveShield 2.0"
        },
        "colors": [
            "Đen Nhám",
            "Trắng Sứ"
        ],
        "storageOptions": [
            "45W GaN"
        ],
        "promoText": "Bảo hành 18 tháng chính hãng 1 đổi 1"
    },
    {
        "id": 411,
        "name": "Củ sạc nhanh Anker Nano 20W PD Nhỏ Bằng Đồng Xu",
        "category": "accessories",
        "brand": "Anker",
        "price": 290000,
        "originalPrice": 400000,
        "discountPercent": 27,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/u/cu-sac-nhanh-anker-powerport-iii-nano-20w-pd-a2633_3.png",
        "rating": 4.9,
        "reviewsCount": 540,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 20k",
        "specs": {
            "screen": "Kích thước tí hon chỉ 2.8cm",
            "cpu": "Chip PowerIQ 3.0 tối ưu công suất từng máy",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Công suất 20W sạc 50% pin iPhone chỉ trong 25 phút",
            "camera": "Công nghệ bảo vệ đa lớp an toàn chống cháy nổ"
        },
        "colors": [
            "Trắng",
            "Đen",
            "Xanh Mint",
            "Tím Lavender"
        ],
        "storageOptions": [
            "20W PD"
        ],
        "promoText": "Bảo hành đổi mới 18 tháng • Mua kèm cáp sạc giảm 20%"
    },
    {
        "id": 412,
        "name": "Pin sạc dự phòng Anker A1695 25.000mAh 165W Cáp Rút",
        "category": "accessories",
        "brand": "Anker",
        "price": 1990000,
        "originalPrice": 2490000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-sac-du-phong-anker-a1695-25000mah-165w-kem-cap-rut-gon.png",
        "rating": 5.0,
        "reviewsCount": 110,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Màn hình màu TFT hiển thị công suất từng cổng, % pin và thời gian sạc",
            "cpu": "Công nghệ PowerIQ 3.0 phân phối dòng thông minh",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Dung lượng 25.000 mAh (90Wh), công suất cực đại 165W sạc được cả MacBook Pro",
            "camera": "Tích hợp cáp Type-C rút gọn siêu bền, độ bền kéo 20.000 lần"
        },
        "colors": [
            "Đen Xám Kim Loại"
        ],
        "storageOptions": [
            "25.000mAh 165W"
        ],
        "promoText": "Tặng túi nhung đựng phụ kiện cao cấp • Bảo hành 18 tháng 1 đổi 1"
    },
    {
        "id": 413,
        "name": "Pin sạc dự phòng Anker Nano MagGo Qi2 15W 5000mAh",
        "category": "accessories",
        "brand": "Anker",
        "price": 890000,
        "originalPrice": 1190000,
        "discountPercent": 25,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-sac-du-phong-anker-nano-maggo-ultra-slim-qi2-5000mah-a1665.png",
        "rating": 4.9,
        "reviewsCount": 145,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "Độ mỏng ấn tượng chỉ 12mm, hít lưng iPhone cực kỳ gọn",
            "cpu": "Chuẩn sạc không dây Qi2 được Apple chứng nhận",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Dung lượng 5.000 mAh, sạc không dây 15W MagSafe",
            "camera": "Nam châm lực hút mạnh 12N không lo rơi rớt"
        },
        "colors": [
            "Đen Nhám",
            "Trắng Băng Tuyết",
            "Xanh Biển"
        ],
        "storageOptions": [
            "5.000mAh Qi2"
        ],
        "promoText": "Bảo hành 18 tháng chính hãng • Tương thích trọn vẹn từ iPhone 12 đến iPhone 16"
    },
    {
        "id": 414,
        "name": "Pin sạc dự phòng Baseus Enercore CR11 20000mAh 67W",
        "category": "accessories",
        "brand": "Baseus",
        "price": 990000,
        "originalPrice": 1390000,
        "discountPercent": 28,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-du-phong-baseus-enercore-cr11-kem-cap-rut-gon-20000mah-67w.png",
        "rating": 4.8,
        "reviewsCount": 160,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "Màn hình LED hiển thị % pin chuẩn xác",
            "cpu": "Chip BPS II tự động nhận diện và điều áp cho Laptop, Tablet, Điện thoại",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Dung lượng 20.000 mAh, sạc nhanh công suất 67W cho laptop",
            "camera": "Tích hợp sẵn dây cáp sạc Type-C rút gọn tiện lợi"
        },
        "colors": [
            "Đen Nhám",
            "Trắng Sữa"
        ],
        "storageOptions": [
            "20.000mAh 67W"
        ],
        "promoText": "Tặng túi chống sốc • Bảo hành 12 tháng 1 đổi 1"
    },
    {
        "id": 415,
        "name": "Pin sạc dự phòng Baseus Enerfill FC11 10000mAh 22.5W",
        "category": "accessories",
        "brand": "Baseus",
        "price": 490000,
        "originalPrice": 690000,
        "discountPercent": 28,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-sac-du-phong-baseus-enerfill-fc11-10000mah-22-5w_1_.png",
        "rating": 4.8,
        "reviewsCount": 195,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 30k",
        "specs": {
            "screen": "Màn hình số LED mini sắc nét",
            "cpu": "Chip kiểm soát nguồn đa giao thức QC, PD, SCP, FCP",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Dung lượng 10.000 mAh, công suất 22.5W",
            "camera": "Tích hợp sẵn 2 cáp Type-C và Lightning không cần mang dây rời"
        },
        "colors": [
            "Tím Pastel",
            "Trắng Ngà",
            "Đen"
        ],
        "storageOptions": [
            "10.000mAh Kèm Dây"
        ],
        "promoText": "Bảo hành 1 đổi 1 trong 12 tháng chính hãng"
    },
    {
        "id": 416,
        "name": "Pin sạc dự phòng Ugreen Magnetic 10000mAh 20W Không Dây",
        "category": "accessories",
        "brand": "Ugreen",
        "price": 690000,
        "originalPrice": 890000,
        "discountPercent": 22,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/i/pin-sac-du-phong-khong-day-ugreen-magnetic-pb561-10-000mah-20w.png",
        "rating": 4.9,
        "reviewsCount": 130,
        "isFlashSale": false,
        "installment": "",
        "smemberDiscount": "Giảm 40k",
        "specs": {
            "screen": "Đèn LED báo dung lượng pin 4 mức",
            "cpu": "Chip cảm biến nhiệt độ NTC bảo vệ quá nhiệt",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "10.000 mAh, sạc không dây 15W MagSafe + có dây PD 20W",
            "camera": "Lớp đệm silicon êm ái chống trầy xước mặt lưng máy"
        },
        "colors": [
            "Xám Không Gian",
            "Trắng"
        ],
        "storageOptions": [
            "10.000mAh MagSafe"
        ],
        "promoText": "Tặng cáp C to C Ugreen 60W • Bảo hành chính hãng 18 tháng"
    },
    {
        "id": 601,
        "name": "Màn hình Gaming LG UltraGear 27 inch 180Hz IPS",
        "category": "pc",
        "brand": "LG",
        "price": 4290000,
        "originalPrice": 5490000,
        "discountPercent": 22,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_895_1_.png",
        "rating": 4.9,
        "reviewsCount": 142,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "27 inch FHD (1920x1080) IPS 180Hz 1ms MBR, 99% sRGB HDR10",
            "cpu": "Hỗ trợ AMD FreeSync & NVIDIA G-Sync Compatible",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Nguồn trực tiếp 100-240V",
            "camera": "Cổng HDMI 2.0, DisplayPort 1.4, ngõ ra âm thanh 3.5mm"
        },
        "colors": [
            "Đen Viền Đỏ Gaming"
        ],
        "storageOptions": [
            "27 inch 180Hz"
        ],
        "promoText": "Tặng cáp DisplayPort cao cấp • Bảo hành 24 tháng chính hãng LG tại nhà"
    },
    {
        "id": 602,
        "name": "Màn hình Đồ Họa Dell UltraSharp U2424H 24 inch 120Hz",
        "category": "pc",
        "brand": "Dell",
        "price": 5990000,
        "originalPrice": 6790000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/man-hinh-dell-u2424h-24-inch-10.png",
        "rating": 5.0,
        "reviewsCount": 98,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "23.8 inch FHD 120Hz IPS Black 100% sRGB, 100% BT.709, Delta E < 2",
            "cpu": "Cảm biến ánh sáng tự điều chỉnh độ sáng bảo vệ mắt",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Chân đế công thái học xoay dọc 90 độ, nâng hạ linh hoạt",
            "camera": "Đa dạng cổng: DP 1.4, HDMI 1.4, USB-C 15W, 3x USB 3.2 Gen 2 10Gbps"
        },
        "colors": [
            "Bạc Bạch Kim Dell UltraSharp"
        ],
        "storageOptions": [
            "24 inch UltraSharp"
        ],
        "promoText": "Bảo hành 36 tháng 1 đổi 1 tận nơi Dell Premium Panel Exchange"
    },
    {
        "id": 603,
        "name": "Màn hình Gaming ASUS TUF VG259Q5A 25 inch 180Hz 1ms",
        "category": "pc",
        "brand": "ASUS",
        "price": 3190000,
        "originalPrice": 3990000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_180_1_12.png",
        "rating": 4.8,
        "reviewsCount": 115,
        "isFlashSale": false,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "24.5 inch Fast IPS FHD 180Hz 0.3ms MPRT, công nghệ ELMB Sync",
            "cpu": "Tích hợp loa kép stereo 2W tiện lợi",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "Công nghệ ASUS Eye Care chống nhấp nháy lọc ánh sáng xanh",
            "camera": "2x HDMI 2.0, DisplayPort 1.2, Jack tai nghe 3.5mm"
        },
        "colors": [
            "Đen Chiến Binh TUF"
        ],
        "storageOptions": [
            "25 inch 180Hz"
        ],
        "promoText": "Bảo hành 36 tháng ASUS toàn quốc • Tặng kèm cáp HDMI & DisplayPort"
    },
    {
        "id": 213,
        "name": "vivo X100 Pro 5G 16GB 512GB Camera ZEISS APO",
        "category": "phone",
        "brand": "vivo",
        "price": 23990000,
        "originalPrice": 26990000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/i/vivo-x100-pro.png",
        "rating": 4.9,
        "reviewsCount": 64,
        "isFlashSale": false,
        "totalStock": 25,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "6.78 inch LTPO AMOLED 120Hz 3000 nits",
            "cpu": "MediaTek Dimensity 9300 + Chip hình ảnh vivo V3",
            "ram": "16 GB",
            "rom": "512 GB",
            "battery": "5.400 mAh BlueVolt, sạc nhanh 100W",
            "camera": "Bộ 3 camera 50MP cảm biến 1 inch ZEISS T*"
        },
        "colors": [
            "Đen Thiên Thạch",
            "Xanh Tinh Vân"
        ],
        "storageOptions": [
            "512GB"
        ],
        "promoText": "Tặng tai nghe vivo TWS 3e • Bảo hành VIP 24 tháng"
    },
    {
        "id": 214,
        "name": "realme 12 Pro+ 5G 12GB 512GB Camera Periscope",
        "category": "phone",
        "brand": "realme",
        "price": 10990000,
        "originalPrice": 13990000,
        "discountPercent": 21,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/e/realme-12-pro-plus_1_.png",
        "rating": 4.8,
        "reviewsCount": 82,
        "isFlashSale": false,
        "totalStock": 30,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "6.7 inch AMOLED cong 120Hz 1 tỷ màu",
            "cpu": "Qualcomm Snapdragon 7s Gen 2 4nm",
            "ram": "12 GB",
            "rom": "512 GB",
            "battery": "5.000 mAh, sạc siêu nhanh SuperVOOC 67W",
            "camera": "64MP Tele tiềm vọng 3x OIS + 50MP Sony IMX890"
        },
        "colors": [
            "Xanh Hải Quân",
            "Vàng Hoàng Gia"
        ],
        "storageOptions": [
            "256GB",
            "512GB"
        ],
        "promoText": "Thiết kế mặt lưng da đồng hồ Thụy Sĩ • Tặng củ sạc 67W"
    },
    {
        "id": 215,
        "name": "ASUS ROG Phone 8 Pro 5G 16GB 512GB Gaming",
        "category": "phone",
        "brand": "ASUS",
        "price": 25990000,
        "originalPrice": 28990000,
        "discountPercent": 10,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8-pro_1_.png",
        "rating": 5.0,
        "reviewsCount": 49,
        "isFlashSale": true,
        "soldCount": 18,
        "totalStock": 20,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 500k",
        "specs": {
            "screen": "6.78 inch LTPO AMOLED 165Hz 2500 nits + AniMe Vision LED",
            "cpu": "Qualcomm Snapdragon 8 Gen 3 3.3GHz",
            "ram": "16 GB LPDDR5X",
            "rom": "512 GB UFS 4.0",
            "battery": "5.500 mAh, sạc HyperCharge 65W + Sạc không dây",
            "camera": "50MP Gimbal OIS 6 trục + 32MP Tele 3x + 13MP"
        },
        "colors": [
            "Phantom Black"
        ],
        "storageOptions": [
            "512GB",
            "1TB"
        ],
        "promoText": "Tặng quạt tản nhiệt AeroActive Cooler X trị giá 2.490.000₫"
    },
    {
        "id": 216,
        "name": "Nokia HMD Pulse Pro 6GB 128GB Pin Bền Bỉ",
        "category": "phone",
        "brand": "Nokia",
        "price": 3190000,
        "originalPrice": 3990000,
        "discountPercent": 20,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/n/o/nokia-g22_1_.png",
        "rating": 4.7,
        "reviewsCount": 112,
        "isFlashSale": false,
        "totalStock": 45,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "6.56 inch HD+ IPS 90Hz sáng rõ ngoài trời",
            "cpu": "Unisoc T606 8 nhân ổn định",
            "ram": "6 GB (+6GB RAM ảo)",
            "rom": "128 GB",
            "battery": "5.000 mAh thời lượng 59 giờ, sạc nhanh 20W",
            "camera": "50MP AI Dual Camera + 50MP Selfie"
        },
        "colors": [
            "Xanh Băng Tuyết",
            "Đen Vũ Trụ",
            "Tím Hoàng Hôn"
        ],
        "storageOptions": [
            "128GB"
        ],
        "promoText": "Bảo hành chính hãng 12 tháng • Tặng ốp lưng trong suốt"
    },
    {
        "id": 310,
        "name": "Laptop HP Victus 16 Gaming Ryzen 7 RTX 4060 16GB",
        "category": "laptop",
        "brand": "HP",
        "price": 26990000,
        "originalPrice": 30990000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-hp-victus-16_1_.png",
        "rating": 4.9,
        "reviewsCount": 95,
        "isFlashSale": false,
        "totalStock": 20,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "16.1 inch FHD IPS 165Hz 100% sRGB 300 nits",
            "cpu": "AMD Ryzen 7 7840HS + NVIDIA GeForce RTX 4060 8GB",
            "ram": "16 GB DDR5 5600MHz",
            "rom": "512 GB SSD PCIe Gen 4",
            "battery": "70Wh, sạc nhanh 50% trong 30 phút",
            "camera": "1080p FHD TNR camera"
        },
        "colors": [
            "Xanh Performance Blue",
            "Đen Mica Silver"
        ],
        "storageOptions": [
            "512GB SSD",
            "1TB SSD"
        ],
        "promoText": "Tặng Balo Gaming HP + Chuột HyperX Pulsefire Core"
    },
    {
        "id": 311,
        "name": "Laptop Acer Nitro V 15 ANV15 Core i5-13420H RTX 4050",
        "category": "laptop",
        "brand": "Acer",
        "price": 21490000,
        "originalPrice": 24990000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-acer-gaming-nitro-v-anv15-51_1_.png",
        "rating": 4.9,
        "reviewsCount": 140,
        "isFlashSale": true,
        "soldCount": 27,
        "totalStock": 30,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 350k",
        "specs": {
            "screen": "15.6 inch FHD IPS 144Hz ComfyView",
            "cpu": "Intel Core i5-13420H + NVIDIA RTX 4050 6GB GDDR6",
            "ram": "16 GB DDR5 5200MHz",
            "rom": "512 GB SSD NVMe PCIe Gen 4",
            "battery": "57Wh, tản nhiệt 2 quạt Acer CoolBoost",
            "camera": "720p HD PurifyView AI"
        },
        "colors": [
            "Đen Obsidian"
        ],
        "storageOptions": [
            "512GB SSD"
        ],
        "promoText": "Bảo hành VIP 3S1 (Quá 3 ngày đổi máy mới) • Tặng Balo Nitro"
    },
    {
        "id": 312,
        "name": "Laptop MSI Cyborg 15 AI Core Ultra 7 RTX 4060",
        "category": "laptop",
        "brand": "MSI",
        "price": 27490000,
        "originalPrice": 31490000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-msi-gaming-cyborg-15_1_.png",
        "rating": 4.8,
        "reviewsCount": 68,
        "isFlashSale": false,
        "totalStock": 18,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "15.6 inch FHD IPS 144Hz viền mỏng",
            "cpu": "Intel Core Ultra 7 155H NPU AI + RTX 4060 8GB",
            "ram": "16 GB DDR5 5600MHz",
            "rom": "512 GB SSD NVMe Gen 4",
            "battery": "53.5Wh, bàn phím RGB 4 vùng xuyên thấu Cyberpunk",
            "camera": "HD 720p"
        },
        "colors": [
            "Translucent Black"
        ],
        "storageOptions": [
            "512GB SSD",
            "1TB SSD"
        ],
        "promoText": "Tặng Balo MSI Essential + Chuột Gaming MSI M99"
    },
    {
        "id": 417,
        "name": "Loa Bluetooth JBL Charge 5 Chống Nước IP67 Pin 20 Giờ",
        "category": "audio",
        "brand": "JBL",
        "price": 3490000,
        "originalPrice": 3990000,
        "discountPercent": 13,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/o/loa-bluetooth-jbl-charge-5.png",
        "rating": 4.9,
        "reviewsCount": 245,
        "isFlashSale": false,
        "totalStock": 40,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Đèn LED báo thời lượng pin trực quan",
            "cpu": "Công nghệ JBL Original Pro Sound công suất 40W",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "20 giờ phát nhạc, kiêm sạc dự phòng cho điện thoại",
            "camera": "Chuẩn kháng nước & bụi IP67, tính năng PartyBoost"
        },
        "colors": [
            "Đen",
            "Xanh Dương",
            "Đỏ",
            "Xám"
        ],
        "storageOptions": [
            "40W Pro Sound"
        ],
        "promoText": "Bảo hành chính hãng PGI 12 tháng • Giảm 100k khi mua 2 loa"
    },
    {
        "id": 418,
        "name": "Tai nghe Bluetooth Soundpeats Air4 Pro Chống Ồn ANC",
        "category": "audio",
        "brand": "Soundpeats",
        "price": 1290000,
        "originalPrice": 1690000,
        "discountPercent": 24,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-khong-day-soundpeats-air4-pro.png",
        "rating": 4.8,
        "reviewsCount": 190,
        "isFlashSale": false,
        "totalStock": 55,
        "installment": false,
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "Cảm ứng chạm thông minh",
            "cpu": "Qualcomm Snapdragon Sound aptX Lossless",
            "ram": "N/A",
            "rom": "N/A",
            "battery": "26 giờ nghe nhạc cùng hộp sạc",
            "camera": "6 Micro chống ồn đàm thoại AI & ANC thích ứng 45dB"
        },
        "colors": [
            "Đen Nhám",
            "Trắng Sứ"
        ],
        "storageOptions": [
            "aptX Lossless"
        ],
        "promoText": "Bảo hành 12 tháng 1 đổi 1 chính hãng Soundpeats VN"
    },
    {
        "id": 509,
        "name": "Đồng hồ thông minh Huawei Watch GT 5 Pro 46mm Titanium",
        "category": "watch",
        "brand": "Huawei",
        "price": 7490000,
        "originalPrice": 8490000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/o/dong-ho-thong-minh-huawei-watch-gt-5-pro-46mm.png",
        "rating": 4.9,
        "reviewsCount": 115,
        "isFlashSale": false,
        "totalStock": 30,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "1.43 inch AMOLED mặt kính Sapphire, vỏ hợp kim Titanium",
            "cpu": "Hệ thống Huawei TruSense đo ECG & sức khỏe tim mạch",
            "ram": "N/A",
            "rom": "Bản đồ sân Golf 3D & Chế độ lặn tự do 40m",
            "battery": "Thời lượng pin siêu khủng lên đến 14 ngày",
            "camera": "Tương thích hoàn hảo với cả iOS (iPhone) và Android"
        },
        "colors": [
            "Đen Titanium",
            "Trắng Gốm Ceramic"
        ],
        "storageOptions": [
            "46mm Titanium"
        ],
        "promoText": "Tặng tai nghe Huawei FreeBuds SE 2 trị giá 990.000₫"
    },
    {
        "id": 510,
        "name": "Khóa cửa vân tay thông minh Xiaomi Lockin X1 6 Trong 1",
        "category": "smarthome",
        "brand": "Xiaomi",
        "price": 3690000,
        "originalPrice": 4690000,
        "discountPercent": 21,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/k/h/khoa-cua-thong-minh-xiaomi-lockin-x1.png",
        "rating": 4.9,
        "reviewsCount": 88,
        "isFlashSale": false,
        "totalStock": 22,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "Bàn phím cảm ứng ẩn kính cường lực chống bám vân tay",
            "cpu": "Nhận diện vân tay bán dẫn siêu nhạy 0.3 giây",
            "ram": "N/A",
            "rom": "Lưu 50 vân tay, 50 mật khẩu, thẻ NFC, App Mi Home",
            "battery": "Thời lượng pin 12 tháng, cổng cấp nguồn khẩn cấp Type-C",
            "camera": "Thân khóa inox 304 chống cạy phá cấp độ C"
        },
        "colors": [
            "Đen Không Gian"
        ],
        "storageOptions": [
            "Bản Quốc Tế Mi Home"
        ],
        "promoText": "Miễn phí công lắp đặt tận nhà • Bảo hành chính hãng 24 tháng"
    },
    {
        "id": 604,
        "name": "Bàn phím cơ không dây Keychron K8 Pro QMK/VIA RGB Nhôm",
        "category": "pc",
        "brand": "Keychron",
        "price": 2490000,
        "originalPrice": 2890000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/b/a/ban-phim-co-keychron-k8-pro.png",
        "rating": 4.9,
        "reviewsCount": 134,
        "isFlashSale": false,
        "totalStock": 35,
        "installment": false,
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "Layout TKL 87 phím tương thích MacOS & Windows",
            "cpu": "Hỗ trợ Hot-swap 5 pin & Custom QMK/VIA",
            "ram": "Keycap PBT Double-shot chống bóng",
            "rom": "Lót sẵn Foam tiêu âm Silicon đầm chắc",
            "battery": "Pin 4.000 mAh, kết nối Bluetooth 5.1 (3 thiết bị) & Type-C",
            "camera": "Khung viền nhôm CNC sang trọng, LED RGB 22 chế độ"
        },
        "colors": [
            "Đen Khung Nhôm (Red Switch)",
            "Đen Khung Nhôm (Brown Switch)"
        ],
        "storageOptions": [
            "RGB Aluminum"
        ],
        "promoText": "Tặng kê tay gỗ cao cấp + Keycap Puller chính hãng"
    },
    {
        "id": 605,
        "name": "Chuột Gaming không dây Logitech G502 X Plus Lightspeed RGB",
        "category": "pc",
        "brand": "Logitech",
        "price": 3190000,
        "originalPrice": 3790000,
        "discountPercent": 16,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-gaming-khong-day-logitech-g502-x-plus-lightspeed.png",
        "rating": 5.0,
        "reviewsCount": 172,
        "isFlashSale": false,
        "totalStock": 28,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Dải LED LIGHTSYNC RGB 8 vùng rực rỡ",
            "cpu": "Cảm biến HERO 25K chính xác từng sub-micron (25.600 DPI)",
            "ram": "Switch lai quang - cơ học LIGHTFORCE siêu bền",
            "rom": "Lưu 5 profile bộ nhớ trong",
            "battery": "Pin lên đến 130 giờ, kết nối không dây LIGHTSPEED 1ms",
            "camera": "Con lăn vô cực chế độ kép siêu tốc"
        },
        "colors": [
            "Đen",
            "Trắng"
        ],
        "storageOptions": [
            "G502 X Plus RGB"
        ],
        "promoText": "Tặng lót chuột Gaming cỡ lớn • Bảo hành 24 tháng chính hãng"
    },
    {
        "id": 701,
        "name": "Máy chơi game Sony PlayStation 5 (PS5) Slim Bản Ổ Đĩa VN",
        "category": "gaming",
        "brand": "Sony",
        "price": 13290000,
        "originalPrice": 14990000,
        "discountPercent": 11,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-choi-game-sony-playstation-5-slim-1.png",
        "rating": 5.0,
        "reviewsCount": 215,
        "isFlashSale": true,
        "soldCount": 31,
        "totalStock": 35,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "Xuất hình 4K 120Hz HDR, công nghệ Ray Tracing chân thực",
            "cpu": "AMD Ryzen Zen 2 8 nhân + GPU RDNA 2 10.3 TFLOPS",
            "ram": "16 GB GDDR6",
            "rom": "1 TB SSD Custom siêu tốc",
            "battery": "Kèm 1 tay cầm DualSense phản hồi xúc giác Haptic Feedback",
            "camera": "Bản có ổ đĩa Blu-ray Ultra HD chính hãng Sony Việt Nam"
        },
        "colors": [
            "Trắng Tinh Khôi"
        ],
        "storageOptions": [
            "1TB Slim Disc VN"
        ],
        "promoText": "Bảo hành 12 tháng chính hãng Sony VN • Giảm 20% khi mua thêm tay cầm"
    },
    {
        "id": 702,
        "name": "Máy chơi game Nintendo Switch OLED Model Bản Neon/Trắng",
        "category": "gaming",
        "brand": "Nintendo",
        "price": 7490000,
        "originalPrice": 8490000,
        "discountPercent": 12,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/n/i/nintendo-switch-oled-1.png",
        "rating": 4.9,
        "reviewsCount": 268,
        "isFlashSale": false,
        "totalStock": 40,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 150k",
        "specs": {
            "screen": "7.0 inch OLED rực rỡ sắc nét, chân đế bản rộng linh hoạt",
            "cpu": "NVIDIA Custom Tegra Processor",
            "ram": "4 GB",
            "rom": "64 GB (Hỗ trợ thẻ nhớ MicroSD đến 2TB)",
            "battery": "Thời lượng pin từ 4.5 - 9 giờ chơi liên tục",
            "camera": "3 chế độ chơi: Cầm tay Handheld, Để bàn Tabletop, Xuất TV Dock LAN"
        },
        "colors": [
            "Trắng OLED",
            "Xanh Đỏ Neon"
        ],
        "storageOptions": [
            "64GB OLED"
        ],
        "promoText": "Tặng dán cường lực màn hình + Bọc núm Joy-Con cao cấp"
    },
    {
        "id": 703,
        "name": "Tay cầm chơi game Microsoft Xbox Wireless Controller Gen 9",
        "category": "gaming",
        "brand": "Microsoft",
        "price": 1490000,
        "originalPrice": 1790000,
        "discountPercent": 17,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tay-cam-choi-game-xbox-series-x-s.png",
        "rating": 4.9,
        "reviewsCount": 184,
        "isFlashSale": false,
        "totalStock": 50,
        "installment": false,
        "smemberDiscount": "Giảm 50k",
        "specs": {
            "screen": "Nút Share chuyên dụng chụp ảnh/quay video nhanh",
            "cpu": "Kết nối Xbox Wireless, Bluetooth & USB-C đa nền tảng",
            "ram": "Tương thích PC Windows, Laptop, iOS, Android, Xbox",
            "rom": "Bề mặt cò súng nhám chống trượt chuẩn eSports",
            "battery": "Thời lượng pin lên đến 40 giờ",
            "camera": "Cụm phím điều hướng Hybrid D-Pad 8 hướng nhạy bén"
        },
        "colors": [
            "Carbon Black",
            "Robot White",
            "Shock Blue",
            "Pulse Red"
        ],
        "storageOptions": [
            "Controller Gen 9"
        ],
        "promoText": "Tặng kèm cáp kết nối Type-C dài 2m + Đôi pin AA"
    },
    {
        "id": 704,
        "name": "Tai nghe chụp tai Gaming HyperX Cloud III Wireless Pin 120h",
        "category": "gaming",
        "brand": "HyperX",
        "price": 3290000,
        "originalPrice": 3890000,
        "discountPercent": 15,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-chup-tai-gaming-hyperx-cloud-iii-wireless.png",
        "rating": 4.9,
        "reviewsCount": 92,
        "isFlashSale": false,
        "totalStock": 25,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 100k",
        "specs": {
            "screen": "Đệm tai Memory Foam bọc da mềm mại đặc trưng HyperX",
            "cpu": "Màng loa 53mm đặt nghiêng + Âm thanh vòm DTS Headphone:X",
            "ram": "Kết nối không dây 2.4GHz độ trễ bằng 0 qua USB-C/USB-A",
            "rom": "Khung nhôm nguyên khối siêu bền bỉ",
            "battery": "Thời lượng pin kỷ lục lên đến 120 giờ chỉ với 1 lần sạc",
            "camera": "Micro 10mm tháo rời lọc ồn kèm đèn LED báo tắt tiếng"
        },
        "colors": [
            "Đen Đỏ",
            "Đen Tuyền"
        ],
        "storageOptions": [
            "Wireless 2.4GHz"
        ],
        "promoText": "Bảo hành chính hãng 24 tháng • Tặng giá treo tai nghe"
    },
    {
        "id": 801,
        "name": "Ổ cứng di động SSD Samsung T7 Shield 1TB USB 3.2 Chống Sốc",
        "category": "storage",
        "brand": "Samsung",
        "price": 2690000,
        "originalPrice": 3290000,
        "discountPercent": 18,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/c/o-cung-di-dong-ssd-samsung-t7-shield-1tb.png",
        "rating": 5.0,
        "reviewsCount": 164,
        "isFlashSale": false,
        "totalStock": 45,
        "installment": false,
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "Vỏ bọc cao su đàn hồi chống rơi từ độ cao 3 mét, kháng nước IP65",
            "cpu": "Tốc độ đọc 1.050 MB/s - Ghi 1.000 MB/s (USB 3.2 Gen 2)",
            "ram": "Quay trực tiếp video Apple ProRes 4K trên iPhone 15/16 Pro",
            "rom": "1 TB NVMe SSD",
            "battery": "Đi kèm 2 dây cáp USB-C to C và USB-C to A trong hộp",
            "camera": "Mã hóa phần cứng AES 256-bit an toàn dữ liệu"
        },
        "colors": [
            "Đen",
            "Xanh Dương",
            "Kem Beige"
        ],
        "storageOptions": [
            "1TB",
            "2TB"
        ],
        "promoText": "Bảo hành chính hãng 36 tháng Samsung VN 1 đổi 1"
    },
    {
        "id": 802,
        "name": "Ổ cứng di động SSD SanDisk Extreme Portable E61 1TB 1050MB/s",
        "category": "storage",
        "brand": "SanDisk",
        "price": 2590000,
        "originalPrice": 3190000,
        "discountPercent": 19,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/c/o-cung-di-dong-ssd-sandisk-extreme-portable-1tb-v2.png",
        "rating": 4.9,
        "reviewsCount": 148,
        "isFlashSale": false,
        "totalStock": 38,
        "installment": false,
        "smemberDiscount": "Giảm 80k",
        "specs": {
            "screen": "Thiết kế móc khóa Carabiner gắn balo du lịch tiện lợi",
            "cpu": "Công nghệ NVMe tốc độ đọc 1.050 MB/s, ghi 1.000 MB/s",
            "ram": "Chuẩn chống nước chống bụi IP65",
            "rom": "1 TB",
            "battery": "Tương thích MacBook, Windows, iPad và iPhone Type-C",
            "camera": "Bảo mật dữ liệu bằng mật khẩu phần cứng 256-bit AES"
        },
        "colors": [
            "Đen Cam",
            "Xanh Monterey"
        ],
        "storageOptions": [
            "1TB",
            "2TB"
        ],
        "promoText": "Bảo hành chính hãng 60 tháng (5 năm) 1 đổi 1"
    },
    {
        "id": 803,
        "name": "Thẻ nhớ MicroSDXC SanDisk Extreme Pro 256GB 200MB/s 4K UHD",
        "category": "storage",
        "brand": "SanDisk",
        "price": 690000,
        "originalPrice": 890000,
        "discountPercent": 22,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/h/the-nho-microsdxc-sandisk-extreme-pro-128gb.png",
        "rating": 4.9,
        "reviewsCount": 310,
        "isFlashSale": false,
        "totalStock": 80,
        "installment": false,
        "smemberDiscount": "Giảm 30k",
        "specs": {
            "screen": "Chuẩn tốc độ UHS-I U3, V30, A2 chuyên quay 4K UHD",
            "cpu": "Tốc độ đọc lên đến 200 MB/s, tốc độ ghi 140 MB/s",
            "ram": "Tối ưu cho Flycam DJI, GoPro, Nintendo Switch & Điện thoại",
            "rom": "256 GB",
            "battery": "Chống nước, chống sốc, chống tia X sân bay",
            "camera": "Kèm Adapter SD và phần mềm cứu dữ liệu RescuePRO Deluxe"
        },
        "colors": [
            "Đen Đỏ Extreme Pro"
        ],
        "storageOptions": [
            "128GB",
            "256GB",
            "512GB"
        ],
        "promoText": "Bảo hành trọn đời chính hãng SanDisk Việt Nam"
    },
    {
        "id": 804,
        "name": "USB 2 đầu Type-C & USB-A Kingston DataTraveler MicroDuo 3C 128GB",
        "category": "storage",
        "brand": "Kingston",
        "price": 350000,
        "originalPrice": 490000,
        "discountPercent": 29,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/u/s/usb-kingston-datatraveler-microduo-3c-128gb.png",
        "rating": 4.8,
        "reviewsCount": 220,
        "isFlashSale": false,
        "totalStock": 90,
        "installment": false,
        "smemberDiscount": "Giảm 20k",
        "specs": {
            "screen": "Thiết kế 2 đầu cắm kép USB Type-C và USB Type-A tiện lợi",
            "cpu": "Chuẩn USB 3.2 Gen 1 tốc độ đọc lên đến 200 MB/s",
            "ram": "Chép ảnh trực tiếp từ iPhone 15/16, iPad sang Laptop",
            "rom": "128 GB",
            "battery": "Nắp xoay bảo vệ thông minh siêu nhỏ gọn",
            "camera": "Hỗ trợ OTG cắm là nhận ngay không cần cài đặt"
        },
        "colors": [
            "Bạc Tím"
        ],
        "storageOptions": [
            "64GB",
            "128GB",
            "256GB"
        ],
        "promoText": "Bảo hành 60 tháng (5 năm) chính hãng Kingston"
    },
    {
        "id": 901,
        "name": "iPhone 15 Pro Max 256GB Cũ Đẹp 99% - Pin 98% Nguyên Bản",
        "category": "used",
        "brand": "Apple",
        "price": 24990000,
        "originalPrice": 28990000,
        "discountPercent": 14,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
        "rating": 5.0,
        "reviewsCount": 145,
        "isFlashSale": true,
        "soldCount": 14,
        "totalStock": 15,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 400k",
        "specs": {
            "screen": "6.7 inch Super Retina XDR 120Hz (Ngoại hình đẹp keng 99%)",
            "cpu": "Apple A17 Pro 3nm - Đã kiểm định 30 bước VinhCare",
            "ram": "8 GB",
            "rom": "256 GB Bản Quốc Tế VN/A",
            "battery": "Pin zin nguyên bản 95% - 99%, cam kết chưa bung mở",
            "camera": "48MP Main + 12MP Tele 5x + 12MP Ultra-wide"
        },
        "colors": [
            "Titan Tự Nhiên",
            "Titan Xanh",
            "Titan Đen"
        ],
        "storageOptions": [
            "256GB Like New 99%"
        ],
        "promoText": "Bao test 1 đổi 1 trong 30 ngày • Bảo hành 12 tháng như máy mới • Tặng sạc 20W"
    },
    {
        "id": 902,
        "name": "iPhone 14 Pro Max 128GB Cũ Đẹp 99% - Zin Nguyên Áp Suất",
        "category": "used",
        "brand": "Apple",
        "price": 19490000,
        "originalPrice": 22990000,
        "discountPercent": 15,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro_2__5.png",
        "rating": 4.9,
        "reviewsCount": 210,
        "isFlashSale": false,
        "totalStock": 18,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "6.7 inch Super Retina XDR Dynamic Island 120Hz",
            "cpu": "Apple A16 Bionic 6 nhân cực mượt",
            "ram": "6 GB",
            "rom": "128 GB Bản Quốc Tế",
            "battery": "Pin tốt > 90%, cam kết màn zin chính hãng 100%",
            "camera": "Bộ 3 camera 48MP ProRAW sắc nét"
        },
        "colors": [
            "Tím Deep Purple",
            "Vàng Gold",
            "Đen Space Black"
        ],
        "storageOptions": [
            "128GB Like New",
            "256GB Like New"
        ],
        "promoText": "Bảo hành toàn diện 12 tháng • Hỗ trợ Thu cũ lên đời không bù tiền mặt"
    },
    {
        "id": 903,
        "name": "MacBook Air M1 13.3 inch 8GB/256GB Like New 99% Sạc Ít",
        "category": "used",
        "brand": "Apple",
        "price": 13990000,
        "originalPrice": 16990000,
        "discountPercent": 18,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/air-m1-gold.png",
        "rating": 4.9,
        "reviewsCount": 178,
        "isFlashSale": false,
        "totalStock": 12,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "13.3 inch Retina IPS (2560 x 1600) True Tone",
            "cpu": "Apple M1 8 nhân siêu mát, không quạt tản nhiệt",
            "ram": "8 GB Unified",
            "rom": "256 GB SSD",
            "battery": "Pin 96% - 100% (Sạc dưới 35 lần), dùng liên tục 15 giờ",
            "camera": "Kèm bộ sạc cáp Apple Type-C 30W zin theo máy"
        },
        "colors": [
            "Xám Space Gray",
            "Bạc Silver",
            "Vàng Gold"
        ],
        "storageOptions": [
            "8GB/256GB 99%"
        ],
        "promoText": "Bảo hành 12 tháng 1 đổi 1 trong 30 ngày • Tặng túi chống sốc Tomtoc"
    },
    {
        "id": 904,
        "name": "Samsung Galaxy S23 Ultra 5G 8GB 256GB Cũ Đẹp 99% S-Pen",
        "category": "used",
        "brand": "Samsung",
        "price": 15990000,
        "originalPrice": 19490000,
        "discountPercent": 18,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s23-ultra.png",
        "rating": 4.9,
        "reviewsCount": 132,
        "isFlashSale": false,
        "totalStock": 14,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 300k",
        "specs": {
            "screen": "6.8 inch Dynamic AMOLED 2X QHD+ 120Hz",
            "cpu": "Snapdragon 8 Gen 2 for Galaxy + Cập nhật đầy đủ Galaxy AI",
            "ram": "8 GB",
            "rom": "256 GB Chính Hãng SSVN",
            "battery": "5.000 mAh nguyên zin áp suất, kèm bút S-Pen",
            "camera": "Camera mắt thần bóng đêm 200MP Zoom 100x"
        },
        "colors": [
            "Xanh Botanic",
            "Đen Phantom",
            "Kem Cotton"
        ],
        "storageOptions": [
            "256GB Đẹp 99%"
        ],
        "promoText": "Tặng củ sạc nhanh Samsung 45W • Bảo hành 12 tháng phần cứng"
    },
    {
        "id": 905,
        "name": "iPad Air 5 M1 10.9 inch Wifi 64GB Cũ Đẹp 99% Như Mới",
        "category": "used",
        "brand": "Apple",
        "price": 10990000,
        "originalPrice": 13490000,
        "discountPercent": 19,
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-5.png",
        "rating": 4.9,
        "reviewsCount": 95,
        "isFlashSale": false,
        "totalStock": 16,
        "installment": "Trả góp 0%",
        "smemberDiscount": "Giảm 200k",
        "specs": {
            "screen": "10.9 inch Liquid Retina True Tone không vết xước",
            "cpu": "Chip Apple M1 8 nhân mạnh mẽ hỗ trợ Apple Intelligence",
            "ram": "8 GB",
            "rom": "64 GB Wifi",
            "battery": "Pin 97% - 100%, ngoại hình đẹp chuẩn 99%",
            "camera": "12MP Trước Center Stage + 12MP Sau"
        },
        "colors": [
            "Xanh Blue",
            "Hồng Pink",
            "Xám Space Gray",
            "Ánh Sao"
        ],
        "storageOptions": [
            "64GB Wifi 99%"
        ],
        "promoText": "Tặng củ cáp sạc nhanh 20W + Bao da thông minh trị giá 450.000₫"
    }
],

  // Store information
  stores: [
    { name: "VinhBaPhone 134 Nguyễn Thái Học", district: "Quận 1, TP. HCM", phone: "028.7108.3134", time: "8h00 - 22h00" },
    { name: "VinhBaPhone 288 Đường 3/2", district: "Quận 10, TP. HCM", phone: "028.7108.3288", time: "8h00 - 22h00" },
    { name: "VinhBaPhone 21 Thái Hà", district: "Đống Đa, Hà Nội", phone: "024.7106.6111", time: "8h00 - 22h00" },
    { name: "VinhBaPhone 306 Cầu Giấy", district: "Cầu Giấy, Hà Nội", phone: "024.7106.6306", time: "8h00 - 22h00" },
    { name: "VinhBaPhone 123 Nguyễn Văn Linh", district: "Thanh Khê, Đà Nẵng", phone: "023.6710.9123", time: "8h00 - 22h00" }
  ],

  coupons: [
    { code: "VINHBA50", discount: 50000, minOrder: 500000, desc: "Giảm 50.000₫ cho đơn hàng từ 500k" },
    { code: "VINHMEMBER", discount: 100000, minOrder: 2000000, desc: "Giảm 100.000₫ đặc quyền hội viên VinhMember" },
    { code: "TECH500", discount: 500000, minOrder: 10000000, desc: "Giảm ngay 500.000₫ cho siêu phẩm từ 10 triệu" },
    { code: "CELLPHONES50", discount: 50000, minOrder: 500000, desc: "Giảm 50.000₫ cho đơn từ 500k" },
    { code: "SMEMBER100", discount: 100000, minOrder: 2000000, desc: "Giảm 100.000₫ đặc quyền thành viên" }
  ],

  // ── Trade-in Old Device Models & Base Values ──
  tradeInOldDevices: [
    { name: "iPhone 15 Pro Max 256GB", basePrice: 20500000 },
    { name: "iPhone 15 Pro 128GB", basePrice: 16500000 },
    { name: "iPhone 15 128GB", basePrice: 12500000 },
    { name: "iPhone 14 Pro Max 128GB", basePrice: 15500000 },
    { name: "iPhone 14 Pro 128GB", basePrice: 13000000 },
    { name: "iPhone 14 128GB", basePrice: 10000000 },
    { name: "iPhone 13 Pro Max 128GB", basePrice: 12000000 },
    { name: "iPhone 13 128GB", basePrice: 8500000 },
    { name: "iPhone 12 64GB", basePrice: 5800000 },
    { name: "iPhone 11 64GB", basePrice: 4200000 },
    { name: "Samsung Galaxy S23 Ultra 256GB", basePrice: 14000000 },
    { name: "Samsung Galaxy S22 Ultra 128GB", basePrice: 9500000 },
    { name: "Samsung Galaxy Z Fold 5 256GB", basePrice: 16000000 },
    { name: "Samsung Galaxy Z Flip 5 256GB", basePrice: 8500000 }
  ],

  // ── S-News / Tech Articles ──
  news: [
    {
      id: "news-1",
      title: "Đánh giá chi tiết iPhone 16 Pro Max: Titan Sa Mạc và Nút Camera Control có đáng tiền?",
      snippet: "Trải nghiệm thực tế sau 1 tháng sử dụng: Chip A18 Pro quá mát, pin trâu kỷ lục hơn 12 tiếng on-screen và nút chụp ảnh chuyên nghiệp.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=75",
      tag: "ĐÁNH GIÁ HOT",
      date: "Hôm nay",
      views: "15.4K"
    },
    {
      id: "news-2",
      title: "So sánh Galaxy S24 Ultra và iPhone 16 Pro Max: Chọn quyền năng AI hay sự mượt mà của iOS?",
      snippet: "Cuộc đối đầu kinh điển giữa 2 vị vua công nghệ 2026. Phân tích chi tiết về camera 200MP, bút S-Pen, màn hình chống chói và thời lượng pin.",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=75",
      tag: "SO SÁNH",
      date: "Hôm qua",
      views: "22.8K"
    },
    {
      id: "news-3",
      title: "Top 5 Laptop sinh viên - văn phòng mỏng nhẹ dưới 15 triệu pin trâu đáng mua nhất 2026",
      snippet: "Gợi ý những mẫu laptop cấu hình mạnh, màn hình IPS sắc nét, bàn phím gõ êm hỗ trợ trả góp 0% duyệt nhanh dành riêng cho học sinh, sinh viên.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=75",
      tag: "TƯ VẤN CHỌN MUA",
      date: "2 ngày trước",
      views: "9.6K"
    },
    {
      id: "news-4",
      title: "5 bước kiểm tra iPhone cũ chuẩn thợ: Tránh mua phải máy dựng, máy lock",
      snippet: "Cẩm nang mua máy lướt an tâm: Cách kiểm tra màn hình zin, 3uTools, camera, Face ID và thời hạn bảo hành điện tử Apple chính hãng.",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=75",
      tag: "MẸO CÔNG NGHỆ",
      date: "3 ngày trước",
      views: "31.2K"
    }
  ],

  // ── VinhCare Ecosystem Services ──
  vinhCareServices: [
    {
      id: "care-1",
      icon: "🔋",
      title: "Thay Pin Chính Hãng",
      desc: "Pin chuẩn EU/Apple/Samsung, bảo hành 12 tháng 1 đổi 1. Lấy ngay sau 15 phút.",
      badge: "LẤY NGAY 15P",
      badgeColor: "#059669",
      price: "Từ 350.000₫"
    },
    {
      id: "care-2",
      icon: "📱",
      title: "Thay Màn Hình Zin",
      desc: "Màn hình OLED / AMOLED chính hãng hiển thị 120Hz mượt mà, bảo hành cảm ứng 6 tháng.",
      badge: "CHÍNH HÃNG 100%",
      badgeColor: "#2563eb",
      price: "Từ 850.000₫"
    },
    {
      id: "care-3",
      icon: "🛡️",
      title: "Gói Bảo Hành VinhCare+",
      desc: "Bảo hành toàn diện rơi vỡ - vào nước. 1 đổi 1 máy mới không cần bù thêm chi phí.",
      badge: "VIP CARE",
      badgeColor: "#7c3aed",
      price: "Chỉ từ 490.000₫"
    },
    {
      id: "care-4",
      icon: "✨",
      title: "Vệ Sinh & Dán Kính Miễn Phí",
      desc: "Vệ sinh máy chuyên sâu, dán kính cường lực cao cấp miễn phí trọn đời cho VinhMember.",
      badge: "MIỄN PHÍ TRỌN ĐỜI",
      badgeColor: "#e11d48",
      price: "0₫ cho Hội viên"
    }
  ]
};

