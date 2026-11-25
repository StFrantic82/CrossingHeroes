'use strict';
// ===== Tutoriel guidé : partie contre 1 IA avec une bulle d'explication à chaque étape =====
const TUT_TXT={
fr:{
 btn:'Tutoriel', title:'Tutoriel', ok:'Compris', quit:'Quitter le tutoriel', step:(a,b)=>`Étape ${a}/${b}`,
 intro:`<b>Bienvenue dans Crossing Heroes !</b><br>Tu joues ton Héros, au centre de ta grille 3×3. En <b>8 tours</b>, tu vas l'entourer de <b>8 Épreuves</b> et essayer de les réussir grâce aux cartes Compétence posées sur les <b>bords</b> de la grille.<br>Ton adversaire, Ariane, est une IA. Le plus de points de victoire (PV) l'emporte.`,
 hero:`<b>Ton Héros</b> (au centre) te rapporte <b>2 PV par symbole</b> de sa couleur présent sur tes Compétences en fin de partie. Survole une carte pour l'agrandir et lire ses détails.`,
 A0:`<b>Phase A · Invoquer les Muses (facultatif).</b> Pour 1 or, tu peux renouveler une rangée (↻). Tu commences avec 1 or : garde-le pour l'instant.<br><br><b>Phase B · Choisir son destin.</b> Clique sur une des 4 <b>Épreuves</b> en surbrillance. En haut de la carte, les symboles à réunir ; en bas : son dieu, son bonus immédiat (or, Compétences) et ses PV.`,
 A1:`Pose maintenant l'Épreuve sur une <b>case libre</b> autour de ton Héros. Astuce : une Épreuve se réussit avec les Compétences de <b>sa ligne et sa colonne</b> (4 bords au maximum).`,
 skill:`Ton bonus te donne des <b>Compétences</b>. Tu ne peux les prendre que dans les <b>2 colonnes</b> situées sous l'Épreuve choisie (en surbrillance). Choisis une carte.`,
 skillSel:`Pose la Compétence sur un <b>bord libre</b> de ta grille (en surbrillance). Elle comptera pour les Épreuves de la ligne ou de la colonne qu'elle touche. Une fois posée, elle ne bouge plus.`,
 done:`<b>Épreuve réussie !</b> La carte se retourne et montre ses PV, qui compteront en fin de partie. Une Épreuve est réussie dès que les symboles de sa ligne et de sa colonne couvrent ce qu'elle demande.`,
 C:`<b>Phase C · Se préparer au combat (facultatif).</b> Tu peux acheter <b>un Objet</b> avec ton or : PV, multiplicateurs, Gloire… Survole-les pour lire leurs effets. Sinon, clique sur <b>Terminer le tour</b>.`,
 ai:`Au tour d'Ariane : regarde la <b>Chronique</b> pour suivre ce qu'elle fait. Clique sur son nom en haut pour voir sa grille.`,
 refill:`Quand ta prise <b>vide une 2e colonne</b> du présentoir de Compétences, il est entièrement rempli et tu gagnes <b>1 or</b>. Pense à l'utiliser !`,
 glory:`Certaines Compétences portent une <b>Gloire</b> (colonne). En fin de partie : 1/3/6/10/15 PV pour 1 à 5 Gloires et plus. Et certaines Épreuves rapportent des PV <b>par Gloire</b> : redoutables !`,
 zeus:`<b>Bénédiction de Zeus !</b> Tu as réussi des Épreuves de <b>4 dieux différents</b> : choisis un Objet <b>gratuit</b>.`,
 mid:`À toi de jouer seul maintenant ! Garde en tête : <b>diversifier les dieux</b> (Zeus), <b>viser les symboles de ton Héros</b>, et ne pas laisser l'adversaire prendre une Épreuve trop forte pour lui. Le bouton <b>Aide</b> rappelle les règles.`,
 end:`<b>Fin de partie !</b> Le score additionne les Épreuves réussies, les symboles de ton Héros, la Gloire et les Objets. Tu peux rejouer, essayer la partie en ligne ou l'extension Guerre de Troie.`,
},
en:{
 btn:'Tutorial', title:'Tutorial', ok:'Got it', quit:'Quit the tutorial', step:(a,b)=>`Step ${a}/${b}`,
 intro:`<b>Welcome to Crossing Heroes!</b><br>You play your Hero, in the middle of your 3×3 grid. Over <b>8 turns</b> you will surround it with <b>8 Trials</b> and try to complete them with the Skill cards placed on the <b>edges</b> of the grid.<br>Your opponent, Ariane, is an AI. Most victory points (VP) wins.`,
 hero:`<b>Your Hero</b> (in the middle) scores <b>2 VP per symbol</b> of its colour on your Skill cards at the end of the game. Hover over any card to enlarge it and read its details.`,
 A0:`<b>Phase A · Invoke the Muses (optional).</b> For 1 gold you can refresh a row (↻). You start with 1 gold: keep it for now.<br><br><b>Phase B · Choose your destiny.</b> Click one of the 4 highlighted <b>Trials</b>. At the top of the card: the symbols to gather; at the bottom: its god, its immediate bonus (gold, Skills) and its VP.`,
 A1:`Now place the Trial on a <b>free space</b> around your Hero. Tip: a Trial is completed with the Skill cards in <b>its row and column</b> (up to 4 edges).`,
 skill:`Your bonus gives you <b>Skill cards</b>. You may only take them from the <b>2 columns</b> below the chosen Trial (highlighted). Pick a card.`,
 skillSel:`Place the Skill card on a <b>free edge</b> of your grid (highlighted). It counts for the Trials in the row or column it touches. Once placed, it stays there.`,
 done:`<b>Trial completed!</b> The card flips to show its VP, scored at the end of the game. A Trial is completed as soon as the symbols in its row and column cover what it requires.`,
 C:`<b>Phase C · Prepare for battle (optional).</b> You may buy <b>one Item</b> with your gold: VP, multipliers, Glory… Hover over them to read their effects. Otherwise click <b>End turn</b>.`,
 ai:`It's Ariane's turn: follow what she does in the <b>Chronicle</b>. Click her name at the top to see her grid.`,
 refill:`When your take <b>empties a 2nd column</b> of the Skill display, it is fully refilled and you gain <b>1 gold</b>. Remember to use it!`,
 glory:`Some Skill cards bear a <b>Glory</b> symbol (column). At the end: 1/3/6/10/15 VP for 1 to 5+ Glory. And some Trials score VP <b>per Glory</b>: formidable!`,
 zeus:`<b>Blessing of Zeus!</b> You completed Trials of <b>4 different gods</b>: choose a <b>free</b> Item.`,
 mid:`Now you're on your own! Remember: <b>spread across the gods</b> (Zeus), <b>aim for your Hero's symbols</b>, and don't leave a Trial that is too strong for your opponent. The <b>Help</b> button recalls the rules.`,
 end:`<b>Game over!</b> The score adds completed Trials, your Hero's symbols, Glory and Items. Play again, try an online game or the Trojan War expansion.`,
},
it:{
 btn:'Tutorial', title:'Tutorial', ok:'Capito', quit:'Esci dal tutorial', step:(a,b)=>`Passo ${a}/${b}`,
 intro:`<b>Benvenuto in Crossing Heroes!</b><br>Giochi il tuo Eroe, al centro della tua griglia 3×3. In <b>8 turni</b> lo circonderai di <b>8 Prove</b> e cercherai di superarle grazie alle carte Abilità poste sui <b>bordi</b> della griglia.<br>La tua avversaria, Ariane, è un'IA. Vince chi ha più punti vittoria (PV).`,
 hero:`<b>Il tuo Eroe</b> (al centro) vale <b>2 PV per simbolo</b> del suo colore sulle tue Abilità a fine partita. Passa sopra una carta per ingrandirla e leggerne i dettagli.`,
 A0:`<b>Fase A · Invocare le Muse (facoltativo).</b> Per 1 oro puoi rinnovare una fila (↻). Inizi con 1 oro: per ora tienilo.<br><br><b>Fase B · Scegliere il destino.</b> Clicca una delle 4 <b>Prove</b> evidenziate. In alto i simboli da riunire; in basso: il suo dio, il bonus immediato (oro, Abilità) e i suoi PV.`,
 A1:`Ora posiziona la Prova su una <b>casella libera</b> attorno al tuo Eroe. Consiglio: una Prova si supera con le Abilità della <b>sua riga e colonna</b> (massimo 4 bordi).`,
 skill:`Il bonus ti dà delle <b>Abilità</b>. Puoi prenderle solo dalle <b>2 colonne</b> sotto la Prova scelta (evidenziate). Scegli una carta.`,
 skillSel:`Posiziona l'Abilità su un <b>bordo libero</b> della griglia (evidenziato). Conta per le Prove della riga o colonna che tocca. Una volta posata, non si sposta più.`,
 done:`<b>Prova superata!</b> La carta si gira e mostra i suoi PV, contati a fine partita. Una Prova è superata appena i simboli della sua riga e colonna coprono ciò che richiede.`,
 C:`<b>Fase C · Prepararsi alla battaglia (facoltativo).</b> Puoi comprare <b>un Oggetto</b> con il tuo oro: PV, moltiplicatori, Gloria… Passaci sopra per leggerne gli effetti. Altrimenti clicca <b>Termina il turno</b>.`,
 ai:`Tocca ad Ariane: segui le sue mosse nella <b>Cronaca</b>. Clicca il suo nome in alto per vedere la sua griglia.`,
 refill:`Quando la tua presa <b>svuota una 2ª colonna</b> dell'espositore, questo si riempie del tutto e guadagni <b>1 oro</b>. Ricordati di usarlo!`,
 glory:`Alcune Abilità hanno un simbolo <b>Gloria</b> (colonna). A fine partita: 1/3/6/10/15 PV per 1-5+ Glorie. E alcune Prove danno PV <b>per Gloria</b>: temibili!`,
 zeus:`<b>Benedizione di Zeus!</b> Hai superato Prove di <b>4 dèi diversi</b>: scegli un Oggetto <b>gratuito</b>.`,
 mid:`Ora giochi da solo! Ricorda: <b>varia gli dèi</b> (Zeus), <b>punta ai simboli del tuo Eroe</b> e non lasciare all'avversario una Prova troppo forte per lui. Il pulsante <b>Aiuto</b> riassume le regole.`,
 end:`<b>Fine partita!</b> Il punteggio somma le Prove superate, i simboli del tuo Eroe, la Gloria e gli Oggetti. Gioca ancora, prova la partita online o l'espansione Guerra di Troia.`,
}};
const TUT={on:false,seen:new Set(),cur:null,refillSeen:false,placed:null};
const TT=k=>TUT_TXT[L][k];
const TUT_ORDER=['intro','hero','A0','A1','skill','skillSel','done','C','ai','glory','refill','zeus','mid','end'];
const TUT_HL={A0:'#market .tcard', A1:'#board .cell.free', skill:'#market .scard.pick', skillSel:'#board .edge.pick', C:'#items', ai:'#log', zeus:'#items', glory:null, refill:'#deckinfo', done:null, intro:'#board', mid:null, end:null};

function tutStart(){
  TUT.on=true; TUT.seen=new Set(); TUT.cur=null; TUT.refillSeen=false;
  let name='Moi'; try{ const s=JSON.parse(localStorage.getItem('ch_setup2')); if(s&&s[0]&&!s[0].ai&&s[0].name) name=s[0].name; }catch(e){}
  startGame(C.newGame({players:[{name,ai:false},{name:'Ariane',ai:true}],troy:false}));
  // le joueur commence toujours pendant le tutoriel
  if(G.cur!==0){ G.cur=0; G.first=0; view=0; busy=false; logEv.forEach(e=>{ if(e.k==='start') e.p=0; }); render(); }
}
function tutStop(){ TUT.on=false; const b=document.getElementById('tutbox'); if(b) b.remove(); document.querySelectorAll('.tut-hl').forEach(e=>e.classList.remove('tut-hl')); }
function tutWanted(){
  if(!G) return null;
  const me0=G.players[0], ph=G.phase, mine=G.cur===0&&!busy;
  const unseen=k=>!TUT.seen.has(k);
  if(ph==='end') return 'end';
  if(unseen('intro')) return 'intro';
  if(unseen('hero')) return 'hero';
  if(me0.done.some(Boolean)&&unseen('done')) return 'done';
  if(mine&&ph==='zeus') return 'zeus';
  if(!mine && unseen('ai') && TUT.seen.has('C')) return 'ai';
  if(mine&&ph==='A'){
    if(G.sel==null && unseen('A0')) return 'A0';
    if(G.sel!=null && unseen('A1')) return 'A1';
    if(G.sel==null && me0.turns>=1 && unseen('glory')) return 'glory';
    if(G.sel==null && me0.turns>=2 && unseen('refill')) return 'refill';
    if(G.sel==null && me0.turns>=3 && unseen('mid')) return 'mid';
  }
  if(mine&&ph==='skill'){
    if(!G.sel && unseen('skill')) return 'skill';
    if(G.sel && unseen('skillSel')) return 'skillSel';
  }
  if(mine&&ph==='C'&&unseen('C')) return 'C';
  return null;
}
function tutAfterRender(){
  if(!TUT.on||!G) return;
  // une étape déjà affichée et dépassée par l'action du joueur est considérée comme lue
  const w=tutWanted();
  if(TUT.cur && TUT.cur!==w && TUT.cur!=='intro' && TUT.cur!=='hero' && TUT.cur!=='end') TUT.seen.add(TUT.cur);
  TUT.cur=w;
  document.querySelectorAll('.tut-hl').forEach(e=>e.classList.remove('tut-hl'));
  let box=document.getElementById('tutbox');
  if(!w){ if(box) box.style.display='none'; return; }
  if(!box){ box=document.createElement('div'); box.id='tutbox'; document.body.appendChild(box);
    box.addEventListener('click',e=>{ const b=e.target.closest('[data-tut]'); if(!b) return;
      if(b.dataset.tut==='ok'){ TUT.seen.add(TUT.cur); if(TUT.cur==='end') tutStop(); else { TUT.cur=null; render(); } }
      if(b.dataset.tut==='quit') tutStop(); }); }
  box.style.display='block';
  const n=TUT_ORDER.indexOf(w)+1;
  const needOk=['intro','hero','done','ai','glory','refill','mid','end'].includes(w);
  box.innerHTML=`<div class="tut-h"><span>🏛 ${TT('title')} · ${TT('step')(n,TUT_ORDER.length)}</span><button class="tut-x" data-tut="quit" title="${TT('quit')}">×</button></div>
    <div class="tut-b">${TT(w)}</div>
    <div class="tut-f">${needOk?`<button class="btn sm" data-tut="ok">${TT('ok')}</button>`:''}<button class="btn ghost sm" data-tut="quit">${TT('quit')}</button></div>`;
  const sel=TUT_HL[w];
  if(w==='hero'){ const c=document.querySelectorAll('#board .cell'); const h=[...c].find(x=>x.querySelector('img')&&x.dataset.zoom&&x.dataset.zoom.includes('/h')); if(h) h.classList.add('tut-hl'); }
  else if(sel) document.querySelectorAll(sel).forEach(e=>e.classList.add('tut-hl'));
  if(w==='done') document.querySelectorAll('#board .cell .ok').forEach(e=>e.parentElement.classList.add('tut-hl'));
  if(w==='ai') document.querySelectorAll('.ptab')[1]?.classList.add('tut-hl');
  const fresh=TUT.placed!==w; TUT.placed=w;
  if(fresh){ const first=document.querySelector('.tut-hl'); if(first) tutScrollTo(first); }
  tutPlace();
}
// Place la bulle dans le coin qui ne recouvre pas les zones expliquées
function tutRects(){ return [...document.querySelectorAll('.tut-hl')].map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.height); }
function tutOverlap(a,b){ const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)), y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); return x*y; }
function tutPlace(){
  const box=document.getElementById('tutbox'); if(!box||box.style.display==='none') return;
  const W=innerWidth, H=innerHeight, m=W<760?8:16, bw=box.offsetWidth, bh=box.offsetHeight;
  const rects=tutRects();
  const spots=[['bottom','right'],['bottom','left'],['top','right'],['top','left']].map(([v,h])=>{
    const left=h==='left'?m:W-bw-m, top=v==='top'?m:H-bh-m;
    const r={left,top,right:left+bw,bottom:top+bh};
    const cost=rects.reduce((s,x)=>s+tutOverlap(r,x),0);
    return {v,h,cost,left,top};
  });
  spots.sort((a,b)=>a.cost-b.cost);
  let s=spots[0];
  // si tout recouvre (petit écran), on cherche la meilleure hauteur libre
  if(s.cost>0){
    let best=null;
    for(let top=m; top<=H-bh-m; top+=12){
      const r={left:W<760?m:s.left,top,right:(W<760?m:s.left)+bw,bottom:top+bh};
      const c=rects.reduce((a,x)=>a+tutOverlap(r,x),0);
      if(!best||c<best.c){ best={c,top,left:r.left}; if(!c) break; }
    }
    if(best&&best.c<s.cost) s={left:best.left,top:best.top,cost:best.c};
  }
  box.style.left=s.left+'px'; box.style.top=s.top+'px'; box.style.right='auto'; box.style.bottom='auto';
  box.dataset.overlap=Math.round(s.cost);
}
function tutScrollTo(el){
  const r=el.getBoundingClientRect();
  if(r.top<0||r.bottom>innerHeight) el.scrollIntoView({block:'center',behavior:'smooth'});
}
addEventListener('resize',()=>{ if(TUT.on) tutPlace(); });
addEventListener('scroll',()=>{ if(TUT.on) tutPlace(); },{passive:true});
// Pendant l'intro, l'IA attend que le joueur ait lu
const _sched=scheduleAI;
scheduleAI=async function(){ if(TUT.on&&!TUT.seen.has('hero')) return; return _sched(); };
const _goHome=goHome;
goHome=function(){ tutStop(); _goHome(); };

document.getElementById('tutBtn').onclick=tutStart;
function tutLabel(){ const b=document.getElementById('tutBtn'); if(b) b.innerHTML='🎓 '+TT('btn'); if(TUT.on&&G) render(); }
document.querySelector('.langs').addEventListener('click',()=>setTimeout(tutLabel,0));
tutLabel();
