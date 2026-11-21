'use strict';
// ===== Partie en ligne : pair-à-pair (PeerJS), l'hôte fait tourner la seule vraie partie =====
const MP={on:false,host:false,stage:'menu',seat:0,code:'',players:[],err:'',net:null,conn:null,token:'',started:false,lost:false,busy:false,name:''};
const MP_URL='https://stfrantic82.github.io/CrossingHeroes/';
const MP_MAX=5;
const MP_TEST=/mptest/.test(location.search);
const MP_OK=MP_TEST||/github\.io$/.test(location.hostname)||/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const MPT=(fr,en,it)=>L==='fr'?fr:L==='it'?(it||en):en;
try{ MP.name=localStorage.getItem('chmp_name')||''; }catch(e){}

/* ---------- Réseau : PeerJS (WebRTC) ou canal local de test (BroadcastChannel) ---------- */
let MP_PEERJS=null;
function mpLoadPeer(){
  if(MP_PEERJS) return MP_PEERJS;
  MP_PEERJS=new Promise((ok,ko)=>{
    if(window.Peer) return ok();
    const src=['https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
    const tryN=i=>{ if(i>=src.length){ MP_PEERJS=null; return ko(new Error('peerjs')); }
      const s=document.createElement('script'); s.src=src[i];
      s.onload=()=>window.Peer?ok():tryN(i+1); s.onerror=()=>{ s.remove(); tryN(i+1); };
      document.head.appendChild(s); };
    tryN(0);
  });
  return MP_PEERJS;
}
function mpWrapPeerConn(c){
  const o={send:m=>{ try{ c.open&&c.send(JSON.stringify(m)); }catch(e){} }, close:()=>{ try{ c.close(); }catch(e){} }, _d:null, _c:null};
  c.on('data',d=>{ try{ o._d&&o._d(typeof d==='string'?JSON.parse(d):d); }catch(e){ console.error(e); } });
  c.on('close',()=>o._c&&o._c()); c.on('error',()=>o._c&&o._c());
  return o;
}
function mpTestNet(){
  const me='t'+Math.random().toString(36).slice(2,8);
  return {
    host(code,onConn){ return new Promise(ok=>{
      const ch=new BroadcastChannel('chmp-'+code), conns={};
      ch.onmessage=e=>{ const m=e.data; if(m.to!=='host') return;
        if(m.k==='open'){ const c={send:d=>ch.postMessage({to:m.from,from:'host',k:'d',d:JSON.parse(JSON.stringify(d))}),close:()=>{ ch.postMessage({to:m.from,from:'host',k:'close'}); delete conns[m.from]; },_d:null,_c:null};
          conns[m.from]=c; ch.postMessage({to:m.from,from:'host',k:'ok'}); onConn(c); }
        else if(m.k==='d'&&conns[m.from]) conns[m.from]._d&&conns[m.from]._d(m.d);
        else if(m.k==='close'&&conns[m.from]){ const c=conns[m.from]; delete conns[m.from]; c._c&&c._c(); } };
      ok({destroy(){ Object.values(conns).forEach(c=>c.close()); ch.close(); }});
    }); },
    join(code){ return new Promise((ok,ko)=>{
      const ch=new BroadcastChannel('chmp-'+code); let c=null;
      const t=setTimeout(()=>{ ch.close(); ko({type:'peer-unavailable'}); },1500);
      ch.onmessage=e=>{ const m=e.data; if(m.to!==me) return;
        if(m.k==='ok'){ clearTimeout(t); c={send:d=>ch.postMessage({to:'host',from:me,k:'d',d:JSON.parse(JSON.stringify(d))}),close:()=>{ ch.postMessage({to:'host',from:me,k:'close'}); ch.close(); },_d:null,_c:null}; ok(c); }
        else if(m.k==='d'&&c) c._d&&c._d(m.d);
        else if(m.k==='close'&&c){ c._c&&c._c(); ch.close(); } };
      ch.postMessage({to:'host',from:me,k:'open'});
    }); }
  };
}
function mpPeerNet(){
  return {
    host(code,onConn){ return mpLoadPeer().then(()=>new Promise((ok,ko)=>{
      const p=new Peer('crossingheroes-mp-'+code); let up=false;
      p.on('open',()=>{ up=true; ok({destroy(){ try{ p.destroy(); }catch(e){} }}); });
      p.on('connection',c=>c.on('open',()=>onConn(mpWrapPeerConn(c))));
      p.on('error',e=>{ if(!up){ try{ p.destroy(); }catch(x){} ko(e); } else console.warn('peer',e.type); });
      p.on('disconnected',()=>{ try{ p.reconnect(); }catch(e){} });
    })); },
    join(code){ return mpLoadPeer().then(()=>new Promise((ok,ko)=>{
      const p=new Peer(); let done=false;
      const fail=e=>{ if(done) return; done=true; try{ p.destroy(); }catch(x){} ko(e); };
      const t=setTimeout(()=>fail({type:'timeout'}),20000);
      p.on('error',fail);
      p.on('open',()=>{ const c=p.connect('crossingheroes-mp-'+code,{reliable:true});
        c.on('open',()=>{ if(done) return; done=true; clearTimeout(t); const w=mpWrapPeerConn(c); const cl=w.close; w.close=()=>{ cl(); setTimeout(()=>{ try{ p.destroy(); }catch(e){} },300); }; ok(w); });
        c.on('error',fail); });
    })); }
  };
}
const mpNet=()=>MP_TEST?mpTestNet():mpPeerNet();
const mpCode=()=>{ const A='ABCDEFGHJKLMNPQRSTUVWXYZ'; let s=''; for(let i=0;i<4;i++) s+=A[Math.random()*A.length|0]; return s; };
const mpTok=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
function mpErrTxt(e){
  const t=e&&e.type;
  if(t==='peer-unavailable') return MPT("Salon introuvable. Vérifie le code (l'hôte doit garder la page ouverte).","Room not found. Check the code (the host must keep the page open).","Stanza non trovata. Controlla il codice (l'host deve tenere la pagina aperta).");
  if(t==='timeout') return MPT("La connexion a échoué (délai dépassé). Réessaie, ou essaie un autre réseau.","Connection timed out. Try again, or try another network.","Connessione scaduta. Riprova o prova un'altra rete.");
  if(e&&e.message==='peerjs') return MPT("Impossible de charger la bibliothèque réseau. Vérifie ta connexion Internet.","Could not load the network library. Check your Internet connection.","Impossibile caricare la libreria di rete. Controlla la connessione.");
  return MPT('Erreur de connexion','Connection error','Errore di connessione')+(t?' ('+t+')':'');
}
function mpSend(m){ if(MP.conn&&!MP.lost) MP.conn.send(m); }

/* ---------- Hôte ---------- */
function mpView(){
  const v=Object.assign({},G,{trialDeck:Array(G.trialDeck.length).fill(0), skillDeck:Array(G.skillDeck.length).fill(0), itemPile:Array(G.itemPile.length).fill(0), events:[]});
  v.sel = G.players[G.cur]&&G.players[G.cur].ai ? G.sel : null;
  v.busy=busy;
  return v;
}
function mpLobbyMsg(){ return {t:'lobby',code:MP.code,troy:!!MP.troy,started:MP.started,players:MP.players.map(p=>({name:p.name,ai:!!p.ai,online:p.online}))}; }
let mpLastSent='';
function mpBroadcast(force){
  if(!MP.on||!MP.host) return;
  const base=mpLobbyMsg();
  if(MP.started&&G){ base.view=mpView(); base.log=logEv.slice(0,40); }
  const key=JSON.stringify(base);
  if(!force&&key===mpLastSent) return; mpLastSent=key;
  MP.players.forEach((p,i)=>{ if(!i||p.ai||!p.conn||!p.online) return; p.conn.send(Object.assign({},base,{you:i})); });
}
function mpHostConn(c){
  let pl=null;
  c._d=m=>{
    if(!m||!m.t) return;
    if(m.t==='join'){
      const name=String(m.name||'').trim().slice(0,16)||MPT('Joueur','Player','Giocatore');
      const old=MP.players.find(p=>p.token&&p.token===m.token);
      if(old){ pl=old; if(old.conn&&old.conn!==c) try{ old.conn.close(); }catch(e){} old.conn=c; old.online=true; }
      else{
        if(MP.started){ c.send({t:'err',e:'started'}); setTimeout(()=>c.close(),300); return; }
        if(MP.players.length>=MP_MAX){ c.send({t:'err',e:'full'}); setTimeout(()=>c.close(),300); return; }
        pl={name,ai:false,token:m.token||mpTok(),conn:c,online:true}; MP.players.push(pl);
      }
      mpBroadcast(true); mpRender(); return;
    }
    if(!pl) return;
    const s=MP.players.indexOf(pl); if(s<0) return;
    if(m.t==='act'&&MP.started&&G&&G.phase!=='end'&&G.cur===s&&!G.players[s].ai&&!busy&&ACTS.includes(m.fn)){
      const before=JSON.stringify([G.phase,G.cur,G.players[s].turns]);
      C[m.fn](G,...(m.args||[]));
      G.sel=null;
      if(m.fn==='muses') render(); else after();
      mpBroadcast(true); return;
    }
    if(m.t==='leave') mpDrop(pl,true);
  };
  c._c=()=>{ if(pl) mpDrop(pl,false); };
}
function mpDrop(pl,left){
  const s=MP.players.indexOf(pl); if(s<0) return;
  pl.online=false; pl.conn=null;
  if(left&&!MP.started) MP.players.splice(s,1);
  mpBroadcast(true); mpRender(); if(G) render();
}
async function mpHost(){
  mpName(); MP.err=''; MP.busy=true; mpRender();
  const net=mpNet();
  for(let tries=0;tries<4&&!MP.net;tries++){
    const code=mpCode();
    try{ MP.net=await net.host(code,mpHostConn); MP.code=code; }
    catch(e){ if(!(e&&e.type==='unavailable-id')){ MP.busy=false; MP.err=mpErrTxt(e); mpRender(); return; } }
  }
  if(!MP.net){ MP.busy=false; MP.err=mpErrTxt({}); mpRender(); return; }
  Object.assign(MP,{troy:troyOn,busy:false,on:true,host:true,seat:0,stage:'lobby',started:false,players:[{name:mpName(),ai:false,token:'host',conn:null,online:true}]});
  mpRender();
}
const MP_AI=['Ariane','Jason','Atalante','Persée','Médée','Thésée','Hélène'];
function mpAddAI(){ if(!MP.host||MP.started||MP.players.length>=MP_MAX) return; const used=MP.players.map(p=>p.name); MP.players.push({name:MP_AI.find(n=>!used.includes(n))||'IA',ai:true,online:true}); mpBroadcast(true); mpRender(); }
function mpRemove(i){ if(!MP.host||MP.started||!i) return; const p=MP.players[i]; if(!p) return; if(p.conn){ p.conn.send({t:'err',e:'kicked'}); setTimeout(()=>{ try{ p.conn.close(); }catch(e){} },300); } MP.players.splice(i,1); mpBroadcast(true); mpRender(); }
function mpStart(){
  if(!MP.host||MP.started) return;
  const P=MP.players; if(P.length<2||P.some(p=>!p.online)) return;
  MP.started=true; MP.stage='game';
  startGame(C.newGame({troy:!!MP.troy,players:P.map(p=>({name:p.name,ai:p.ai}))}));
  mpBroadcast(true);
}
function mpBackToLobby(){
  if(!MP.host) return;
  G=null; busy=false; MP.started=false; MP.stage='lobby';
  MP.players=MP.players.filter(p=>p.online);
  $('#game').classList.add('hidden'); document.querySelectorAll('.pre').forEach(el=>el.classList.remove('hidden')); showTab('play');
  mpBroadcast(true); mpRender();
}

/* ---------- Client ---------- */
async function mpJoin(code){
  code=String(code||'').toUpperCase().replace(/[^A-Z]/g,'').slice(0,4);
  if(code.length!==4){ MP.err=MPT('Le code fait 4 lettres.','The code has 4 letters.','Il codice ha 4 lettere.'); mpRender(); return; }
  mpName(); MP.err=''; MP.busy=true; mpRender();
  let tk=''; try{ tk=sessionStorage.getItem('chmp_tok_'+code)||''; }catch(e){}
  if(!tk){ tk=mpTok(); try{ sessionStorage.setItem('chmp_tok_'+code,tk); }catch(e){} }
  try{
    const c=await mpNet().join(code);
    Object.assign(MP,{conn:c,code,token:tk,on:true,host:false,lost:false,busy:false});
    if(MP.stage!=='game') MP.stage='lobby';
    c._d=mpClientMsg; c._c=()=>{ if(!MP.on) return; MP.lost=true; mpRender(); if(G) render(); };
    c.send({t:'join',name:mpName(),token:tk}); mpRender();
  }catch(e){ MP.busy=false; MP.err=mpErrTxt(e); mpRender(); }
}
function mpClientMsg(m){
  if(!m||!m.t) return;
  if(m.t==='err'){
    MP.err= m.e==='full'?MPT('Ce salon est complet (5 joueurs).','This room is full (5 players).','Questa stanza è piena (5 giocatori).')
          : m.e==='kicked'?MPT("L'hôte t'a retiré du salon.",'The host removed you from the room.',"L'host ti ha rimosso dalla stanza.")
          : MPT('Cette partie a déjà commencé.','This game has already started.','Questa partita è già iniziata.');
    mpReset(true); mpRender(); return;
  }
  if(m.t==='closed'){ mpReset(true); MP.err=MPT("L'hôte a fermé le salon.",'The host closed the room.',"L'host ha chiuso la stanza."); if(G){ G=null; $('#game').classList.add('hidden'); document.querySelectorAll('.pre').forEach(el=>el.classList.remove('hidden')); showTab('play'); } mpRender(); return; }
  if(m.t==='lobby'){
    MP.players=m.players; MP.seat=m.you; MP.started=m.started; MP.troy=!!m.troy;
    if(m.view){
      const v=m.view;
      const keep = G && G.cur===v.cur && G.phase===v.phase && v.cur===MP.seat ? G.sel : v.sel;
      const fresh=!G;
      const turnChanged = !G || G.cur!==v.cur || G.phase==='end'!==(v.phase==='end');
      busy=!!v.busy; delete v.busy;
      G=v; G.sel=keep; logEv=m.log||[];
      if(fresh){ doneAt.clear(); view=G.cur; MP.stage='game'; document.querySelectorAll('.pre').forEach(el=>el.classList.add('hidden')); $('#game').classList.remove('hidden'); window.scrollTo(0,0); }
      else if(turnChanged) view=G.cur;
      render();
      if(G.phase==='end' && !G.shown){ G.shown=true; setTimeout(showScores,500); }
    } else if(!m.started){
      if(G){ G=null; busy=false; $('#game').classList.add('hidden'); document.querySelectorAll('.pre').forEach(el=>el.classList.remove('hidden')); showTab('play'); hideModal(); }
      MP.stage='lobby'; mpRender();
    }
  }
}
function mpReset(keepErr){
  const e=MP.err;
  try{
    if(MP.host){ MP.players.forEach(p=>p.conn&&p.conn.send({t:'closed'})); const n=MP.net; setTimeout(()=>{ try{ n&&n.destroy(); }catch(x){} },300); }
    else if(MP.conn){ MP.conn.send({t:'leave'}); const c=MP.conn; setTimeout(()=>c.close(),200); }
  }catch(x){}
  Object.assign(MP,{on:false,host:false,stage:'menu',players:[],started:false,conn:null,net:null,lost:false,busy:false,err:keepErr?e:''});
}
function mpLeave(){
  mpReset(false);
  G=null; busy=false; hideModal();
  $('#game').classList.add('hidden'); document.querySelectorAll('.pre').forEach(el=>el.classList.remove('hidden')); showTab('play');
  mpShow(false); renderSetup(); renderHistory();
}
function mpName(){
  const el=document.getElementById('mpn'); let n=(el?el.value:MP.name)||'';
  n=n.trim().slice(0,16); MP.name=n; try{ localStorage.setItem('chmp_name',n); }catch(e){}
  return n||MPT('Joueur','Player','Giocatore');
}

/* ---------- Écrans ---------- */
function mpShow(on){ $('#solo').classList.toggle('hidden',on); $('#mpPanel').classList.toggle('hidden',!on); if(on) mpRender(); }
function mpLink(){ return (MP_TEST?location.href.split('#')[0]:MP_URL)+'#join-'+MP.code; }
function mpCopy(t,el){ try{ navigator.clipboard.writeText(t).then(()=>{ if(el){ const o=el.innerHTML; el.innerHTML='✓ '+MPT('Copié','Copied','Copiato'); setTimeout(()=>el.innerHTML=o,1500); } }).catch(()=>{}); }catch(e){} }
function mpRender(){
  const A=$('#mpPanel'); if(!A) return;
  let h=`<p style="margin:0 0 14px"><button class="btn ghost sm" data-mp="back">← ${MP.on?MPT('Quitter le salon','Leave the room','Esci dalla stanza'):MPT('Retour','Back','Indietro')}</button></p>`;
  h+=`<h2 class="disp" style="font-size:22px;margin:0 0 10px">${MPT('Partie en ligne','Online game','Partita online')}</h2>`;
  if(MP.err) h+=`<p class="mperr">⚠ ${esc(MP.err)}</p>`;
  if(!MP_OK){
    h+=`<p>${MPT('La partie en ligne fonctionne sur la version web du jeu :','Online play works on the web version of the game:',"Il gioco online funziona sulla versione web del gioco:")}<br><a href="${MP_URL}" target="_blank" rel="noopener" class="mplink">${MP_URL}</a></p>
    <p class="fine">${MPT('Cette page ne peut pas ouvrir de connexion directe entre joueurs.','This page cannot open direct connections between players.','Questa pagina non può aprire connessioni dirette tra giocatori.')}</p>`;
    A.innerHTML=h; return;
  }
  if(!MP.on){
    let pre=''; const mm=(location.hash||'').match(/^#join-([A-Za-z]{4})$/); if(mm) pre=mm[1].toUpperCase();
    h+=`<p class="mptxt">${MPT("Joue avec des amis, chacun sur son appareil : un joueur crée un salon et partage le code, les autres le rejoignent. De 2 à 5 joueurs, l'hôte peut ajouter des IA.","Play with friends, each on their own device: one player creates a room and shares the code, the others join. 2 to 5 players; the host can add AIs.","Gioca con gli amici, ciascuno sul proprio dispositivo: un giocatore crea una stanza e condivide il codice, gli altri entrano. Da 2 a 5 giocatori; l'host può aggiungere IA.")}</p>
    <label class="mplab">${MPT('Ton nom','Your name','Il tuo nome')}<input id="mpn" maxlength="16" value="${esc(MP.name)}" placeholder="${MPT('Joueur','Player','Giocatore')}"></label>
    <div class="mpcards">
      <div class="mpcard"><b>${MPT('Créer un salon','Create a room','Crea una stanza')}</b><p>${MPT("Tu seras l'hôte : garde cette page ouverte jusqu'à la fin de la partie.",'You will be the host: keep this page open until the end of the game.',"Sarai l'host: tieni questa pagina aperta fino alla fine.")}</p><button class="btn sm" data-mp="host" ${MP.busy?'disabled':''}>${MPT('Créer','Create','Crea')}</button></div>
      <div class="mpcard"><b>${MPT('Rejoindre un salon','Join a room','Entra in una stanza')}</b><p>${MPT("Entre le code de 4 lettres donné par l'hôte.",'Enter the 4-letter code given by the host.',"Inserisci il codice di 4 lettere dato dall'host.")}</p><div style="display:flex;gap:8px"><input id="mpc" maxlength="4" value="${pre}" placeholder="ABCD" class="mpcode"><button class="btn sm" data-mp="join" ${MP.busy?'disabled':''}>${MPT('Rejoindre','Join','Entra')}</button></div></div>
    </div>${MP.busy?`<p class="mptxt">⏳ ${MPT('Connexion…','Connecting…','Connessione…')}</p>`:''}`;
    A.innerHTML=h; return;
  }
  if(MP.lost){ h+=`<p class="mptxt">⚠ ${MPT("Connexion à l'hôte perdue.",'Connection to the host lost.',"Connessione all'host persa.")} <button class="btn sm" data-mp="rejoin">${MPT('Se reconnecter','Reconnect','Riconnettiti')}</button></p>`; A.innerHTML=h; return; }
  const P=MP.players, ok=P.length>=2&&P.every(p=>p.online);
  h+=`<div class="mpcodebox"><span>${MPT('Code du salon','Room code','Codice stanza')}</span><b>${MP.code}</b>
    <div class="homebtns" style="justify-content:center"><button class="btn ghost sm" data-mp="copycode">${MPT('Copier le code','Copy code','Copia codice')}</button><button class="btn ghost sm" data-mp="copylink">${MPT("Copier le lien d'invitation",'Copy invitation link','Copia link di invito')}</button></div></div>
  <div class="ptitle" style="margin-top:14px">${MPT('Joueurs','Players','Giocatori')} (${P.length}/${MP_MAX})</div>
  ${P.map((p,i)=>`<div class="mprow ${i===MP.seat?'me':''}"><span class="dot" style="background:${COLORS[i]}"></span><b>${esc(p.name)}</b>
    ${p.ai?`<span class="badge">${t('ai')}</span>`:''}${i===0?`<small>(${MPT('hôte','host','host')})</small>`:''}${i===MP.seat?`<small>(${MPT('toi','you','tu')})</small>`:''}
    <span style="margin-left:auto">${p.online?'':'🔌 '+MPT('déconnecté','offline','disconnesso')}</span>
    ${MP.host&&i>0?`<button class="rm" data-mp="rm" data-i="${i}" title="${t('remove')}">×</button>`:''}</div>`).join('')}
  <label class="chk troyopt"><input type="checkbox" data-mp="troy" ${MP.troy?'checked':''} ${MP.host?'':'disabled'}> <img class="ico sq" src="a/g_TROY.webp" alt=""> ${t('troyName')}</label>
  ${MP.host?`<button class="addp" data-mp="addai" ${P.length>=MP_MAX?'disabled':''}>+ ${MPT('Ajouter une IA','Add an AI',"Aggiungi un'IA")}</button>
    <div class="homebtns"><button class="btn" data-mp="start" ${ok?'':'disabled'}>${MPT('Lancer la partie','Start the game','Avvia la partita')}</button></div>
    <p class="mptxt">${ok?'':P.length<2?MPT("En attente d'au moins un autre joueur…",'Waiting for at least one other player…','In attesa di almeno un altro giocatore…'):MPT('Un joueur est déconnecté.','A player is offline.','Un giocatore è disconnesso.')}</p>`
  :`<p class="mptxt">⏳ ${MPT("En attente du lancement par l'hôte…",'Waiting for the host to start the game…',"In attesa che l'host avvii la partita…")}</p>`}`;
  A.innerHTML=h;
}
document.getElementById('mpPanel').addEventListener('click',e=>{
  const b=e.target.closest('[data-mp]'); if(!b) return;
  const k=b.dataset.mp;
  if(k==='back'){ if(MP.on) mpLeave(); else { MP.err=''; mpShow(false); } }
  else if(k==='host') mpHost();
  else if(k==='join') mpJoin(document.getElementById('mpc').value);
  else if(k==='rejoin') mpJoin(MP.code);
  else if(k==='copycode') mpCopy(MP.code,b);
  else if(k==='copylink') mpCopy(mpLink(),b);
  else if(k==='addai') mpAddAI();
  else if(k==='rm') mpRemove(+b.dataset.i);
  else if(k==='start') mpStart();
  else if(k==='troy'&&MP.host){ MP.troy=b.checked; mpBroadcast(true); }
});
document.getElementById('mpPanel').addEventListener('keydown',e=>{ if(e.target.id==='mpc'&&e.key==='Enter') mpJoin(e.target.value); });
document.getElementById('online').onclick=()=>mpShow(true);

/* Barre d'état en jeu + diffusion après chaque rendu */
function mpAfterRender(){
  if(!MP.on) return;
  if(MP.host) mpBroadcast();
  let bar=document.getElementById('mpbar');
  if(!bar){ bar=document.createElement('div'); bar.id='mpbar'; document.getElementById('ptabs').before(bar); }
  const off=MP.players.filter(p=>!p.online).map(p=>esc(p.name));
  const mine=G&&G.phase!=='end'&&G.cur===MP.seat&&!G.players[G.cur].ai;
  bar.innerHTML=`<b>🌐 ${MPT('Salon','Room','Stanza')} ${MP.code}</b>
    <span>${G&&G.phase==='end'?'':mine?'👉 '+MPT('À toi de jouer !','Your turn!','Tocca a te!'):G?'⏳ '+MPT('Au tour de','Waiting for','Turno di')+' '+esc(G.players[G.cur].name):''}</span>
    ${off.length?`<span class="mperr">🔌 ${off.join(', ')}</span>`:''}
    ${MP.lost?`<span class="mperr">⚠ ${MPT('Connexion perdue','Connection lost','Connessione persa')} <button class="btn sm" data-mp2="rejoin">${MPT('Se reconnecter','Reconnect','Riconnettiti')}</button></span>`:''}
    ${G&&G.phase==='end'?(MP.host?`<button class="btn sm" data-act="again">${MPT('Nouvelle partie avec les mêmes joueurs','New game with the same players','Nuova partita con gli stessi giocatori')}</button>`:`<span>${MPT("L'hôte peut lancer une nouvelle partie.",'The host can start a new game.',"L'host può avviare una nuova partita.")}</span>`):''}`;
  bar.onclick=e=>{ if(e.target.closest('[data-mp2]')) mpJoin(MP.code); };
}
window.addEventListener('beforeunload',()=>{ try{ if(MP.on&&MP.host) MP.players.forEach(p=>p.conn&&p.conn.send({t:'closed'})); }catch(e){} });
function mpCheckHash(){ if(/^#join-[A-Za-z]{4}$/.test(location.hash||'')&&!MP.on&&!G){ showTab('play'); mpShow(true); } }
window.addEventListener('hashchange',mpCheckHash);
mpCheckHash();
