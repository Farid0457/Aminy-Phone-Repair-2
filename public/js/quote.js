/* ═══════════════════════════════════════════
   INSTANT QUOTE — controller (pricing data: data/prices.js)
   ═══════════════════════════════════════════ */

import { QUOTE_DATA, getPrice } from './data/prices.js';
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
// HELPERS
// ─────────────────────────────────────────
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

