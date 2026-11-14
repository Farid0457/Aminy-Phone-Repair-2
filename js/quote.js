/* ═══════════════════════════════════════════
   INSTANT QUOTE — pricing data + calculator
   ═══════════════════════════════════════════ */

// ─────────────────────────────────────────
// SVG ICON LIBRARY
// ─────────────────────────────────────────
const ICONS = {
  screen:`<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="2" width="22" height="28" rx="3.5" stroke="currentColor" stroke-width="1.8"/><rect x="7.5" y="5.5" width="17" height="19" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="13" y="3" width="6" height="1.5" rx="0.75" fill="currentColor" opacity="0.7"/><path d="M10 12 L13 16 L10 14 L16 22" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/></svg>`,
  battery:`<svg viewBox="0 0 32 32" fill="none"><rect x="3" y="9" width="23" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M26 13 L29 13 L29 19 L26 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="5.5" y="11.5" width="15" height="9" rx="1.5" fill="currentColor" opacity="0.25"/><rect x="5.5" y="11.5" width="10" height="9" rx="1.5" fill="currentColor" opacity="0.5"/><line x1="13" y1="14" x2="11" y2="17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="11" y1="17" x2="14" y2="17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  charging:`<svg viewBox="0 0 32 32" fill="none"><rect x="12" y="2" width="8" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="18" y1="2" x2="18" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><rect x="10" y="14" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="16" y1="22" x2="16" y2="30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17 16.5 L14.5 19.5 L17 19.5 L14.5 22.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  backglass:`<svg viewBox="0 0 32 32" fill="none"><rect x="5" y="2" width="22" height="28" rx="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M14 6 L10 14 L14 12 L10 22" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/><circle cx="10" cy="14" r="1.8" stroke="currentColor" stroke-width="1" opacity="0.6"/></svg>`,
  water:`<svg viewBox="0 0 32 32" fill="none"><path d="M16 4 C16 4 7 14 7 20 C7 25 11 28 16 28 C21 28 25 25 25 20 C25 14 16 4 16 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 22 C11 24.5 13 26 16 26" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/></svg>`,
  camera:`<svg viewBox="0 0 32 32" fill="none"><rect x="2" y="9" width="28" height="20" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M10 9 L12 4 L20 4 L22 9" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="19" r="5.5" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="19" r="2.5" stroke="currentColor" stroke-width="1.2" opacity="0.6"/></svg>`,
  speaker:`<svg viewBox="0 0 32 32" fill="none"><path d="M6 12 L6 20 L12 20 L20 26 L20 6 L12 12 Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 11 C26.5 13 26.5 19 24 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M27 8 C31 11.5 31 20.5 27 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/></svg>`,
  data:`<svg viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" rx="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="16" r="5.5" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6"/><line x1="4" y1="11" x2="28" y2="11" stroke="currentColor" stroke-width="1.1" opacity="0.4"/><line x1="4" y1="21" x2="28" y2="21" stroke="currentColor" stroke-width="1.1" opacity="0.4"/></svg>`,
  keyboard:`<svg viewBox="0 0 32 32" fill="none"><rect x="2" y="8" width="28" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8"/><rect x="5" y="11" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="10.5" y="11" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="16" y="11" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="21.5" y="11" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="5" y="16" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="10.5" y="16" width="11" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="23" y="16" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.5"/><rect x="9" y="21" width="14" height="2.5" rx="0.8" fill="currentColor" opacity="0.4"/></svg>`,
  ssd:`<svg viewBox="0 0 32 32" fill="none"><rect x="3" y="8" width="26" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8"/><rect x="6" y="11" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="20" y1="11" x2="26" y2="11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/><line x1="20" y1="14.5" x2="26" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/></svg>`,
  ram:`<svg viewBox="0 0 32 32" fill="none"><rect x="2" y="10" width="28" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="5" y="13" width="3" height="6" rx="0.8" fill="currentColor" opacity="0.55"/><rect x="10" y="13" width="3" height="6" rx="0.8" fill="currentColor" opacity="0.55"/><rect x="15" y="13" width="3" height="6" rx="0.8" fill="currentColor" opacity="0.55"/><rect x="20" y="13" width="3" height="6" rx="0.8" fill="currentColor" opacity="0.55"/><rect x="25" y="13" width="3" height="6" rx="0.8" fill="currentColor" opacity="0.55"/><line x1="5" y1="10" x2="5" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/><line x1="10" y1="10" x2="10" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/><line x1="15" y1="10" x2="15" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/><line x1="20" y1="10" x2="20" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/><line x1="25" y1="10" x2="25" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>`,
  motherboard:`<svg viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="2.5" stroke="currentColor" stroke-width="1.8"/><rect x="7" y="7" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="4" height="4" rx="0.6" fill="currentColor" opacity="0.4"/><rect x="17" y="7" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.3"/><rect x="7" y="17" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.3"/><circle cx="21" cy="21" r="2.5" stroke="currentColor" stroke-width="1.2" opacity="0.6"/></svg>`,
  crown:`<svg viewBox="0 0 32 32" fill="none"><path d="M4 24 L6 12 L12 18 L16 8 L20 18 L26 12 L28 24 Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="4" y="24" width="24" height="3" rx="1.5" stroke="currentColor" stroke-width="1.4"/><circle cx="16" cy="8" r="1.5" fill="currentColor" opacity="0.7"/></svg>`,
  general:`<svg viewBox="0 0 32 32" fill="none"><path d="M20 5 C24 7 26 12 24 16 L28 20 L20 28 L16 24 C12 26 7 24 5 20 C3 16 5 11 9 9 L13 4 Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="13" cy="16" r="3.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
};

const ICON_MAP = {
  'Screen Replacement':'screen','Battery Replacement':'battery',
  'Charging Port':'charging','Back Glass Repair':'backglass',
  'Water Damage':'water','Camera Repair':'camera',
  'Speaker / Mic Fix':'speaker','Data Recovery':'data',
  'Keyboard Repair':'keyboard','SSD Upgrade':'ssd',
  'RAM Upgrade':'ram','Motherboard Repair':'motherboard',
  'Crown Repair':'crown','Screen / Glass Repair':'screen',
};
function getIconSVG(n){ return ICONS[ICON_MAP[n]||'general']||ICONS.general; }

// ─────────────────────────────────────────
// SHARED ISSUE SETS
// ─────────────────────────────────────────
function iphoneIssues(screenPrices, battPrices){
  return [
    { name:'Screen Replacement',  time:'30–60 min', prices:{...screenPrices} },
    { name:'Battery Replacement', time:'20–40 min', prices:{...battPrices}   },
    { name:'Charging Port',       time:'30–60 min', prices:{_default:89}     },
    { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{_default:130}    },
    { name:'Water Damage',        time:'1–3 hrs',   prices:{_default:149}    },
    { name:'Camera Repair',       time:'45–90 min', prices:{_default:149}    },
    { name:'Speaker / Mic Fix',   time:'30–60 min', prices:{_default:79}     },
    { name:'Data Recovery',       time:'1–4 hrs',   prices:{_default:149}    },
  ];
}

const SAMSUNG_ISSUES = [
  { name:'Screen Replacement',  time:'30–90 min', prices:{
    'Galaxy S26 Ultra':480,'Galaxy S26 Edge':420,'Galaxy S26+':400,'Galaxy S26':340,
    'Galaxy S25 Ultra':450,'Galaxy S25+':380,'Galaxy S25':320,'Galaxy S25 FE':240,
    'Galaxy S24 Ultra':420,'Galaxy S24+':350,'Galaxy S24':290,'Galaxy S24 FE':220,
    'Galaxy S23 Ultra':380,'Galaxy S23+':320,'Galaxy S23':270,'Galaxy S23 FE':200,
    'Galaxy S22 Ultra':340,'Galaxy S22+':290,'Galaxy S22':250,
    'Galaxy S21 Ultra':300,'Galaxy S21+':260,'Galaxy S21':220,'Galaxy S21 FE':190,
    'Galaxy S20 Ultra':280,'Galaxy S20+':240,'Galaxy S20':200,'Galaxy S20 FE':170,
    'Galaxy S10+':200,'Galaxy S10':180,'Galaxy S10e':160,'Galaxy S10 5G':200,'Galaxy S10 Lite':170,
    'Galaxy S9+':170,'Galaxy S9':150,'Galaxy S8+':150,'Galaxy S8':130,
    'Galaxy S7 Edge':130,'Galaxy S7':110,
    'Galaxy Z Fold7':850,'Galaxy Z Fold6':800,'Galaxy Z Fold5':750,'Galaxy Z Fold4':700,
    'Galaxy Z Fold3 5G':650,'Galaxy Z Fold2 5G':600,'Galaxy Fold':550,
    'Galaxy Z Flip7':450,'Galaxy Z Flip6':420,'Galaxy Z Flip5':390,'Galaxy Z Flip4':360,
    'Galaxy Z Flip3 5G':320,'Galaxy Z Flip 5G':290,'Galaxy Z Flip':260,
    _default:180 }},
  { name:'Battery Replacement', time:'20–45 min', prices:{_default:89} },
  { name:'Charging Port',       time:'30–60 min', prices:{_default:89} },
  { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{_default:120} },
  { name:'Water Damage',        time:'1–3 hrs',   prices:{_default:149} },
  { name:'Camera Repair',       time:'45–90 min', prices:{_default:149} },
  { name:'Speaker / Mic Fix',   time:'30–60 min', prices:{_default:79} },
  { name:'Data Recovery',       time:'1–4 hrs',   prices:{_default:149} },
];

const PIXEL_ISSUES = [
  { name:'Screen Replacement',  time:'1–2 hrs',   prices:{ 'Pixel 10 Pro Fold':550,'Pixel 9 Pro Fold':500,'Pixel Fold':450,'Pixel 10 Pro XL':380,'Pixel 10 Pro':350,'Pixel 10':280,'Pixel 10a':220,'Pixel 9 Pro XL':340,'Pixel 9 Pro':310,'Pixel 9':260,'Pixel 9a':200,'Pixel 8 Pro':290,'Pixel 8':230,'Pixel 8a':180,'Pixel 7 Pro':250,'Pixel 7':200,'Pixel 7a':170,'Pixel 6 Pro':230,'Pixel 6':180,'Pixel 6a':160,'Pixel 5':170,'Pixel 5a (5G)':160,'Pixel 4 XL':160,'Pixel 4':150,'Pixel 4a (5G)':150,'Pixel 4a':140,'Pixel 3 XL':140,'Pixel 3':130,'Pixel 3a XL':130,'Pixel 3a':120,'Pixel 2 XL':130,'Pixel 2':120,'Pixel XL':110,'Pixel (1st Gen)':100, _default:180 } },
  { name:'Battery Replacement', time:'1–2 hrs',   prices:{ _default:89  } },
  { name:'Charging Port',       time:'1 hr',      prices:{ _default:89  } },
  { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{ _default:120 } },
  { name:'Water Damage',        time:'1–3 hrs',   prices:{ _default:149 } },
  { name:'Camera Repair',       time:'45–90 min', prices:{ 'Pixel 10 Pro Fold':220,'Pixel 10 Pro XL':200,'Pixel 10 Pro':190,'Pixel 9 Pro Fold':210,'Pixel 9 Pro XL':190,'Pixel 9 Pro':180, _default:149 } },
  { name:'Speaker / Mic Fix',   time:'30–60 min', prices:{ _default:79  } },
  { name:'Data Recovery',       time:'1–4 hrs',   prices:{ _default:149 } },
];

const STAB_ISSUES = [
  { name:'Screen Replacement', time:'1–2 hrs', prices:{
    'Galaxy Tab S11 Ultra':520,'Galaxy Tab S11':380,
    'Galaxy Tab S10 Ultra':490,'Galaxy Tab S10+':400,'Galaxy Tab S10 FE+':300,'Galaxy Tab S10 FE':260,'Galaxy Tab S10 Lite':220,
    'Galaxy Tab S9 Ultra':460,'Galaxy Tab S9+':380,'Galaxy Tab S9':320,'Galaxy Tab S9 FE+':280,'Galaxy Tab S9 FE':240,
    'Galaxy Tab S8 Ultra':430,'Galaxy Tab S8+':360,'Galaxy Tab S8':300,
    'Galaxy Tab S7+':320,'Galaxy Tab S7':270,'Galaxy Tab S7 FE':240,
    'Galaxy Tab S6':240,'Galaxy Tab S5e':200,'Galaxy Tab S4':200,'Galaxy Tab S3':180,
    _default:220 }},
  { name:'Battery Replacement', time:'1–2 hrs', prices:{ _default:119 }},
  { name:'Charging Port',       time:'1 hr',    prices:{ _default:99  }},
  { name:'Water Damage',        time:'2–4 hrs', prices:{ _default:169 }},
  { name:'Camera Repair',       time:'1–2 hrs', prices:{ _default:149 }},
  { name:'Speaker / Mic Fix',   time:'1 hr',    prices:{ _default:99  }},
  { name:'Data Recovery',       time:'1–4 hrs', prices:{ _default:159 }},
];

const MOTO_ISSUES = [
  { name:'Screen Replacement',  time:'1–2 hrs',   prices:{
    'Motorola Razr 60':420,'Motorola Razr 50 Ultra':380,'Motorola Razr 50':320,
    'Motorola Razr 40 Ultra':350,'Motorola Razr 40':290,'Motorola Razr 2022':260,
    'Motorola Edge 2026':340,'Motorola Edge 2025':300,'Motorola Edge 60 Pro':280,
    'Motorola Edge 50 Ultra':260,'Motorola Edge 50 Pro':240,'Motorola Edge 40 Pro':220,
    'Motorola ThinkPhone':220, _default:170 } },
  { name:'Battery Replacement', time:'1–2 hrs',   prices:{ _default:89  } },
  { name:'Charging Port',       time:'1 hr',      prices:{ _default:89  } },
  { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{ _default:110 } },
  { name:'Water Damage',        time:'1–3 hrs',   prices:{ _default:149 } },
  { name:'Camera Repair',       time:'45–90 min', prices:{ 'Motorola Edge 2026':170,'Motorola Edge 50 Ultra':160,'Motorola Edge 40 Pro':150, _default:129 } },
  { name:'Speaker / Mic Fix',   time:'30–60 min', prices:{ _default:79  } },
  { name:'Data Recovery',       time:'1–4 hrs',   prices:{ _default:149 } },
];

const OPPO_ISSUES = [
  { name:'Screen Replacement',  time:'1–2 hrs',   prices:{
    'OPPO Find N6':480,'OPPO Find N3':420,'OPPO Find N3 Flip':380,'OPPO Find N2 Flip':350,
    'OPPO Find X9 Pro':380,'OPPO Find X9':320,'OPPO Find X8 Pro':350,'OPPO Find X7 Ultra':380,
    'OPPO Find X6 Pro':320,'OPPO Find X5 Pro':280,'OPPO Find X5':240,'OPPO Find X3 Pro':260,
    _default:180 } },
  { name:'Battery Replacement', time:'1–2 hrs',   prices:{ _default:89  } },
  { name:'Charging Port',       time:'1 hr',      prices:{ _default:89  } },
  { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{ _default:110 } },
  { name:'Water Damage',        time:'1–3 hrs',   prices:{ _default:149 } },
  { name:'Camera Repair',       time:'45–90 min', prices:{ 'OPPO Find N6':200,'OPPO Find X9 Pro':190,'OPPO Find X8 Pro':180, _default:139 } },
  { name:'Speaker / Mic Fix',   time:'30–60 min', prices:{ _default:79  } },
  { name:'Data Recovery',       time:'1–4 hrs',   prices:{ _default:149 } },
];

// ─────────────────────────────────────────
// PRICING DATA
// ─────────────────────────────────────────
const QUOTE_DATA = {

  // placeholders — sub-series chosen via series picker
  iphone:  { label:'iPhone',      models:[], issues:[] },
  samsung: { label:'Samsung',     models:[], issues:[] },
  google:  { label:'Google Pixel',models:[], issues:[] },

  // ── iPhone series ──
  iphone_17: {
    label:'iPhone 17 Series',
    models:['iPhone 17 Pro Max','iPhone 17 Pro','iPhone Air','iPhone 17'],
    issues: iphoneIssues(
      { 'iPhone 17 Pro Max':460,'iPhone 17 Pro':420,'iPhone Air':380,'iPhone 17':340, _default:380 },
      { 'iPhone 17 Pro Max':139,'iPhone 17 Pro':129,'iPhone Air':119,'iPhone 17':109, _default:119 }
    ),
  },
  iphone_16: {
    label:'iPhone 16 Series',
    models:['iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16 Plus','iPhone 16','iPhone 16e'],
    issues: iphoneIssues(
      {'iPhone 16 Pro Max':420,'iPhone 16 Pro':390,'iPhone 16 Plus':360,'iPhone 16':320,'iPhone 16e':220,_default:320},
      {'iPhone 16 Pro Max':129,'iPhone 16 Pro':119,'iPhone 16 Plus':109,'iPhone 16':99,'iPhone 16e':89,_default:99}
    ),
  },
  iphone_15: {
    label:'iPhone 15 Series',
    models:['iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15 Plus','iPhone 15'],
    issues: iphoneIssues(
      {'iPhone 15 Pro Max':380,'iPhone 15 Pro':350,'iPhone 15 Plus':320,'iPhone 15':290,_default:320},
      {'iPhone 15 Pro Max':119,'iPhone 15 Pro':109,'iPhone 15 Plus':99,'iPhone 15':89,_default:99}
    ),
  },
  iphone_14: {
    label:'iPhone 14 Series',
    models:['iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14 Plus','iPhone 14'],
    issues: iphoneIssues(
      {'iPhone 14 Pro Max':340,'iPhone 14 Pro':310,'iPhone 14 Plus':280,'iPhone 14':250,_default:290},
      {_default:89}
    ),
  },
  iphone_13: {
    label:'iPhone 13 Series',
    models:['iPhone 13 Pro Max','iPhone 13 Pro','iPhone 13','iPhone 13 mini'],
    issues: iphoneIssues(
      {'iPhone 13 Pro Max':300,'iPhone 13 Pro':270,'iPhone 13':230,'iPhone 13 mini':210,_default:250},
      {_default:89}
    ),
  },
  iphone_12: {
    label:'iPhone 12 Series',
    models:['iPhone 12 Pro Max','iPhone 12 Pro','iPhone 12','iPhone 12 mini'],
    issues: iphoneIssues(
      {'iPhone 12 Pro Max':280,'iPhone 12 Pro':250,'iPhone 12':220,'iPhone 12 mini':200,_default:230},
      {_default:89}
    ),
  },
  iphone_11: {
    label:'iPhone 11 Series',
    models:['iPhone 11 Pro Max','iPhone 11 Pro','iPhone 11'],
    issues: iphoneIssues(
      {'iPhone 11 Pro Max':260,'iPhone 11 Pro':240,'iPhone 11':180,_default:220},
      {_default:89}
    ),
  },
  iphone_x: {
    label:'iPhone X Series',
    models:['iPhone XS Max','iPhone XS','iPhone XR','iPhone X'],
    issues: iphoneIssues(
      {'iPhone XS Max':240,'iPhone XS':220,'iPhone XR':160,'iPhone X':200,_default:200},
      {_default:89}
    ),
  },
  iphone_older: {
    label:'iPhone 8 & Older',
    models:[
      'iPhone 8 Plus','iPhone 8',
      'iPhone 7 Plus','iPhone 7',
      'iPhone 6s Plus','iPhone 6s',
      'iPhone 6 Plus','iPhone 6',
      'iPhone 5s','iPhone 5c','iPhone 5',
      'iPhone 4S','iPhone 4','iPhone 3GS','iPhone 3G','iPhone (1st Gen)',
      'iPhone SE (3rd Gen)','iPhone SE (2nd Gen)','iPhone SE (1st Gen)',
    ],
    issues: iphoneIssues(
      {'iPhone 8 Plus':160,'iPhone 8':140,'iPhone 7 Plus':150,'iPhone 7':130,
       'iPhone 6s Plus':130,'iPhone 6s':120,'iPhone 6 Plus':120,'iPhone 6':110,
       'iPhone 5s':99,'iPhone 5c':99,'iPhone 5':99,
       'iPhone SE (3rd Gen)':140,'iPhone SE (2nd Gen)':130,'iPhone SE (1st Gen)':99,
       _default:110},
      {_default:69}
    ),
  },

  // ── Samsung series ──
  samsung_s: {
    label:'Galaxy S Series',
    models:[
      'Galaxy S26 Ultra','Galaxy S26 Edge','Galaxy S26+','Galaxy S26',
      'Galaxy S25 Ultra','Galaxy S25+','Galaxy S25','Galaxy S25 FE',
      'Galaxy S24 Ultra','Galaxy S24+','Galaxy S24','Galaxy S24 FE',
      'Galaxy S23 Ultra','Galaxy S23+','Galaxy S23','Galaxy S23 FE',
      'Galaxy S22 Ultra','Galaxy S22+','Galaxy S22',
      'Galaxy S21 Ultra','Galaxy S21+','Galaxy S21','Galaxy S21 FE',
      'Galaxy S20 Ultra','Galaxy S20+','Galaxy S20','Galaxy S20 FE',
      'Galaxy S10+','Galaxy S10','Galaxy S10e','Galaxy S10 5G','Galaxy S10 Lite',
      'Galaxy S9+','Galaxy S9','Galaxy S8+','Galaxy S8',
      'Galaxy S7 Edge','Galaxy S7',
      'Galaxy S6 Edge+','Galaxy S6 Edge','Galaxy S6',
      'Galaxy S5','Galaxy S5 Mini','Galaxy S4','Galaxy S4 Mini','Galaxy S4 Active',
      'Galaxy S III','Galaxy S III Mini','Galaxy S II','Galaxy S',
    ],
    issues: SAMSUNG_ISSUES,
  },
  samsung_a: {
    label:'Galaxy A Series',
    models:[
      'Galaxy A57 5G','Galaxy A37 5G','Galaxy A26 5G','Galaxy A17 5G / 4G',
      'Galaxy A56 5G','Galaxy A36 5G','Galaxy A16 5G','Galaxy A06',
      'Galaxy A55 5G','Galaxy A35 5G','Galaxy A25 5G','Galaxy A15 5G / 4G','Galaxy A05s','Galaxy A05',
      'Galaxy A73 5G','Galaxy A54 5G','Galaxy A53 5G','Galaxy A52s 5G','Galaxy A52 5G / 4G','Galaxy A42 5G',
      'Galaxy A34 5G','Galaxy A33 5G','Galaxy A32 5G / 4G','Galaxy A23 5G / 4G','Galaxy A22 5G / 4G',
      'Galaxy A14 5G / 4G','Galaxy A13 5G / 4G','Galaxy A12','Galaxy A04s','Galaxy A04','Galaxy A03s','Galaxy A02s',
      'Galaxy A90 5G','Galaxy A80','Galaxy A72','Galaxy A71 5G / 4G','Galaxy A70',
      'Galaxy A51 5G / 4G','Galaxy A50','Galaxy A41','Galaxy A40','Galaxy A31','Galaxy A30',
      'Galaxy A21s','Galaxy A21','Galaxy A20','Galaxy A11','Galaxy A10',
      'Galaxy A8','Galaxy A7','Galaxy A5','Galaxy A3','Galaxy Alpha',
    ],
    issues: SAMSUNG_ISSUES,
  },
  samsung_z: {
    label:'Galaxy Z Series',
    models:[
      'Galaxy Z Fold7','Galaxy Z Fold6','Galaxy Z Fold5','Galaxy Z Fold4',
      'Galaxy Z Fold3 5G','Galaxy Z Fold2 5G','Galaxy Fold',
      'Galaxy Z Flip7','Galaxy Z Flip6','Galaxy Z Flip5','Galaxy Z Flip4',
      'Galaxy Z Flip3 5G','Galaxy Z Flip 5G','Galaxy Z Flip',
    ],
    issues: SAMSUNG_ISSUES,
  },

  pixel_10: {
    label:'Pixel 10 Series',
    models:['Pixel 10 Pro Fold','Pixel 10 Pro XL','Pixel 10 Pro','Pixel 10','Pixel 10a'],
    issues: PIXEL_ISSUES,
  },
  pixel_9: {
    label:'Pixel 9 Series',
    models:['Pixel 9 Pro Fold','Pixel 9 Pro XL','Pixel 9 Pro','Pixel 9','Pixel 9a'],
    issues: PIXEL_ISSUES,
  },
  pixel_older: {
    label:'Pixel 8 & Older',
    models:[
      'Pixel 8 Pro','Pixel 8','Pixel 8a',
      'Pixel 7 Pro','Pixel 7','Pixel 7a',
      'Pixel 6 Pro','Pixel 6','Pixel 6a',
      'Pixel 5','Pixel 5a (5G)',
      'Pixel 4 XL','Pixel 4','Pixel 4a (5G)','Pixel 4a',
      'Pixel 3 XL','Pixel 3','Pixel 3a XL','Pixel 3a',
      'Pixel 2 XL','Pixel 2',
      'Pixel XL','Pixel (1st Gen)',
      'Pixel Fold',
    ],
    issues: PIXEL_ISSUES,
  },

  // ── Other devices ──
  ipad_series: { label:'iPad', models:[], issues:[] },

  ipad_pro: {
    label:'iPad Pro',
    models:[
      'iPad Pro 13-inch (M5)','iPad Pro 11-inch (M5)',
      'iPad Pro 13-inch (M4)','iPad Pro 11-inch (M4)',
      'iPad Pro 12.9-inch (6th Gen)','iPad Pro 11-inch (4th Gen)',
      'iPad Pro 12.9-inch (5th Gen)','iPad Pro 11-inch (3rd Gen)',
      'iPad Pro 12.9-inch (4th Gen)','iPad Pro 11-inch (2nd Gen)',
      'iPad Pro 12.9-inch (3rd Gen)','iPad Pro 11-inch (1st Gen)',
      'iPad Pro 12.9-inch (2nd Gen)',
      'iPad Pro 10.5-inch',
      'iPad Pro 12.9-inch (1st Gen)',
      'iPad Pro 9.7-inch',
    ],
    issues:[
      { name:'Screen Replacement', time:'1–2 hrs', prices:{
        'iPad Pro 13-inch (M5)':480,'iPad Pro 11-inch (M5)':400,
        'iPad Pro 13-inch (M4)':450,'iPad Pro 11-inch (M4)':380,
        'iPad Pro 12.9-inch (6th Gen)':420,'iPad Pro 11-inch (4th Gen)':360,
        'iPad Pro 12.9-inch (5th Gen)':400,'iPad Pro 11-inch (3rd Gen)':340,
        'iPad Pro 12.9-inch (4th Gen)':370,'iPad Pro 11-inch (2nd Gen)':320,
        'iPad Pro 12.9-inch (3rd Gen)':350,'iPad Pro 11-inch (1st Gen)':300,
        'iPad Pro 12.9-inch (2nd Gen)':320,'iPad Pro 10.5-inch':280,
        'iPad Pro 12.9-inch (1st Gen)':300,'iPad Pro 9.7-inch':260,
        _default:320 }},
      { name:'Battery Replacement', time:'1–2 hrs', prices:{ _default:129 }},
      { name:'Charging Port',       time:'1 hr',    prices:{ _default:109 }},
      { name:'Water Damage',        time:'2–4 hrs', prices:{ _default:179 }},
      { name:'Camera Repair',       time:'1–2 hrs', prices:{ _default:159 }},
      { name:'Speaker / Mic Fix',   time:'1 hr',    prices:{ _default:99  }},
      { name:'Data Recovery',       time:'1–4 hrs', prices:{ _default:159 }},
    ],
  },

  ipad_air: {
    label:'iPad Air',
    models:[
      'iPad Air 13-inch (M4)','iPad Air 11-inch (M4)',
      'iPad Air 13-inch (M2)','iPad Air 11-inch (M2)',
      'iPad Air (5th Gen)','iPad Air (4th Gen)',
      'iPad Air (3rd Gen)','iPad Air 2','iPad Air (1st Gen)',
    ],
    issues:[
      { name:'Screen Replacement', time:'1–2 hrs', prices:{
        'iPad Air 13-inch (M4)':370,'iPad Air 11-inch (M4)':310,
        'iPad Air 13-inch (M2)':350,'iPad Air 11-inch (M2)':290,
        'iPad Air (5th Gen)':260,'iPad Air (4th Gen)':240,
        'iPad Air (3rd Gen)':210,'iPad Air 2':180,'iPad Air (1st Gen)':160,
        _default:250 }},
      { name:'Battery Replacement', time:'1–2 hrs', prices:{ _default:119 }},
      { name:'Charging Port',       time:'1 hr',    prices:{ _default:99  }},
      { name:'Water Damage',        time:'2–4 hrs', prices:{ _default:169 }},
      { name:'Camera Repair',       time:'1–2 hrs', prices:{ _default:149 }},
      { name:'Speaker / Mic Fix',   time:'1 hr',    prices:{ _default:99  }},
      { name:'Data Recovery',       time:'1–4 hrs', prices:{ _default:149 }},
    ],
  },

  ipad_mini: {
    label:'iPad mini',
    models:[
      'iPad mini (A17 Pro)',
      'iPad mini (6th Gen)','iPad mini (5th Gen)',
      'iPad mini 4','iPad mini 3','iPad mini 2','iPad mini (1st Gen)',
    ],
    issues:[
      { name:'Screen Replacement', time:'1–2 hrs', prices:{
        'iPad mini (A17 Pro)':280,'iPad mini (6th Gen)':250,'iPad mini (5th Gen)':220,
        'iPad mini 4':190,'iPad mini 3':170,'iPad mini 2':160,'iPad mini (1st Gen)':150,
        _default:220 }},
      { name:'Battery Replacement', time:'1–2 hrs', prices:{ _default:109 }},
      { name:'Charging Port',       time:'1 hr',    prices:{ _default:89  }},
      { name:'Water Damage',        time:'1–3 hrs', prices:{ _default:149 }},
      { name:'Camera Repair',       time:'1 hr',    prices:{ _default:129 }},
      { name:'Speaker / Mic Fix',   time:'1 hr',    prices:{ _default:89  }},
      { name:'Data Recovery',       time:'1–4 hrs', prices:{ _default:149 }},
    ],
  },

  ipad_standard: {
    label:'iPad (Standard)',
    models:[
      'iPad (11th Gen / A16)','iPad (10th Gen)',
      'iPad (9th Gen)','iPad (8th Gen)','iPad (7th Gen)',
      'iPad (6th Gen)','iPad (5th Gen)',
      'iPad 4','iPad 3','iPad 2','iPad (1st Gen)',
    ],
    issues:[
      { name:'Screen Replacement', time:'1–2 hrs', prices:{
        'iPad (11th Gen / A16)':270,'iPad (10th Gen)':250,
        'iPad (9th Gen)':200,'iPad (8th Gen)':190,'iPad (7th Gen)':180,
        'iPad (6th Gen)':170,'iPad (5th Gen)':160,
        'iPad 4':140,'iPad 3':130,'iPad 2':120,'iPad (1st Gen)':110,
        _default:200 }},
      { name:'Battery Replacement', time:'1–2 hrs', prices:{ _default:109 }},
      { name:'Charging Port',       time:'1 hr',    prices:{ _default:89  }},
      { name:'Water Damage',        time:'2–4 hrs', prices:{ _default:159 }},
      { name:'Camera Repair',       time:'1 hr',    prices:{ _default:129 }},
      { name:'Speaker / Mic Fix',   time:'1 hr',    prices:{ _default:89  }},
      { name:'Data Recovery',       time:'1–4 hrs', prices:{ _default:149 }},
    ],
  },

  laptop: {
    label:'MacBook',
    models:[
      'MacBook Pro 16" (M4)','MacBook Pro 14" (M4)',
      'MacBook Pro 16" (M3)','MacBook Pro 14" (M3)',
      'MacBook Air 15" (M3)','MacBook Air 13" (M3)',
      'MacBook Air 15" (M2)','MacBook Air 13" (M2)',
    ],
    issues:[
      { name:'Screen Replacement',  time:'1–3 hrs', prices:{'MacBook Pro 16" (M4)':680,'MacBook Pro 14" (M4)':580,'MacBook Pro 16" (M3)':650,'MacBook Pro 14" (M3)':550,'MacBook Air 15" (M3)':480,'MacBook Air 13" (M3)':420,_default:299} },
      { name:'Battery Replacement', time:'1–2 hrs', prices:{'MacBook Pro 16" (M4)':249,'MacBook Pro 14" (M4)':229,_default:179} },
      { name:'Keyboard Repair',     time:'1–3 hrs', prices:{_default:199} },
      { name:'Water Damage',        time:'2–5 hrs', prices:{_default:249} },
      { name:'SSD Upgrade',         time:'1–2 hrs', prices:{_default:199} },
      { name:'Charging Port',       time:'1–2 hrs', prices:{_default:149} },
      { name:'Motherboard Repair',  time:'2–5 hrs', prices:{_default:349} },
      { name:'Data Recovery',       time:'1–4 hrs', prices:{_default:179} },
    ],
  },
  laptop_pc: {
    label:'All Laptops',
    models:[
      'Dell XPS 13 / 15','Dell Inspiron','HP Spectre x360','HP Pavilion',
      'Lenovo ThinkPad X1','Lenovo IdeaPad','ASUS ZenBook','ASUS VivoBook',
      'Microsoft Surface Pro','Microsoft Surface Laptop',
      'Acer Swift','Acer Aspire','Razer Blade','Other Windows Laptop',
    ],
    issues:[
      { name:'Screen Replacement',  time:'1–3 hrs', prices:{_default:249} },
      { name:'Battery Replacement', time:'1–2 hrs', prices:{_default:149} },
      { name:'Keyboard Repair',     time:'1–3 hrs', prices:{_default:179} },
      { name:'Water Damage',        time:'2–5 hrs', prices:{_default:219} },
      { name:'SSD Upgrade',         time:'1–2 hrs', prices:{_default:179} },
      { name:'Charging Port',       time:'1–2 hrs', prices:{_default:129} },
      { name:'RAM Upgrade',         time:'1 hr',    prices:{_default:129} },
      { name:'Motherboard Repair',  time:'2–5 hrs', prices:{_default:299} },
    ],
  },
  watch: {
    label:'Apple Watch',
    models:[
      'Apple Watch Ultra 2','Apple Watch Ultra',
      'Apple Watch Series 10','Apple Watch Series 9',
      'Apple Watch Series 8','Apple Watch Series 7',
      'Apple Watch SE (2nd Gen)','Apple Watch SE (1st Gen)',
    ],
    issues:[
      { name:'Screen / Glass Repair', time:'1–2 hrs', prices:{'Apple Watch Ultra 2':280,'Apple Watch Ultra':260,'Apple Watch Series 10':200,'Apple Watch Series 9':180,'Apple Watch Series 8':160,'Apple Watch Series 7':150,_default:130} },
      { name:'Battery Replacement',   time:'1–2 hrs', prices:{_default:99}  },
      { name:'Crown Repair',          time:'1 hr',    prices:{_default:89}  },
      { name:'Water Damage',          time:'1–3 hrs', prices:{_default:129} },
    ],
  },

  oppo:  { label:'OPPO', models:[], issues:[] },

  oppo_find_n: {
    label:'OPPO Find N Series',
    models:[
      'OPPO Find N6',
      'OPPO Find N3',
      'OPPO Find N3 Flip',
      'OPPO Find N2 Flip',
    ],
    issues: OPPO_ISSUES,
  },

  oppo_find_x: {
    label:'OPPO Find X Series',
    models:[
      'OPPO Find X9 Pro','OPPO Find X9',
      'OPPO Find X8 Pro',
      'OPPO Find X7 Ultra',
      'OPPO Find X6 Pro',
      'OPPO Find X5 Pro','OPPO Find X5','OPPO Find X5 Lite',
      'OPPO Find X3 Pro','OPPO Find X3 Neo','OPPO Find X3 Lite',
      'OPPO Find X2 Pro','OPPO Find X2 Neo','OPPO Find X2 Lite',
      'OPPO Find X',
    ],
    issues: OPPO_ISSUES,
  },

  oppo_reno: {
    label:'OPPO Reno Series',
    models:[
      'OPPO Reno15 Pro 5G','OPPO Reno15 F 5G',
      'OPPO Reno13 5G','OPPO Reno13 F 5G',
      'OPPO Reno12 Pro 5G','OPPO Reno12 5G','OPPO Reno12 F 5G',
      'OPPO Reno11 F 5G',
      'OPPO Reno10 5G',
      'OPPO Reno8 Pro 5G','OPPO Reno8 5G','OPPO Reno8 Z 5G',
      'OPPO Reno7 5G','OPPO Reno7 Z 5G',
      'OPPO Reno5 5G',
      'OPPO Reno4 5G','OPPO Reno4 Z 5G',
      'OPPO Reno2 Z',
      'OPPO Reno 5G','OPPO Reno Z',
    ],
    issues: OPPO_ISSUES,
  },

  oppo_a: {
    label:'OPPO A Series',
    models:[
      'OPPO A6 5G','OPPO A6x 5G','OPPO A6x 4G','OPPO A60',
      'OPPO A5 Pro 5G','OPPO A5 5G','OPPO A5 4G','OPPO A5x','OPPO A40',
      'OPPO A98 5G','OPPO A79 5G','OPPO A58','OPPO A38','OPPO A18',
      'OPPO A96','OPPO A78 5G','OPPO A76','OPPO A57','OPPO A54 5G','OPPO A16s',
      'OPPO A94 5G','OPPO A74','OPPO A53s','OPPO A53',
      'OPPO A91','OPPO A72','OPPO A52','OPPO A31',
      'OPPO A9 2020','OPPO A5 2020','OPPO A7','OPPO A3s',
    ],
    issues: OPPO_ISSUES,
  },

  samsung_tab: { label:'Samsung Tablet', models:[], issues:[] },

  stab_s: {
    label:'Galaxy Tab S Series',
    models:[
      'Galaxy Tab S11 Ultra','Galaxy Tab S11',
      'Galaxy Tab S10 Ultra','Galaxy Tab S10+','Galaxy Tab S10 FE+','Galaxy Tab S10 FE','Galaxy Tab S10 Lite',
      'Galaxy Tab S9 Ultra','Galaxy Tab S9+','Galaxy Tab S9','Galaxy Tab S9 FE+','Galaxy Tab S9 FE',
      'Galaxy Tab S8 Ultra','Galaxy Tab S8+','Galaxy Tab S8',
      'Galaxy Tab S7+','Galaxy Tab S7','Galaxy Tab S7 FE',
      'Galaxy Tab S6','Galaxy Tab S6 Lite (2024)','Galaxy Tab S6 Lite (2022)','Galaxy Tab S6 Lite',
      'Galaxy Tab S5e','Galaxy Tab S4','Galaxy Tab S3',
      'Galaxy Tab S2 9.7-inch','Galaxy Tab S2 8.0-inch',
      'Galaxy Tab S 10.5-inch','Galaxy Tab S 8.4-inch',
    ],
    issues: STAB_ISSUES,
  },

  stab_a: {
    label:'Galaxy Tab A Series',
    models:[
      'Galaxy Tab A11+','Galaxy Tab A11+ Kids Edition','Galaxy Tab A11',
      'Galaxy Tab A9+','Galaxy Tab A9',
      'Galaxy Tab A8','Galaxy Tab A7','Galaxy Tab A7 Lite',
      'Galaxy Tab A 10.1','Galaxy Tab A 8.0','Galaxy Tab A 10.5',
      'Galaxy Tab A 9.7','Galaxy Tab A 7.0',
    ],
    issues: STAB_ISSUES,
  },

  stab_active: {
    label:'Galaxy Tab Active Series',
    models:[
      'Galaxy Tab Active5 Pro','Galaxy Tab Active5',
      'Galaxy Tab Active4 Pro','Galaxy Tab Active3',
      'Galaxy Tab Active Pro','Galaxy Tab Active 2','Galaxy Tab Active',
    ],
    issues: STAB_ISSUES,
  },

  stab_legacy: {
    label:'Legacy & Note Tablets',
    models:[
      'Galaxy Note Pro 12.2','Galaxy Note 10.1','Galaxy Note 8.0',
      'Galaxy Tab E',
      'Galaxy Tab Pro 12.2','Galaxy Tab Pro 10.1','Galaxy Tab Pro 8.4',
      'Galaxy Tab 4 10.1','Galaxy Tab 4 8.0','Galaxy Tab 4 7.0',
      'Galaxy Tab 3 10.1','Galaxy Tab 3 8.0','Galaxy Tab 3 7.0','Galaxy Tab 3 Lite',
      'Galaxy Tab 2 10.1','Galaxy Tab 2 7.0',
      'Galaxy Tab 7.0 Plus','Galaxy Tab 7.7','Galaxy Tab 8.9',
      'Galaxy Tab 10.1','Galaxy Tab (Original 7-inch)',
    ],
    issues: STAB_ISSUES,
  },

  moto:  { label:'Motorola', models:[], issues:[] },

  moto_razr: {
    label:'Motorola Razr Series',
    models:[
      'Motorola Razr 60',
      'Motorola Razr 50 Ultra','Motorola Razr 50',
      'Motorola Razr 40 Ultra','Motorola Razr 40',
      'Motorola Razr 2022',
      'Motorola Razr 5G',
      'Motorola Razr (2019)',
    ],
    issues: MOTO_ISSUES,
  },

  moto_edge: {
    label:'Motorola Edge Series',
    models:[
      'Motorola Edge 2026','Motorola Edge 2025',
      'Motorola Edge 70 Fusion','Motorola Edge 70',
      'Motorola Edge 60 Pro','Motorola Edge 60',
      'Motorola Edge 50 Ultra','Motorola Edge 50 Pro','Motorola Edge 50 Fusion','Motorola Edge 50 Neo',
      'Motorola Edge 40 Pro','Motorola Edge 40','Motorola Edge 40 Neo',
      'Motorola Edge 30 Ultra','Motorola Edge 30 Pro','Motorola Edge 30 Fusion','Motorola Edge 30','Motorola Edge 30 Neo',
      'Motorola Edge 20 Pro','Motorola Edge 20','Motorola Edge 20 Fusion','Motorola Edge 20 Lite',
      'Motorola Edge+','Motorola Edge',
    ],
    issues: MOTO_ISSUES,
  },

  moto_g: {
    label:'Moto G Series',
    models:[
      'Moto G86 Power 5G','Moto G86',
      'Moto G75 5G','Moto G67','Moto G57 5G','Moto G56 5G','Moto G35 5G','Moto G15','Moto G06','Moto G05',
      'Moto G84 5G','Moto G55 5G','Moto G54 5G','Moto G34 5G','Moto G14','Moto G04s','Moto G04',
      'Moto G82 5G','Moto G73 5G','Moto G62 5G','Moto G53 5G','Moto G52','Moto G32',
      'Moto G24 Power','Moto G24','Moto G23','Moto G22','Moto G13','Moto G10',
      'Moto G9 Plus','Moto G9 Play',
      'Moto G8 Plus','Moto G8 Power Lite',
      'Moto G7 Plus','Moto G7 Power',
      'Moto G6 Plus','Moto G6 Play',
      'Moto G5S Plus','Moto G5 Plus',
      'Moto G4 Plus','Moto G3','Moto G2','Moto G (Original)',
    ],
    issues: MOTO_ISSUES,
  },

  moto_other: {
    label:'Motorola Specialty & Legacy',
    models:[
      'Motorola ThinkPhone',
      'Moto Z3 Play','Moto Z2 Play','Moto Z Play',
      'Moto X4','Moto X Style','Moto X Play','Moto X (Original)',
    ],
    issues: MOTO_ISSUES,
  },

};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function getPrice(issue, model){
  const p=issue.prices;
  return p[model]!==undefined ? p[model] : p._default;
}
let countTimer=null;
function animateCount(el, target){
  clearInterval(countTimer);   // stop any count still running from a previous quote
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent=`$${target}`; return; }
  let cur=0; const inc=target/40;
  countTimer=setInterval(()=>{ cur+=inc; if(cur>=target){cur=target;clearInterval(countTimer);} el.textContent=`$${Math.round(cur)}`; },20);
}

// ─────────────────────────────────────────
// CONTROLLER
// ─────────────────────────────────────────
export function buildQuote(){
  const step1          = document.getElementById('iq-step-1');
  const stepIphone     = document.getElementById('iq-step-iphone');
  const stepSamsung    = document.getElementById('iq-step-samsung');
  const stepSamsungTab = document.getElementById('iq-step-samsung-tab');
  const stepGoogle     = document.getElementById('iq-step-google');
  const stepOppo       = document.getElementById('iq-step-oppo');
  const stepMoto       = document.getElementById('iq-step-moto');
  const stepIpad       = document.getElementById('iq-step-ipad');
  const step2          = document.getElementById('iq-step-2');
  const step3          = document.getElementById('iq-step-3');
  const result         = document.getElementById('iq-result');
  const modelGrid      = document.getElementById('iq-model-grid');
  const issueGrid      = document.getElementById('iq-issue-grid');
  const dots           = document.querySelectorAll('.iq-dot');
  if(!step1) return;

  let selectedCategory=null, selectedModel=null, selectedIssue=null;
  let seriesStep=null;

  const allPanels=[step1,stepIphone,stepSamsung,stepSamsungTab,stepGoogle,stepOppo,stepMoto,stepIpad,step2,step3,result];
  function show(panel){ allPanels.forEach(p=>p&&p.classList.add('iq-hidden')); panel.classList.remove('iq-hidden'); }
  function setDots(n){ dots.forEach((d,i)=>d.classList.toggle('active',i<n)); }

  // Step 1 — device type
  document.querySelectorAll('.iq-device-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const cat=btn.dataset.category;
      document.querySelectorAll('.iq-device-btn').forEach(b=>b.classList.toggle('selected',b===btn));
      if(cat==='iphone'){      seriesStep='iphone';      show(stepIphone);     setDots(2); return; }
      if(cat==='samsung'){     seriesStep='samsung';     show(stepSamsung);    setDots(2); return; }
      if(cat==='samsung_tab'){ seriesStep='samsung_tab'; show(stepSamsungTab); setDots(2); return; }
      if(cat==='google'){      seriesStep='google';      show(stepGoogle);     setDots(2); return; }
      if(cat==='oppo'){        seriesStep='oppo';        show(stepOppo);       setDots(2); return; }
      if(cat==='moto'){        seriesStep='moto';        show(stepMoto);       setDots(2); return; }
      if(cat==='ipad_series'){ seriesStep='ipad';        show(stepIpad);       setDots(2); return; }
      seriesStep=null; selectedCategory=cat;
      buildModelGrid(QUOTE_DATA[cat]); show(step2); setDots(2);
    });
  });

  // Hero quick-start card: open the matching device in the full quote tool
  document.querySelectorAll('[data-quick]').forEach(qb=>{
    qb.addEventListener('click',()=>{
      const target=document.querySelector(`.iq-device-btn[data-category="${qb.dataset.quick}"]`);
      if(target) target.click();
      document.getElementById('instant-quote').scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // All series pickers — same logic
  [stepIphone,stepSamsung,stepSamsungTab,stepGoogle,stepOppo,stepMoto,stepIpad].forEach(picker=>{
    if(!picker) return;
    picker.querySelectorAll('.iq-samsung-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        selectedCategory=btn.dataset.series;
        buildModelGrid(QUOTE_DATA[selectedCategory]); show(step2); setDots(2);
      });
    });
  });

  // Back from series pickers → always go to step 1
  ['iq-back-iphone','iq-back-samsung','iq-back-samsung-tab','iq-back-google','iq-back-oppo','iq-back-moto','iq-back-ipad'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('click',()=>{ show(step1); setDots(1); });
  });

  // Back from model grid → go to correct series picker
  document.getElementById('iq-back-1').addEventListener('click',()=>{
    if(seriesStep==='iphone')      { show(stepIphone);     setDots(2); }
    else if(seriesStep==='samsung'){ show(stepSamsung);    setDots(2); }
    else if(seriesStep==='samsung_tab'){ show(stepSamsungTab); setDots(2); }
    else if(seriesStep==='google') { show(stepGoogle);     setDots(2); }
    else if(seriesStep==='oppo')   { show(stepOppo);       setDots(2); }
    else if(seriesStep==='moto')   { show(stepMoto);       setDots(2); }
    else if(seriesStep==='ipad')   { show(stepIpad);       setDots(2); }
    else                           { show(step1);          setDots(1); }
  });

  document.getElementById('iq-back-2').addEventListener('click',()=>{ show(step2); setDots(2); });
  document.getElementById('iq-back-result-issue').addEventListener('click',()=>{ show(step3); setDots(3); });
  document.getElementById('iq-back-result-model').addEventListener('click',()=>{ show(step2); setDots(2); });
  document.getElementById('iq-reset').addEventListener('click',()=>{
    selectedCategory=selectedModel=selectedIssue=seriesStep=null;
    document.querySelectorAll('.iq-device-btn').forEach(b=>b.classList.remove('selected'));
    show(step1); setDots(1);
  });

  // Buttons are built with textContent (not HTML strings) so model names
  // containing quotes, e.g. MacBook Pro 16" (M4), are kept intact.
  function buildModelGrid(data){
    modelGrid.replaceChildren(...data.models.map(m=>{
      const mb=document.createElement('button');
      mb.type='button'; mb.className='iq-model-btn'; mb.textContent=m;
      mb.addEventListener('click',()=>{
        selectedModel=m;
        modelGrid.querySelectorAll('.iq-model-btn').forEach(b=>b.classList.remove('selected'));
        mb.classList.add('selected');
        buildIssueGrid(QUOTE_DATA[selectedCategory]); show(step3); setDots(3);
      });
      return mb;
    }));
  }

  function buildIssueGrid(data){
    issueGrid.replaceChildren(...data.issues.map(iss=>{
      const ib=document.createElement('button');
      ib.type='button'; ib.className='iq-issue-btn';
      ib.innerHTML=`<span class="iq-issue-icon">${getIconSVG(iss.name)}</span><span class="iq-issue-info"><span class="iq-issue-name"></span></span>`;
      ib.querySelector('.iq-issue-name').textContent=iss.name;
      ib.addEventListener('click',()=>{
        selectedIssue=iss;
        issueGrid.querySelectorAll('.iq-issue-btn').forEach(b=>b.classList.remove('selected'));
        ib.classList.add('selected'); showResult();
      });
      return ib;
    }));
  }

  function showResult(){
    const base=getPrice(selectedIssue,selectedModel);
    const labour=Math.round(base*0.3), parts=base-labour;
    const gst=Math.round((parts+labour)*0.1), total=parts+labour+gst;
    document.getElementById('iq-result-device').textContent=selectedModel;
    document.getElementById('iq-result-issue').textContent=selectedIssue.name;
    document.getElementById('iq-price-parts').textContent=`$${parts}`;
    document.getElementById('iq-price-labour').textContent=`$${labour}`;
    document.getElementById('iq-price-gst').textContent=`$${gst}`;
    document.getElementById('iq-time').textContent=`⏱ ${selectedIssue.time} repair`;
    show(result); setDots(4);
    animateCount(document.getElementById('iq-total'),total);
    result.scrollIntoView({behavior:'smooth',block:'center'});
  }
}

