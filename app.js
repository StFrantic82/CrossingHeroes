'use strict';
const C = window.CH;
const COLORS=['#e2a12b','#4fb3c4','#c35a9a','#7fb24a','#d86a4a'];
const $=s=>document.querySelector(s);
let G=null, view=0, logEv=[], busy=false, aiSpeed=650;
const MPON=()=>window.MP&&MP.on;
let L='fr';
try{ const l=localStorage.getItem('ch_lang'); if(I18N[l]) L=l; else if(/^it/i.test(navigator.language)) L='it'; else if(!/^fr/i.test(navigator.language)) L='en'; }catch(e){}

/* ---------- Traduction ---------- */
function t(k,...a){ const v=I18N[L][k]; return typeof v==='function'?v(...a):v; }
const trialName=id=>L==='fr'?C.TR[id].n:NAMES.trials[L][id-1];
const itemName=id=>L==='fr'?C.ITEMS[id].n:NAMES.items[L][id-1];
const itemDesc=id=>L==='fr'?C.ITEMS[id].d:NAMES.itemDesc[L][id-1];
const symName=s=>NAMES.sym[L][s];
const godName=g=>NAMES.gods[L][g];
const heroName=h=>symName(NAMES.heroSym[h]);
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---------- Icônes ---------- */
const icS=s=>`<img class="ico" src="a/ic_${s}.webp" alt="${symName(s)}" title="${symName(s)}">`;
const icG=g=>`<img class="ico sq" src="a/g_${g}.webp" alt="${godName(g)}" title="${godName(g)}">`;
const icVP=n=>`<span class="vp" title="PV">${n}<i></i></span>`;
const icGlory=()=>`<span class="glo" title="${t('glory')}"></span>`;
const icCoin=n=>`<span class="coin" title="${t('gold')}">${n}</span>`;
const icCard=n=>n<=2?`<img class="bcard" src="a/b_card${n}.webp" alt="${t('skills',n)}" title="${t('skills',n)}">`:t('skills',n);
const icItem=()=>`<img class="ico it" src="a/ico_item.webp" alt="${t('items')}" title="${t('items')}">`;
const icons=a=>`<span class="icons">${a.join('')}</span>`;
function skillIcons(tid){ const s=C.SKILLS[tid]; return icons([...s.syms.map(icS), s.glory?icGlory():'', s.gold?icCoin(1):'']); }
function trialScoreHtml(tid){
  const s=C.TR[tid].s;
  if(s.t==='flat') return icVP(s.v);
  if(s.t==='item') return `${icVP(s.v)} / ${icVP(s.v*2)} + <img class="ico it" src="a/i${s.item}.webp" alt=""> ${esc(itemName(s.item))}`;
  if(s.t==='god') return `${icVP(s.v)} × ${icG(s.god)}`;
  return `${icVP(s.v)} × ${icGlory()}`;
}
function bonusHtml(tid){ const b=C.TR[tid].b; const a=[]; if(b.g) a.push(icCoin(b.g)); if(b.s) a.push(icCard(b.s)); return a.length?icons(a):t('none'); }

/* ---------- Langue & navigation ---------- */
function applyLang(){
  document.documentElement.lang=L;
  document.querySelectorAll('[data-t]').forEach(el=>{ el.innerHTML=t(el.dataset.t); });
  document.querySelectorAll('.langs button').forEach(b=>b.classList.toggle('on',b.dataset.lang===L));
  renderSetup(); if(statsAgg) renderStats(); renderHistory(); if(window.mpRender&&!$('#mpPanel').classList.contains('hidden')) mpRender(); if(G) render();
}
document.querySelector('.langs').addEventListener('click',e=>{ const b=e.target.closest('[data-lang]'); if(!b) return; L=b.dataset.lang; try{localStorage.setItem('ch_lang',L);}catch(x){} applyLang(); });
function showTab(name){
  $('#home').classList.toggle('hidden',name!=='play');
  $('#stats').classList.toggle('hidden',name!=='stats');
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===name));
}
document.querySelector('.tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-tab]'); if(b) showTab(b.dataset.tab); });

/* ---------- Accueil ---------- */
let setup=[{name:'Moi',ai:false},{name:'Ariane',ai:true}];
try{ const s=JSON.parse(localStorage.getItem('ch_setup2')); if(Array.isArray(s)&&s.length>=2) setup=s; }catch(e){}
function renderSetup(){
  $('#plist').innerHTML=setup.map((p,i)=>`
    <div class="prow">
      <span class="dot" style="background:${COLORS[i]}"></span>
      <input value="${esc(p.name)}" data-i="${i}" maxlength="16" aria-label="${i+1}">
      <div class="seg"><button class="${!p.ai?'on':''}" data-ai="0" data-i="${i}">${t('human')}</button><button class="${p.ai?'on':''}" data-ai="1" data-i="${i}">${t('ai')}</button></div>
      <button class="rm" data-rm="${i}" ${setup.length<=2?'disabled':''} title="${t('remove')}">×</button>
    </div>`).join('');
  $('#addp').disabled=setup.length>=5;
}
const AI_NAMES=['Ariane','Jason','Atalante','Persée','Médée','Thésée','Hélène'];
$('#plist').addEventListener('input',e=>{ if(e.target.dataset.i!=null) setup[+e.target.dataset.i].name=e.target.value; });
$('#plist').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.ai!=null){ setup[+b.dataset.i].ai=b.dataset.ai==='1'; renderSetup(); }
  if(b.dataset.rm!=null){ setup.splice(+b.dataset.rm,1); renderSetup(); }
});
$('#addp').onclick=()=>{ const used=setup.map(p=>p.name); setup.push({name:AI_NAMES.find(n=>!used.includes(n))||'Héros',ai:true}); renderSetup(); };
$('#start').onclick=()=>{
  setup.forEach((p,i)=>{ p.name=(p.name||'').trim()||`${t('human')} ${i+1}`; });
  try{ localStorage.setItem('ch_setup2',JSON.stringify(setup)); }catch(e){}
  startGame(C.newGame({players:setup}));
};
function startGame(g){
  G=g; logEv=[]; doneAt.clear(); flushEvents();
  view=G.cur;
  document.querySelectorAll('.pre').forEach(el=>el.classList.add('hidden'));
  $('#game').classList.remove('hidden');
  window.scrollTo(0,0); render(); scheduleAI();
}
function goHome(){ if(MPON()&&window.mpLeave){ mpLeave(); return; } G=null; busy=false; $('#game').classList.add('hidden'); document.querySelectorAll('.pre').forEach(el=>el.classList.remove('hidden')); showTab('play'); renderSetup(); renderHistory(); }
$('#homeHelp').onclick=showHelp;
$('#helpBtn').onclick=showHelp;
$('#quitBtn').onclick=()=>{ if(G&&G.phase==='end'){ goHome(); return; } showModal(`<h2>${t('quitQ')}</h2><p>${t('quitTxt')}</p><div class="homebtns" style="margin-top:16px"><button class="btn" data-quit>${t('backHome')}</button><button class="btn ghost" data-close>${t('continue')}</button></div>`); };

/* Couverture vivante */
(function(){
  const off=document.getElementById('wOff'), disp=document.getElementById('wDisp'), cov=document.getElementById('cover');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  let target=6, cur=6, t0=performance.now();
  function tick(now){
    if(!$('#home').classList.contains('hidden') && !$('#home').closest('.hidden')){
      const s=(now-t0)/1000;
      cur+=(target-cur)*0.06;
      off.setAttribute('dx',(Math.sin(s*0.55)*60+s*9).toFixed(1));
      off.setAttribute('dy',(Math.cos(s*0.42)*45).toFixed(1));
      disp.setAttribute('scale',(cur*(1+0.25*Math.sin(s*1.7))).toFixed(2));
    }
    requestAnimationFrame(tick);
  }
  if(!reduce) requestAnimationFrame(tick); else disp.setAttribute('scale','0');
  document.querySelector('.setup').addEventListener('mouseover',e=>{ target=e.target.closest('.btn,.addp,.seg button')?16:6; });
  document.querySelector('.setup').addEventListener('mouseleave',()=>{ target=6; });
  const wrap=document.getElementById('coverwrap');
  wrap.addEventListener('mousemove',e=>{ if(reduce) return; const r=wrap.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; cov.style.transform=`rotateY(${x*8}deg) rotateX(${-y*8}deg)`; target=11; });
  wrap.addEventListener('mouseleave',()=>{ cov.style.transform=''; target=6; });
})();

/* ---------- Chronique ---------- */
function pname(i){ const p=G.players[i]; return `<span class="pn"><i class="pdot" style="background:${COLORS[i]}"></i>${esc(p.name)}</span>`; }
function fmtEvent(e){
  const lg=I18N[L].log, a={p:e.p!=null?pname(e.p):''};
  switch(e.k){
    case 'start': return lg.start(a);
    case 'muses': return lg.muses({...a,coin:icCoin('−1'),row:lg.rows[e.row]});
    case 'face': return lg.face({...a,t:esc(trialName(e.t)),g:e.g?' '+icCoin('+'+e.g):''});
    case 'take': return lg.take({...a,s:skillIcons(e.s)});
    case 'refill': return lg.refill({...a,coin:icCoin('+1')});
    case 'done': return lg.done({...a,t:esc(trialName(e.t))});
    case 'zeus': return lg.zeus(a);
    case 'item': return lg.item({...a,i:`<b>${esc(itemName(e.i))}</b>${e.free?'':' '+icCoin('−'+C.ITEMS[e.i].cost)}`,free:e.free});
    case 'end': return lg.end();
  }
  return '';
}
function flushEvents(){
  if(!G) return;
  while(G.events.length){ const e=G.events.shift(); logEv.unshift(e); }
  logEv=logEv.slice(0,60);
  if(G.phase==='end') saveHistory();
}

/* ---------- Rendu ---------- */
function me(){ return C.P(G); }
function humanTurn(){ return G && G.phase!=='end' && !me().ai && !busy && (!MPON()||G.cur===MP.seat); }
function trialImg(tid,done){ return `a/t${tid}${done?'b':'a'}.webp`; }
function trialCap(tid){
  const tr=C.TR[tid];
  return `<b>${esc(trialName(tid))}</b>
  <div class="r"><span class="k">${t('required')}</span>${icons(tr.r.map(icS))}</div>
  <div class="r"><span class="k">${t('god')}</span>${icG(tr.god)} ${godName(tr.god)}</div>
  <div class="r"><span class="k">${t('bonus')}</span>${bonusHtml(tid)}</div>
  <div class="r"><span class="k">${t('scoreL')}</span>${trialScoreHtml(tid)}</div>`;
}
function skillCap(tid){ const s=C.SKILLS[tid]; return `<b>${t('skill')}</b><div class="r">${skillIcons(tid)} ${s.syms.map(symName).join(' + ')}</div>${s.gold?`<div class="r">${t('goldOnTake')}</div>`:''}`; }
function itemCap(id){ return `<b>${esc(itemName(id))}</b><div class="r"><span class="k">${t('cost')}</span>${icCoin(C.ITEMS[id].cost)}</div><div class="r">${esc(itemDesc(id))}</div>`; }
function heroCap(h){ return `<b>${t('hero')} ${heroName(h)}</b><div class="r">${icS(NAMES.heroSym[h])} ${t('heroCap',heroName(h))}</div>`; }

function render(){
  if(!G) return;
  flushEvents();
  const p=me(), hv=humanTurn(), ph=G.phase;
  let ins='', sub='', acts='';
  if(ph==='end'){ ins=t('gameOver'); acts=`<button class="btn sm" data-act="scores">${t('seeScores')}</button><button class="btn ghost sm" data-act="again">${t('again')}</button>`; }
  else if(p.ai){ ins=t('aiThinks',esc(p.name)); sub=t('turnOf',p.turns+1,C.TURNS); }
  else if(ph==='A'){
    ins = G.sel==null ? t('chooseTrial',esc(p.name)) : t('placeTrial',esc(trialName(G.trialRow[G.sel])));
    sub = `${t('turnOf',p.turns+1,C.TURNS)} · ${t('musesHint')}`;
    if(G.sel!=null) acts=`<button class="btn ghost sm" data-act="unsel">${t('cancel')}</button>`;
  }
  else if(ph==='skill'||ph==='torch'){
    ins = G.sel==null ? (ph==='torch'?t('torch'):t('takeSkill',G.pend.skills)) : t('placeSkill');
    sub = ph==='torch'?'':t('colsHint');
  }
  else if(ph==='zeus'){ ins=t('zeusPick'); }
  else if(ph==='C'){ ins=t('phaseC'); sub=t('youHave',p.gold); acts=`<button class="btn sm" data-act="pass">${t('endTurn')}</button>`; }
  $('#instr').innerHTML=`${ins}<small>${sub}</small>`;
  $('#actions').innerHTML=acts;

  $('#ptabs').innerHTML=G.players.map((q,i)=>{
    const s=C.score(q);
    return `<button class="ptab ${i===G.cur&&ph!=='end'?'cur':''} ${i===view?'view':''}" data-view="${i}">
      <img class="hav" src="a/h_${q.hero}.webp" alt="">
      <div><div class="nm"><span class="turnpip" style="background:${COLORS[i]}"></span>${esc(q.name)} ${q.ai?`<span class="badge">${t('ai')}</span>`:''}</div>
      <div class="meta">${icVP(s.total)} ${icCoin(q.gold)} · ${t('turnShort',Math.min(q.turns+(i===G.cur&&ph!=='end'?1:0),C.TURNS),C.TURNS)}</div></div></button>`;
  }).join('');

  const elig=(ph==='skill'||ph==='torch')?C.eligibleSkills(G):[];
  const isElig=(r,c)=>elig.some(([a,b])=>a===r&&b===c);
  let m='';
  G.trialRow.forEach((tid,i)=>{
    const col=2+i*2;
    if(!tid){ m+=`<div class="tcard empty" style="grid-column:${col}/span 2"></div>`; return; }
    const cls=hv&&ph==='A'?(G.sel===i?'pick sel':'pick'):'';
    m+=`<div class="tcard ${cls}" style="grid-column:${col}/span 2" data-trial="${i}" data-zoom="${trialImg(tid)}" data-cap="${esc(trialCap(tid))}"><img src="${trialImg(tid)}" alt="${esc(trialName(tid))}"></div>`;
  });
  for(let r=0;r<2;r++) for(let c=0;c<5;c++){
    const card=G.skillGrid[r][c], col=1+c*2;
    if(!card){ m+=`<div class="scard empty" style="grid-row:${r+2};grid-column:${col}/span 2"></div>`; continue; }
    const pk=hv&&isElig(r,c), sl=G.sel&&G.sel.r===r&&G.sel.c===c;
    m+=`<div class="scard ${pk?'pick':''} ${sl?'sel':''}" style="grid-row:${r+2};grid-column:${col}/span 2" data-skill="${r},${c}" data-zoom="a/s${card.t}.webp" data-wide="1" data-cap="${esc(skillCap(card.t))}"><img src="a/s${card.t}.webp" alt=""></div>`;
  }
  m+=`<div style="grid-row:2;grid-column:11;align-self:center"><button class="muse" data-muse="skill0" title="${t('muses')}">↻</button></div>`;
  m+=`<div style="grid-row:3;grid-column:11;align-self:center"><button class="muse" data-muse="skill1" title="${t('muses')}">↻</button></div>`;
  $('#market').innerHTML=m;
  document.querySelectorAll('[data-muse]').forEach(b=>b.disabled=!(hv&&ph==='A'&&p.gold>=1));
  $('#deckinfo').textContent=t('deckInfo',G.trialDeck.length,G.skillDeck.length);

  let it='';
  G.itemRow.forEach((id,i)=>{
    if(!id){ it+=`<div class="icard empty"></div>`; return; }
    const can=hv&&(ph==='zeus'||(ph==='C'&&p.gold>=C.ITEMS[id].cost));
    const dim=hv&&ph==='C'&&p.gold<C.ITEMS[id].cost;
    it+=`<div class="icard ${can?'pick':''}" data-item="${i}" data-zoom="a/i${id}.webp" data-cap="${esc(itemCap(id))}"><img src="a/i${id}.webp" alt="${esc(itemName(id))}">${dim?'<div class="cant"></div>':''}</div>`;
  });
  it+=`<div class="icard" style="opacity:${G.itemPile.length?1:.2}"><img src="a/i_back.webp" alt=""></div>`;
  $('#items').innerHTML=it;
  $('#log').innerHTML=logEv.slice(0,40).map(e=>`<div>${fmtEvent(e)}</div>`).join('');
  renderBoard();
  if(window.mpAfterRender) mpAfterRender();
}

const doneAt=new Map();
function shine(tid,q,k){
  const key=G.players.indexOf(q)+':'+k, now=performance.now();
  if(!doneAt.has(key)) doneAt.set(key,now);
  const e=(now-doneAt.get(key))/1000;
  const mask=`-webkit-mask-image:url(a/m${tid}.png);mask-image:url(a/m${tid}.png);`;
  if(e<3.3) return `<span class="shine new" style="${mask}animation-delay:${-e}s,${3.3-e}s"></span>`;
  return `<span class="shine" style="${mask}animation-delay:${-((e-3.3)%3.6)}s"></span>`;
}
function renderBoard(){
  const q=G.players[view], ph=G.phase, mine=view===G.cur&&humanTurn();
  $('#boardTitle').innerHTML=`<span>${esc(t('gridOf',q.name,heroName(q.hero)))}</span>${view!==G.cur&&ph!=='end'?`<button class="muse" data-view="${G.cur}">${t('seeActive')}</button>`:''}`;
  const freeCells=mine&&ph==='A'&&G.sel!=null?C.freeCells(q):[];
  const avail=mine&&(ph==='skill'||ph==='torch')&&G.sel&&G.sel.r!=null?C.availableEdges(q):[];
  let h='';
  const pos={T:i=>[1,i+2],B:i=>[5,i+2],L:i=>[i+2,1],R:i=>[i+2,5]};
  C.EDGES.forEach(e=>{
    const [r,c]=pos[e[0]](+e[1]), v=(e[0]==='L'||e[0]==='R'), card=q.edges[e], open=q.cells[C.edgeCell(e)]!=null;
    if(card) h+=`<div class="edge ${v?'v':'h'}" style="grid-row:${r};grid-column:${c}" data-zoom="a/s${card.t}.webp" data-wide="1" data-cap="${esc(skillCap(card.t))}"><img src="a/s${card.t}.webp" alt=""></div>`;
    else h+=`<div class="edge slot ${v?'v':'h'} ${open?'':'locked'} ${avail.includes(e)?'pick':''}" style="grid-row:${r};grid-column:${c}" data-edge="${e}"></div>`;
  });
  for(let k=0;k<9;k++){
    const r=Math.floor(k/3)+2, c=k%3+2, tid=q.cells[k];
    if(k===4){ h+=`<div class="cell" style="grid-row:${r};grid-column:${c}" data-zoom="a/h_${q.hero}.webp" data-cap="${esc(heroCap(q.hero))}"><img src="a/h_${q.hero}.webp" alt=""></div>`; continue; }
    if(tid==null){ h+=`<div class="cell free ${freeCells.includes(k)?'pick':''}" style="grid-row:${r};grid-column:${c}" data-cell="${k}"></div>`; continue; }
    const done=q.done[k], miss=done?0:C.missingFor(q,k);
    h+=`<div class="cell" style="grid-row:${r};grid-column:${c}" data-zoom="${trialImg(tid,done)}" data-cap="${esc(trialCap(tid))}"><img src="${trialImg(tid,done)}" alt="${esc(trialName(tid))}">${done?`${shine(tid,q,k)}<span class="ok">✓</span>`:`<span class="miss">${t('missing',miss)}</span>`}</div>`;
  }
  $('#board').innerHTML=h;
  const s=C.score(q);
  const gods=C.GOD_KEYS.map(g=>`<span class="god" title="${godName(g)}">${icG(g)} ${C.godCount(q,g,true)}/${C.godCount(q,g,false)}</span>`).join('');
  $('#side').innerHTML=`
    <div class="stats">
      <div class="stat"><b>${s.total}</b><span>${t('vpNow')}</span></div>
      <div class="stat"><b>${q.gold}</b><span>${icCoin('')} ${t('gold')}</span></div>
      <div class="stat"><b>${s.trials}</b><span>${t('trialsDone')}</span></div>
      <div class="stat"><b>${C.heroSyms(q)} → ${s.hero}</b><span>${icS(q.sym)} ${t('heroSyms',heroName(q.hero))}</span></div>
      <div class="stat"><b>${s.gloryCount} → ${s.glory}</b><span>${icGlory()} ${t('glory')}</span></div>
      <div class="stat"><b>${s.items}</b><span>${icItem()} ${t('items')}</span></div>
    </div>
    <div><div class="ptitle">${t('blessings')} <span class="zeusbar">${t('zeusGot',q.zeus)}</span></div><div class="gods">${gods}</div></div>
    <div><div class="ptitle">${t('items')}</div><div class="myitems">${q.items.map(id=>`<div class="icard" data-zoom="a/i${id}.webp" data-cap="${esc(itemCap(id))}"><img src="a/i${id}.webp" alt=""></div>`).join('')||`<span style="font-size:14px">${t('noItems')}</span>`}</div></div>`;
}

/* ---------- Interactions ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-view],[data-muse],[data-trial],[data-cell],[data-skill],[data-edge],[data-item],[data-act],[data-close],[data-quit]');
  if(!el) return;
  if(el.dataset.close!=null){ hideModal(); return; }
  if(el.dataset.quit!=null){ hideModal(); goHome(); return; }
  if(el.dataset.act==='scores'){ showScores(); return; }
  if(el.dataset.act==='again'){ hideModal(); if(MPON()&&MP.host&&window.mpBackToLobby){ mpBackToLobby(); return; } goHome(); return; }
  if(el.dataset.act==='clearHist'){ try{localStorage.removeItem('ch_hist');}catch(x){} renderHistory(); return; }
  if(el.closest('#stats')) return;
  if(el.dataset.view!=null){ view=+el.dataset.view; render(); return; }
  if(!G||!humanTurn()) return;
  const ph=G.phase;
  if(el.dataset.act==='unsel'){ G.sel=null; render(); return; }
  if(el.dataset.act==='pass'){ act('pass'); return; }
  if(el.dataset.muse&&ph==='A'){ act('muses',el.dataset.muse); return; }
  if(el.dataset.trial!=null&&ph==='A'){ const i=+el.dataset.trial; G.sel=G.sel===i?null:i; view=G.cur; render(); return; }
  if(el.dataset.cell!=null&&ph==='A'&&G.sel!=null){ act('placeTrial',G.sel,+el.dataset.cell); return; }
  if(el.dataset.skill!=null&&(ph==='skill'||ph==='torch')){
    const [r,c]=el.dataset.skill.split(',').map(Number);
    if(!C.eligibleSkills(G).some(([a,b])=>a===r&&b===c)) return;
    G.sel=(G.sel&&G.sel.r===r&&G.sel.c===c)?null:{r,c}; view=G.cur; render(); return;
  }
  if(el.dataset.edge!=null&&(ph==='skill'||ph==='torch')&&G.sel&&G.sel.r!=null){ const {r,c}=G.sel; G.sel=null; act('takeSkill',r,c,el.dataset.edge); return; }
  if(el.dataset.item!=null){ const i=+el.dataset.item; if(ph==='zeus'){ act('zeusPick',i); return; } if(ph==='C'){ act('buy',i); return; } }
});
const ACTS=['muses','placeTrial','takeSkill','zeusPick','buy','pass'];
function act(fn,...args){
  if(!ACTS.includes(fn)) return;
  if(MPON()&&!MP.host){ G.sel=null; mpSend({t:'act',fn,args}); render(); return; }
  C[fn](G,...args); if(fn==='muses'){ render(); return; } after();
}
function after(){
  if(G.phase==='A'||G.phase==='end') view=G.cur;
  render();
  if(G.phase==='end'){ setTimeout(showScores,500); return; }
  scheduleAI();
}

/* ---------- IA ---------- */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function scheduleAI(){
  if(MPON()&&!MP.host) return;
  if(!G||busy||G.phase==='end'||!me().ai) return;
  busy=true; view=G.cur; render();
  const game=G;
  await sleep(aiSpeed);
  let guard=0;
  while(G===game&&G.phase!=='end'&&me().ai&&guard++<30){
    const ph=G.phase;
    if(ph==='A'){
      const mu=C.aiMuses(G); if(mu){ C.muses(G,mu); render(); await sleep(aiSpeed); }
      const mv=C.aiBestTrial(G).move;
      G.sel=mv.slot; render(); await sleep(aiSpeed);
      C.placeTrial(G,mv.slot,mv.cell);
    } else if(ph==='skill'||ph==='torch'){
      const mv=C.aiBestSkill(G).move; if(!mv) break;
      G.sel={r:mv.r,c:mv.c}; render(); await sleep(aiSpeed*0.8);
      G.sel=null; C.takeSkill(G,mv.r,mv.c,mv.e);
    } else if(ph==='zeus'){ C.zeusPick(G,C.aiBestItem(G,true)); }
    else if(ph==='C'){ const b=C.aiBestItem(G,false); if(b!=null) C.buy(G,b); else C.pass(G); }
    if(G!==game) break;
    render(); await sleep(aiSpeed);
    if(G.phase==='A') break;
  }
  busy=false;
  if(G!==game) return;
  view=G.cur; render();
  if(G.phase==='end'){ setTimeout(showScores,400); return; }
  if(me().ai) scheduleAI();
}

/* ---------- Zoom ---------- */
const zoom=$('#zoom');
document.addEventListener('mouseover',e=>{
  const el=e.target.closest('[data-zoom]');
  if(!el){ zoom.style.display='none'; return; }
  const mm=/a\/t(\d+)b\.webp/.exec(el.dataset.zoom);
  zoom.innerHTML=`<div class="zwrap"><img src="${el.dataset.zoom}" alt="">${mm?`<span class="shine" style="border-radius:8px;-webkit-mask-image:url(a/m${mm[1]}.png);mask-image:url(a/m${mm[1]}.png)"></span>`:''}</div><div class="cap">${el.dataset.cap||''}</div>`;
  zoom.style.display='block';
});

/* ---------- Modales ---------- */
function showModal(html){ $('#mbox').innerHTML=html; $('#modal').classList.remove('hidden'); }
function hideModal(){ $('#modal').classList.add('hidden'); }
$('#modal').addEventListener('click',e=>{ if(e.target.id==='modal') hideModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') hideModal(); });
function showHelp(){
  showModal(`<div class="ptitle"><span>${t('aidTitle')}</span><button class="btn ghost sm" data-close>${t('close')}</button></div>
  <div class="rules">${t('rules').map(r=>`<p>${r}</p>`).join('')}<p>${t('hover')}</p></div>
  <div class="aid" style="margin-top:12px"><img src="a/aid_front.webp" alt=""><img src="a/aid_back.webp" alt=""></div>`);
}
function showScores(){
  const rk=C.ranking(G), ps=G.players.map(p=>({p,s:C.score(p)})), best=rk[0];
  const ties=rk.filter(x=>x.s.total===best.s.total&&x.p.gold===best.p.gold);
  const winTxt=ties.length>1?t('tie',ties.map(x=>esc(x.p.name)).join(' & ')):t('winner',esc(best.p.name),best.s.total);
  const row=(lab,f)=>`<tr><td>${lab}</td>${ps.map(x=>`<td>${f(x)}</td>`).join('')}</tr>`;
  showModal(`<h2 class="disp win">🏆 ${winTxt}</h2>
  <table class="sc"><tr><th></th>${ps.map((x,i)=>`<th><span class="turnpip" style="background:${COLORS[i]}"></span> ${esc(x.p.name)}</th>`).join('')}</tr>
  ${row(`<img class="ico sq" src="a/t1b.webp" alt=""> ${t('trialsDone')}`,x=>`${x.s.trials} <small>(${x.s.detail.length})</small>`)}
  ${row(`${icS('S')} ${t('hero')}`,x=>`${icS(x.p.sym)} ${x.s.hero}`)}
  ${row(`${icGlory()} ${t('glory')}`,x=>`${x.s.glory} <small>(${x.s.gloryCount})</small>`)}
  ${row(`${icItem()} ${t('items')}`,x=>x.s.items)}
  <tr class="tot"><td>${t('total')}</td>${ps.map(x=>`<td>${icVP(x.s.total)}</td>`).join('')}</tr>
  ${row(`${icCoin('')} ${t('goldLeft')}`,x=>x.p.gold)}
  </table>
  <div class="homebtns"><button class="btn" data-act="again">${t('newGame')}</button><button class="btn ghost" data-close>${t('seeGrids')}</button></div>`);
}

/* ---------- Historique ---------- */
function loadHist(){ try{ return JSON.parse(localStorage.getItem('ch_hist'))||[]; }catch(e){ return []; } }
function saveHistory(){
  if(!G||G.saved||G.players.every(p=>p.ai)) return; G.saved=true;
  const rk=C.ranking(G);
  const h=loadHist(); h.unshift({d:Date.now(), ps:G.players.map((p,i)=>({n:p.name,ai:p.ai,s:C.score(p).total,h:p.hero,w:rk[0].i===i}))});
  try{ localStorage.setItem('ch_hist',JSON.stringify(h.slice(0,60))); }catch(e){}
}
function renderHistory(){
  const h=loadHist(), el=$('#myGames'); if(!el) return;
  if(!h.length){ el.innerHTML=`<div class="empty-state">${t('noGames')}</div>`; return; }
  const humans={};
  h.forEach(g=>g.ps.forEach(p=>{ if(p.ai) return; const x=humans[p.n]||(humans[p.n]={g:0,w:0,b:0,sum:0}); x.g++; x.sum+=p.s; if(p.w) x.w++; x.b=Math.max(x.b,p.s); }));
  el.innerHTML=`<div class="kpis">${Object.entries(humans).slice(0,4).map(([n,x])=>`<div class="kpi"><b>${x.w}/${x.g}</b><span>${esc(n)} · ${t('wins')} · ${t('bestScore')} ${x.b}</span></div>`).join('')}</div>
  <ul class="hist">${h.slice(0,20).map(g=>`<li><span class="d">${new Date(g.d).toLocaleDateString(L)}</span>${g.ps.map(p=>`<span>${p.w?'🏆 ':''}<b>${esc(p.n)}</b> ${p.s}</span>`).join(' · ')}</li>`).join('')}</ul>
  <button class="btn ghost sm" data-act="clearHist" style="margin-top:10px">${t('clear')}</button>`;
}

/* ---------- Statistiques ---------- */
let statsAgg=null, simWorker=null, trialSort={k:'win',asc:false}, itemSort={k:'win',asc:false};
$('#runSim').onclick=()=>{
  const games=+$('#simGames').value, pv=$('#simPlayers').value, players=pv==='mix'?'mix':+pv;
  $('#runSim').disabled=true; $('#runSim').innerHTML=t('running'); $('#prog').style.width='0%';
  const done=A=>{ statsAgg=A; $('#runSim').disabled=false; $('#runSim').innerHTML=t('run'); renderStats(); };
  try{
    if(simWorker) simWorker.terminate();
    simWorker=new Worker('sim-worker.js');
    simWorker.onmessage=e=>{ $('#prog').style.width=(e.data.progress*100).toFixed(1)+'%'; if(e.data.agg){ statsAgg=e.data.agg; renderStats(); } if(e.data.done) done(e.data.agg); };
    simWorker.onerror=()=>{ simWorker=null; runMain(games,players,done); };
    simWorker.postMessage({games,players});
  }catch(err){ runMain(games,players,done); }
};
function runMain(games,players,done){
  const A=C.newAgg(); let i=0;
  (function step(){
    const end=Math.min(games,i+3);
    for(;i<end;i++) C.addAgg(A,C.simulate(players==='mix'?2+Math.floor(Math.random()*4):players));
    $('#prog').style.width=(i/games*100).toFixed(1)+'%';
    if(i<games) setTimeout(step,0); else done(A);
  })();
}
const pct=x=>isFinite(x)?(x*100).toFixed(0)+'%':'–';
const f1=x=>isFinite(x)?x.toFixed(1):'–';
function hbar(lab,v,max,txt,ref,tip){ return `<div class="hb" title="${esc(tip||'')}"><div class="lab">${lab}</div><div class="tr"><i style="width:${Math.max(0,Math.min(100,v/max*100))}%"></i>${ref!=null?`<span class="ref" style="left:${ref/max*100}%"></span>`:''}</div><div class="v">${txt}</div></div>`; }
function cols(entries,fmt){
  const max=Math.max(...entries.map(e=>e[1]),1);
  return `<div class="cols">${entries.map(([k,v])=>`<div class="c"><span class="tt">${fmt(k,v)}</span><i style="height:${v/max*100}%"></i></div>`).join('')}</div><div class="xl">${entries.map(([k])=>`<span>${k}</span>`).join('')}</div>`;
}
function renderStats(){
  const A=statsAgg, el=$('#statsOut');
  if(!A||!A.games){ el.innerHTML=`<div class="panel full"><div class="empty-state">${t('noSim')}</div></div>`; return; }
  const P=A.players, S=A.sum;
  const kp=[[A.games,'kGames'],[f1(S.total/P),'kAvg'],[f1(A.winSum/A.games),'kWin'],[f1(A.marginSum/A.games),'kMargin'],[f1(S.done/P),'kDone'],[f1(S.gold/P),'kGold'],[f1(S.zeus/P),'kZeus'],[f1(S.muses/P),'kMuses']];
  let h=`<div class="panel full"><div class="kpis">${kp.map(([v,k])=>`<div class="kpi"><b>${v}</b><span>${t(k)}</span></div>`).join('')}</div></div>`;
  // répartition
  const parts=[[`<img class="ico sq" src="a/t1b.webp" alt=""> ${t('trials')}`,S.trials/P],[`${icS('S')} ${t('hero')}`,S.heroPts/P],[`${icGlory()} ${t('glory')}`,S.glory/P],[`${icItem()} ${t('items')}`,S.itemsPts/P]];
  const pm=Math.max(...parts.map(x=>x[1]));
  h+=`<div class="panel"><div class="ptitle">${t('breakdown')}</div>${parts.map(([l,v])=>hbar(l,v,pm,icVP(f1(v)))).join('')}</div>`;
  // places
  let seats='';
  Object.keys(A.byN).sort().forEach(n=>{
    n=+n; seats+=`<div class="subh">${t('players',n)} · ${A.byN[n].games}</div>`;
    for(let s=0;s<n;s++){ const x=A.seats[n+':'+s]; if(!x) continue; seats+=hbar(t('seat',s+1),x.win/x.n,Math.max(0.6,2/n),pct(x.win/x.n),1/n,`${t('expected')} ${pct(1/n)} · ${t('avgScore')} ${f1(x.total/x.n)}`); }
  });
  h+=`<div class="panel"><div class="ptitle">${t('seatT')}</div>${seats}<div class="note">▏ = ${t('expected')}</div></div>`;
  // héros
  const hs=Object.entries(A.heroes).filter(([,x])=>x.n).sort((a,b)=>b[1].win/b[1].n-a[1].win/a[1].n);
  const share=A.games/P;
  h+=`<div class="panel"><div class="ptitle">${t('heroT')}</div>${hs.map(([k,x])=>hbar(`<img class="ico sq" src="a/h_${k}.webp" alt=""> ${icS(NAMES.heroSym[k])} ${heroName(k)}`,x.win/x.n,0.6,pct(x.win/x.n),share,`${t('avgScore')} ${f1(x.total/x.n)} · n=${x.n}`)).join('')}<div class="note">▏ = ${t('expected')} · ${t('avgScore')} : ${hs.map(([k,x])=>`${heroName(k)} ${f1(x.total/x.n)}`).join(' · ')}</div></div>`;
  // dieux
  const gm=Math.max(...C.GOD_KEYS.map(g=>A.gods[g].done/P));
  h+=`<div class="panel"><div class="ptitle">${t('godT')}</div>${C.GOD_KEYS.map(g=>hbar(`${icG(g)} ${godName(g)}`,A.gods[g].done/P,gm,f1(A.gods[g].done/P))).join('')}</div>`;
  // histogrammes
  const hk=Object.keys(A.hist).map(Number).sort((a,b)=>a-b); const hist=[]; for(let b=hk[0];b<=hk[hk.length-1];b+=10) hist.push([b,A.hist[b]||0]);
  h+=`<div class="panel"><div class="ptitle">${t('histT')}</div>${cols(hist,(k,v)=>`${k}–${k+9} PV : ${pct(v/P)}`)}</div>`;
  const dh=[]; for(let d=0;d<=8;d++) dh.push([d,A.doneHist[d]||0]);
  h+=`<div class="panel"><div class="ptitle">${t('doneT')}</div>${cols(dh,(k,v)=>`${k} : ${pct(v/P)}`)}</div>`;
  // épreuves
  const trs=C.TRIALS.map(tr=>{ const x=A.trials[tr.id]; return {id:tr.id, name:trialName(tr.id), god:tr.god, req:tr.r.length, taken:x.taken/A.games, done:x.taken?x.done/x.taken:NaN, vp:x.done?x.vp/x.done:NaN, win:x.done?x.winDone/x.done:NaN}; });
  h+=`<div class="panel full"><div class="ptitle">${t('trialT')} <span class="zeusbar">${t('sortHint')}</span></div><div class="tblwrap">${table(trs,trialSort,'trial',[
    ['name',t('colName'),r=>`<img class="th" src="a/t${r.id}a.webp" alt="">${esc(r.name)}`],
    ['god',t('colGod'),r=>icG(r.god)],
    ['req',t('colReq'),r=>icons(C.TR[r.id].r.map(icS))],
    ['taken',t('colTaken'),r=>pct(r.taken),t('tipTaken')],
    ['done',t('colDone'),r=>`${pct(r.done)}<span class="bar" style="width:${(r.done||0)*50}px"></span>`,t('tipDone')],
    ['vp',t('colVP'),r=>f1(r.vp)],
    ['win',t('colWin'),r=>`${pct(r.win)}<span class="bar" style="width:${(r.win||0)*50}px"></span>`,t('tipWin')]])}</div></div>`;
  // objets
  const its=Object.keys(C.ITEMS).map(Number).map(id=>{ const x=A.items[id]; return {id, name:itemName(id), own:x.own/A.games, free:x.own?x.free/x.own:NaN, vp:x.own?x.vp/x.own:NaN, win:x.own?x.win/x.own:NaN, cost:C.ITEMS[id].cost}; });
  h+=`<div class="panel full"><div class="ptitle">${t('itemT')}</div><div class="tblwrap">${table(its,itemSort,'item',[
    ['name',t('colName'),r=>`<img class="th" src="a/i${r.id}.webp" alt="">${esc(r.name)}`],
    ['cost',t('cost'),r=>icCoin(r.cost)],
    ['own',t('colOwn'),r=>pct(r.own),t('tipOwn')],
    ['free',t('colFree'),r=>pct(r.free),t('tipFree')],
    ['vp',t('colVP'),r=>f1(r.vp)],
    ['win',t('colWin'),r=>`${pct(r.win)}<span class="bar" style="width:${(r.win||0)*50}px"></span>`,t('tipWinI')]])}</div></div>`;
  el.innerHTML=h;
}
function table(rows,sort,kind,colsDef){
  const sorted=rows.slice().sort((a,b)=>{ let x=a[sort.k], y=b[sort.k]; if(typeof x==='string') return sort.asc?x.localeCompare(y):y.localeCompare(x); x=isNaN(x)?-1:x; y=isNaN(y)?-1:y; return sort.asc?x-y:y-x; });
  return `<table class="tbl"><thead><tr>${colsDef.map(([k,l,,tip])=>`<th class="${['name','god','req'].includes(k)?'':'num'} ${sort.k===k?'on':''} ${sort.k===k&&sort.asc?'asc':''}" data-sort="${kind}:${k}" title="${esc(tip||'')}">${l}</th>`).join('')}</tr></thead>
  <tbody>${sorted.map(r=>`<tr>${colsDef.map(([k,,f])=>`<td class="${['name','god','req'].includes(k)?'':'num'}">${f(r)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
$('#statsOut').addEventListener('click',e=>{
  const th=e.target.closest('[data-sort]'); if(!th) return;
  const [kind,k]=th.dataset.sort.split(':'); const s=kind==='trial'?trialSort:itemSort;
  if(s.k===k) s.asc=!s.asc; else { s.k=k; s.asc=(k==='name'); }
  renderStats();
});

applyLang();
renderStats();
