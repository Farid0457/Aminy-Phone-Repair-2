/* ═══════════════════════════════════════════
   PRICES — all instant-quote pricing data
   ═══════════════════════════════════════════

   HOW TO EDIT
   • All prices are in AUD and INCLUDE GST — the quote shows them as-is.
   • Each device series has:
       label  – heading shown in the quote tool
       models – model buttons, listed newest first
       issues – repairs offered: { name, time, prices }
   • prices: { 'Exact Model Name': price, _default: price }
       A model not listed uses _default. Model names must match the
       `models` list exactly (including quotes, e.g. MacBook Pro 16" (M4)).
   • Issue names must match an icon in quote.js ICON_MAP, or they get
     the generic wrench icon.
   • Series with empty models/issues (iphone, samsung, google, ipad_series,
     oppo, samsung_tab, moto) are placeholders: the series picker in
     index.html chooses the real series.

   New or changed prices must be signed off by the owner —
   see docs/manual/02-business-info.md §8.
*/

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
    'Galaxy S26 Ultra':480,'Galaxy S26 Edge':420,'Galaxy S26+':400,'Galaxy S26':340,'Galaxy S26 FE':260,
    'Galaxy S25 Ultra':450,'Galaxy S25+':380,'Galaxy S25':320,'Galaxy S25 FE':240,
    'Galaxy S24 Ultra':420,'Galaxy S24+':350,'Galaxy S24':290,'Galaxy S24 FE':220,
    'Galaxy S23 Ultra':380,'Galaxy S23+':320,'Galaxy S23':270,'Galaxy S23 FE':200,
    'Galaxy S22 Ultra':340,'Galaxy S22+':290,'Galaxy S22':250,
    'Galaxy S21 Ultra':300,'Galaxy S21+':260,'Galaxy S21':220,'Galaxy S21 FE':190,
    'Galaxy S20 Ultra':280,'Galaxy S20+':240,'Galaxy S20':200,'Galaxy S20 FE':170,
    'Galaxy S10+':200,'Galaxy S10':180,'Galaxy S10e':160,'Galaxy S10 5G':200,'Galaxy S10 Lite':170,
    'Galaxy S9+':170,'Galaxy S9':150,'Galaxy S8+':150,'Galaxy S8':130,
    'Galaxy S7 Edge':130,'Galaxy S7':110,
    'Galaxy Z Fold8 Ultra':950,'Galaxy Z Fold8':900,
    'Galaxy Z Fold7':850,'Galaxy Z Fold6':800,'Galaxy Z Fold5':750,'Galaxy Z Fold4':700,
    'Galaxy Z Fold3 5G':650,'Galaxy Z Fold2 5G':600,'Galaxy Fold':550,
    'Galaxy Z Flip8':480,
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
  { name:'Screen Replacement',  time:'1–2 hrs',   prices:{ 'Pixel 11 Pro Fold':600,'Pixel 11 Pro XL':410,'Pixel 11 Pro':380,'Pixel 11':300,'Pixel 10 Pro Fold':550,'Pixel 9 Pro Fold':500,'Pixel Fold':450,'Pixel 10 Pro XL':380,'Pixel 10 Pro':350,'Pixel 10':280,'Pixel 10a':220,'Pixel 9 Pro XL':340,'Pixel 9 Pro':310,'Pixel 9':260,'Pixel 9a':200,'Pixel 8 Pro':290,'Pixel 8':230,'Pixel 8a':180,'Pixel 7 Pro':250,'Pixel 7':200,'Pixel 7a':170,'Pixel 6 Pro':230,'Pixel 6':180,'Pixel 6a':160,'Pixel 5':170,'Pixel 5a (5G)':160,'Pixel 4 XL':160,'Pixel 4':150,'Pixel 4a (5G)':150,'Pixel 4a':140,'Pixel 3 XL':140,'Pixel 3':130,'Pixel 3a XL':130,'Pixel 3a':120,'Pixel 2 XL':130,'Pixel 2':120,'Pixel XL':110,'Pixel (1st Gen)':100, _default:180 } },
  { name:'Battery Replacement', time:'1–2 hrs',   prices:{ _default:89  } },
  { name:'Charging Port',       time:'1 hr',      prices:{ _default:89  } },
  { name:'Back Glass Repair',   time:'1–2 hrs',   prices:{ _default:120 } },
  { name:'Water Damage',        time:'1–3 hrs',   prices:{ _default:149 } },
  { name:'Camera Repair',       time:'45–90 min', prices:{ 'Pixel 11 Pro Fold':230,'Pixel 11 Pro XL':210,'Pixel 11 Pro':200,'Pixel 10 Pro Fold':220,'Pixel 10 Pro XL':200,'Pixel 10 Pro':190,'Pixel 9 Pro Fold':210,'Pixel 9 Pro XL':190,'Pixel 9 Pro':180, _default:149 } },
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
    'Motorola Razr Fold':750,'Motorola Razr 70 Ultra':450,'Motorola Razr 60':420,'Motorola Razr 50 Ultra':380,'Motorola Razr 50':320,
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
export const QUOTE_DATA = {

  // placeholders — sub-series chosen via series picker
  iphone:  { label:'iPhone',      models:[], issues:[] },
  samsung: { label:'Samsung',     models:[], issues:[] },
  google:  { label:'Google Pixel',models:[], issues:[] },

  // ── iPhone series ──
  iphone_18: {
    label:'iPhone 18 Series',
    models:['iPhone 18 Pro Max','iPhone 18 Pro'],
    issues: iphoneIssues(
      { 'iPhone 18 Pro Max':499,'iPhone 18 Pro':459, _default:459 },
      { 'iPhone 18 Pro Max':149,'iPhone 18 Pro':139, _default:139 }
    ),
  },
  iphone_17: {
    label:'iPhone 17 Series',
    models:['iPhone 17 Pro Max','iPhone 17 Pro','iPhone Air','iPhone 17','iPhone 17e'],
    issues: iphoneIssues(
      { 'iPhone 17 Pro Max':460,'iPhone 17 Pro':420,'iPhone Air':380,'iPhone 17':340,'iPhone 17e':240, _default:380 },
      { 'iPhone 17 Pro Max':139,'iPhone 17 Pro':129,'iPhone Air':119,'iPhone 17':109,'iPhone 17e':95, _default:119 }
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
      'Galaxy S26 Ultra','Galaxy S26 Edge','Galaxy S26+','Galaxy S26','Galaxy S26 FE',
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
      'Galaxy Z Fold8 Ultra','Galaxy Z Fold8',
      'Galaxy Z Fold7','Galaxy Z Fold6','Galaxy Z Fold5','Galaxy Z Fold4',
      'Galaxy Z Fold3 5G','Galaxy Z Fold2 5G','Galaxy Fold',
      'Galaxy Z Flip8',
      'Galaxy Z Flip7','Galaxy Z Flip6','Galaxy Z Flip5','Galaxy Z Flip4',
      'Galaxy Z Flip3 5G','Galaxy Z Flip 5G','Galaxy Z Flip',
    ],
    issues: SAMSUNG_ISSUES,
  },

  pixel_11: {
    label:'Pixel 11 Series',
    models:['Pixel 11 Pro Fold','Pixel 11 Pro XL','Pixel 11 Pro','Pixel 11'],
    issues: PIXEL_ISSUES,
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
      'MacBook Pro 14" (M6)',
      'MacBook Pro 16" (M5 Pro/Max)','MacBook Pro 14" (M5 Pro/Max)','MacBook Pro 14" (M5)',
      'MacBook Air 15" (M5)','MacBook Air 13" (M5)',
      'MacBook Neo',
      'MacBook Pro 16" (M4)','MacBook Pro 14" (M4)',
      'MacBook Air 15" (M4)','MacBook Air 13" (M4)',
      'MacBook Pro 16" (M3)','MacBook Pro 14" (M3)',
      'MacBook Air 15" (M3)','MacBook Air 13" (M3)',
      'MacBook Pro 16" (M2)','MacBook Pro 14" (M2)','MacBook Pro 13" (M2)',
      'MacBook Air 15" (M2)','MacBook Air 13" (M2)',
      'MacBook Pro 16" (M1)','MacBook Pro 14" (M1)','MacBook Pro 13" (M1)',
      'MacBook Air 13" (M1)',
      'MacBook Pro 16" (Intel, 2019)','MacBook Pro 15" (Intel, 2016–2019)','MacBook Pro 13" (Intel, 2016–2020)',
      'MacBook Air 13" (Intel, 2018–2020)',
    ],
    issues:[
      { name:'Screen Replacement',  time:'1–3 hrs', prices:{
        'MacBook Pro 14" (M6)':620,
        'MacBook Pro 16" (M5 Pro/Max)':700,'MacBook Pro 14" (M5 Pro/Max)':600,'MacBook Pro 14" (M5)':600,
        'MacBook Air 15" (M5)':520,'MacBook Air 13" (M5)':460,
        'MacBook Neo':349,
        'MacBook Pro 16" (M4)':680,'MacBook Pro 14" (M4)':580,
        'MacBook Air 15" (M4)':500,'MacBook Air 13" (M4)':440,
        'MacBook Pro 16" (M3)':650,'MacBook Pro 14" (M3)':550,
        'MacBook Air 15" (M3)':480,'MacBook Air 13" (M3)':420,
        'MacBook Pro 16" (M2)':620,'MacBook Pro 14" (M2)':520,'MacBook Pro 13" (M2)':400,
        'MacBook Air 15" (M2)':460,'MacBook Air 13" (M2)':399,
        'MacBook Pro 16" (M1)':590,'MacBook Pro 14" (M1)':490,'MacBook Pro 13" (M1)':380,
        'MacBook Air 13" (M1)':340,
        'MacBook Pro 16" (Intel, 2019)':450,'MacBook Pro 15" (Intel, 2016–2019)':420,'MacBook Pro 13" (Intel, 2016–2020)':360,
        'MacBook Air 13" (Intel, 2018–2020)':320,
        _default:299 }},
      { name:'Battery Replacement', time:'1–2 hrs', prices:{
        'MacBook Pro 14" (M6)':249,
        'MacBook Pro 16" (M5 Pro/Max)':259,'MacBook Pro 14" (M5 Pro/Max)':239,'MacBook Pro 14" (M5)':239,
        'MacBook Air 15" (M5)':219,'MacBook Air 13" (M5)':199,
        'MacBook Neo':179,
        'MacBook Pro 16" (M4)':249,'MacBook Pro 14" (M4)':229,
        'MacBook Air 15" (M4)':209,'MacBook Air 13" (M4)':189,
        'MacBook Pro 16" (M3)':239,'MacBook Pro 14" (M3)':219,
        'MacBook Air 15" (M3)':199,'MacBook Air 13" (M3)':179,
        'MacBook Pro 16" (M2)':229,'MacBook Pro 14" (M2)':209,'MacBook Pro 13" (M2)':189,
        'MacBook Air 15" (M2)':189,'MacBook Air 13" (M2)':179,
        'MacBook Pro 16" (M1)':219,'MacBook Pro 14" (M1)':199,'MacBook Pro 13" (M1)':179,
        'MacBook Air 13" (M1)':169,
        'MacBook Pro 16" (Intel, 2019)':199,'MacBook Pro 15" (Intel, 2016–2019)':189,'MacBook Pro 13" (Intel, 2016–2020)':169,
        'MacBook Air 13" (Intel, 2018–2020)':159,
        _default:179 }},
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
      'Apple Watch Ultra 4','Apple Watch Series 12',
      'Apple Watch Ultra 3','Apple Watch Series 11','Apple Watch SE 3',
      'Apple Watch Series 10',
      'Apple Watch Ultra 2','Apple Watch Series 9',
      'Apple Watch Ultra','Apple Watch Series 8','Apple Watch SE (2nd Gen)',
      'Apple Watch Series 7',
      'Apple Watch SE (1st Gen)',
    ],
    issues:[
      { name:'Screen / Glass Repair', time:'1–2 hrs', prices:{'Apple Watch Ultra 4':320,'Apple Watch Series 12':230,'Apple Watch Ultra 3':300,'Apple Watch Series 11':215,'Apple Watch SE 3':140,'Apple Watch Ultra 2':280,'Apple Watch Ultra':260,'Apple Watch Series 10':200,'Apple Watch Series 9':180,'Apple Watch Series 8':160,'Apple Watch Series 7':150,_default:130} },
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
      'Motorola Razr Fold','Motorola Razr 70 Ultra',
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

// Price for an issue on a given model, falling back to _default.
export function getPrice(issue, model){
  const p=issue.prices;
  return p[model]!==undefined ? p[model] : p._default;
}
