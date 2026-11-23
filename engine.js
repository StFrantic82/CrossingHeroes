// Crossing Heroes — moteur de jeu
(function(root){
'use strict';
const TRIALS = [{"id": 1, "n": "Le Dragon d'Arès", "r": ["S", "C", "C"], "god": "POS", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 3, "god": "POS"}}, {"id": 2, "n": "Hadès et Perséphone", "r": ["W", "E", "C", "C"], "god": "ATH", "b": {"g": 0, "s": 2}, "s": {"t": "flat", "v": 10}}, {"id": 3, "n": "Orphée et Eurydice", "r": ["W", "L", "L", "L"], "god": "POS", "b": {"g": 1, "s": 0}, "s": {"t": "flat", "v": 15}}, {"id": 4, "n": "S'échapper du Labyrinthe", "r": ["E", "L", "C"], "god": "POS", "b": {"g": 1, "s": 2}, "s": {"t": "flat", "v": 3}}, {"id": 5, "n": "L'Oracle de Delphes", "r": ["W", "W"], "god": "POS", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 2, "god": "POS"}}, {"id": 6, "n": "L'Énigme du Sphinx", "r": ["W", "W", "C"], "god": "HER", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 4, "god": "APO"}}, {"id": 7, "n": "Fuir les Grées", "r": ["W", "W", "C", "C"], "god": "APO", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 6, "item": 4}}, {"id": 8, "n": "Méduse la Gorgone", "r": ["S", "C"], "god": "APO", "b": {"g": 0, "s": 0}, "s": {"t": "flat", "v": 9}}, {"id": 9, "n": "Traverser le désert libyen", "r": ["E", "E", "L"], "god": "APO", "b": {"g": 2, "s": 1}, "s": {"t": "flat", "v": 4}}, {"id": 10, "n": "Délivrer Andromède", "r": ["W", "L", "E", "C"], "god": "POS", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 3}}, {"id": 11, "n": "Polydecte", "r": ["L", "L", "C", "C"], "god": "APO", "b": {"g": 2, "s": 1}, "s": {"t": "flat", "v": 8}}, {"id": 12, "n": "Dompter Pégase", "r": ["W", "W", "L"], "god": "POS", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 4, "god": "HER"}}, {"id": 13, "n": "La Chimère", "r": ["S", "S", "E"], "god": "POS", "b": {"g": 1, "s": 2}, "s": {"t": "item", "v": 3, "item": 7}}, {"id": 14, "n": "Le Lion de Némée", "r": ["S", "S", "S"], "god": "APO", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 5, "item": 1}}, {"id": 15, "n": "L'Hydre de Lerne", "r": ["S", "S", "C", "C"], "god": "HER", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 3}}, {"id": 16, "n": "La Biche de Cérynie", "r": ["W", "W", "E", "E"], "god": "APO", "b": {"g": 1, "s": 2}, "s": {"t": "flat", "v": 7}}, {"id": 17, "n": "Le Sanglier d'Érymanthe", "r": ["E", "E", "W"], "god": "HER", "b": {"g": 2, "s": 1}, "s": {"t": "flat", "v": 5}}, {"id": 18, "n": "Les Écuries d'Augias", "r": ["C", "C", "E", "E"], "god": "HER", "b": {"g": 0, "s": 2}, "s": {"t": "flat", "v": 8}}, {"id": 19, "n": "Les Oiseaux du lac Stymphale", "r": ["C", "C", "L"], "god": "HER", "b": {"g": 1, "s": 2}, "s": {"t": "item", "v": 4, "item": 1}}, {"id": 20, "n": "Le Taureau de Crète", "r": ["S", "S"], "god": "HER", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 2, "god": "HER"}}, {"id": 21, "n": "Les Juments de Diomède", "r": ["S", "S", "L"], "god": "APO", "b": {"g": 0, "s": 2}, "s": {"t": "flat", "v": 6}}, {"id": 22, "n": "La Ceinture d'Hippolyte", "r": ["S", "C", "E"], "god": "ATH", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 6, "item": 1}}, {"id": 23, "n": "Les Bœufs de Géryon", "r": ["S", "S", "E", "E"], "god": "HER", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 3}}, {"id": 24, "n": "Libérer Prométhée", "r": ["S", "E", "E"], "god": "POS", "b": {"g": 1, "s": 2}, "s": {"t": "item", "v": 3, "item": 1}}, {"id": 25, "n": "Le Jardin des Hespérides", "r": ["E", "W", "W"], "god": "HER", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 4, "god": "ATH"}}, {"id": 26, "n": "Cerbère", "r": ["S", "C", "E", "W", "L"], "god": "POS", "b": {"g": 0, "s": 0}, "s": {"t": "flat", "v": 22}}, {"id": 27, "n": "Antée", "r": ["S", "L", "L"], "god": "ATH", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 11}}, {"id": 28, "n": "Les Centaures", "r": ["S", "S", "C"], "god": "ATH", "b": {"g": 0, "s": 2}, "s": {"t": "flat", "v": 7}}, {"id": 29, "n": "Les Brigands de Sciron", "r": ["L", "S"], "god": "ATH", "b": {"g": 2, "s": 0}, "s": {"t": "flat", "v": 6}}, {"id": 30, "n": "Construire l'Argo", "r": ["E", "E", "E"], "god": "APO", "b": {"g": 0, "s": 1}, "s": {"t": "item", "v": 6, "item": 3}}, {"id": 31, "n": "Le Géant Talos", "r": ["S", "W", "W"], "god": "HER", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 4, "god": "POS"}}, {"id": 32, "n": "Les Harpies", "r": ["E", "L", "L", "L"], "god": "ATH", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 13}}, {"id": 33, "n": "Les Guerriers non-morts", "r": ["S", "S", "W", "W"], "god": "HER", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 3}}, {"id": 34, "n": "La Toison d'or", "r": ["S", "C", "E", "W", "W"], "god": "POS", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 16}}, {"id": 35, "n": "Des Cadeaux empoisonnés", "r": ["L", "L", "L"], "god": "ATH", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 5, "item": 3}}, {"id": 36, "n": "La Pomme de la Discorde", "r": ["S", "S", "L", "L"], "god": "POS", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 3}}, {"id": 37, "n": "Les Amazones", "r": ["E", "L", "L"], "god": "ATH", "b": {"g": 2, "s": 0}, "s": {"t": "item", "v": 4, "item": 5}}, {"id": 38, "n": "Le Fil d'Ariane", "r": ["C", "W", "L"], "god": "HER", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 3, "god": "HER"}}, {"id": 39, "n": "Le Labyrinthe du Minotaure", "r": ["S", "C", "E", "W"], "god": "ATH", "b": {"g": 0, "s": 0}, "s": {"t": "flat", "v": 18}}, {"id": 40, "n": "Polyphème", "r": ["C", "C"], "god": "APO", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 2, "god": "APO"}}, {"id": 41, "n": "Les Sirènes", "r": ["W", "E"], "god": "APO", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 5}}, {"id": 42, "n": "Calypso", "r": ["L", "L"], "god": "HER", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 4, "item": 2}}, {"id": 43, "n": "Circé", "r": ["C", "C", "W"], "god": "ATH", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 3, "god": "ATH"}}, {"id": 44, "n": "Les Lotophages", "r": ["C", "C", "C"], "god": "APO", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 6, "item": 2}}, {"id": 45, "n": "Charybde et Scylla", "r": ["W", "W", "W"], "god": "ATH", "b": {"g": 1, "s": 1}, "s": {"t": "item", "v": 5, "item": 2}}, {"id": 46, "n": "Le Concours de tir à l'arc", "r": ["S", "S", "W"], "god": "APO", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 3, "god": "APO"}}, {"id": 47, "n": "Les Tempêtes de Poséidon", "r": ["E", "E", "L", "L", "L"], "god": "POS", "b": {"g": 1, "s": 0}, "s": {"t": "flat", "v": 20}}, {"id": 48, "n": "Le Mendiant à Ithaque", "r": ["E", "E"], "god": "ATH", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 2, "god": "ATH"}}];
const TROY_TRIALS = [{"id": 101, "n": "Le Jugement de Pâris", "r": ["W", "W", "W", "E"], "god": "TROY", "b": {"g": 0, "s": 1}, "s": {"t": "god", "v": 4, "god": "TROY"}, "troy": 1}, {"id": 102, "n": "L'Enlèvement d'Hélène", "r": ["L", "L", "E", "E"], "god": "TROY", "b": {"g": 2, "s": 0}, "s": {"t": "flat", "v": 9}, "troy": 1}, {"id": 103, "n": "Le Sacrifice d'Iphigénie", "r": ["W", "E", "E", "E"], "god": "TROY", "b": {"g": 2, "s": 2}, "s": {"t": "god", "v": 2, "god": "TROY"}, "troy": 1}, {"id": 104, "n": "Penthésilée, reine des Amazones", "r": ["S", "C", "L"], "god": "TROY", "b": {"g": 1, "s": 2}, "s": {"t": "items", "v": 2}, "troy": 1}, {"id": 105, "n": "Duel avec Pâris", "r": ["S", "W", "C"], "god": "TROY", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 2}, "troy": 1}, {"id": 106, "n": "La Mort de Sarpédon", "r": ["W", "S", "E"], "god": "TROY", "b": {"g": 1, "s": 0}, "s": {"t": "items", "v": 4}, "troy": 1}, {"id": 107, "n": "Le Vol des chevaux de Rhésos", "r": ["C", "C", "S", "W", "L"], "god": "TROY", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 17}, "troy": 1}, {"id": 108, "n": "Blesser Arès sur le champ de bataille", "r": ["L", "L", "L", "C"], "god": "TROY", "b": {"g": 1, "s": 1}, "s": {"t": "god", "v": 3, "god": "TROY"}, "troy": 1}, {"id": 109, "n": "Duel avec Hector", "r": ["S", "S", "S", "L"], "god": "TROY", "b": {"g": 1, "s": 0}, "s": {"t": "god", "v": 5, "god": "TROY"}, "troy": 1}, {"id": 110, "n": "Affronter le fleuve Scamandre", "r": ["E", "E", "S"], "god": "TROY", "b": {"g": 0, "s": 2}, "s": {"t": "glory", "v": 2}, "troy": 1}, {"id": 111, "n": "Ramener Philoctète", "r": ["W", "W", "W", "C"], "god": "TROY", "b": {"g": 0, "s": 1}, "s": {"t": "flat", "v": 13}, "troy": 1}, {"id": 112, "n": "Le Cheval de Troie", "r": ["C", "C", "C", "S"], "god": "TROY", "b": {"g": 0, "s": 0}, "s": {"t": "god", "v": 6, "god": "TROY"}, "troy": 1}];
const TR = {}; TRIALS.concat(TROY_TRIALS).forEach(t => TR[t.id] = t);
const GLORY_TROY = [0,1,4,9,16,25];
const SYM = {S:'Force', C:'Ruse', E:'Endurance', W:'Sagesse', L:'Chance'};
const GODS = {POS:'Poséidon', ATH:'Athéna', APO:'Apollon', HER:'Hermès'};
const GOD_KEYS = ['POS','ATH','APO','HER'];
// Compétences : id -> symboles, gloire, or, exemplaires
const SKILLS = {};
const defs = [[1,'SS'],[2,'CC'],[3,'EE'],[4,'WW'],[5,'LL'],[6,'SE'],[7,'CS'],[8,'SW'],[9,'SL'],[10,'CL'],[11,'CW'],[12,'CE'],[13,'LW'],[14,'LE'],[15,'EW']];
defs.forEach(([id,s]) => SKILLS[id] = {id, syms:s.split(''), glory:0, gold:0, copies:3});
[[16,'S'],[17,'C'],[18,'W'],[19,'E'],[20,'L']].forEach(([id,s]) => SKILLS[id] = {id, syms:[s], glory:1, gold:0, copies:3});
[[21,'S'],[22,'C'],[23,'W'],[24,'E'],[25,'L']].forEach(([id,s]) => SKILLS[id] = {id, syms:[s], glory:0, gold:1, copies:2});
const ITEMS = {
  1:{n:"Massue d'Héraclès", cost:3, d:"4 PV · double Némée, Stymphale, Hippolyte, Prométhée"},
  2:{n:"Arc d'Ulysse", cost:3, d:"5 PV · double Calypso, Lotophages, Charybde et Scylla"},
  3:{n:"Chaudron de Médée", cost:3, d:"6 PV · double l'Argo et les Cadeaux empoisonnés"},
  4:{n:"Casque de Persée", cost:3, d:"7 PV · double Fuir les Grées"},
  5:{n:"Épée de Thésée", cost:3, d:"8 PV · double les Amazones"},
  6:{n:"Égide de Zeus", cost:2, d:"2 PV par Objet possédé (celui-ci inclus)"},
  7:{n:"Lance de Bellérophon", cost:2, d:"5 PV · double la Chimère"},
  8:{n:"Trident de Poséidon", cost:3, d:"3 PV par Épreuve de Poséidon (terminée ou non)"},
  9:{n:"Sandales d'Hermès", cost:3, d:"3 PV par Épreuve d'Hermès (terminée ou non)"},
  10:{n:"Chouette d'Athéna", cost:3, d:"3 PV par Épreuve d'Athéna (terminée ou non)"},
  11:{n:"Lyre d'Apollon", cost:3, d:"3 PV par Épreuve d'Apollon (terminée ou non)"},
  12:{n:"Torche de Prométhée", cost:3, d:"3 PV + prenez immédiatement 1 Compétence visible"},
  13:{n:"Coupe d'Ambroisie", cost:2, d:"2 PV par symbole Gloire"},
  14:{n:"Bouclier d'Achille", cost:3, d:"3 PV par Objet possédé (celui-ci inclus)"},
  15:{n:"Colonne", cost:2, d:"+1 symbole Gloire"},
  16:{n:"Corne d'abondance", cost:3, d:"10 PV"},
};
const HEROES = [{k:'cunning',sym:'C'},{k:'endurance',sym:'E'},{k:'luck',sym:'L'},{k:'strength',sym:'S'},{k:'wisdom',sym:'W'}];
const GLORY_TABLE = [0,1,3,6,10,15];
const EDGES = ['T0','T1','T2','L0','R0','L1','R1','L2','R2','B0','B1','B2'];
const TURNS = 8;

function rnd(n){ return Math.floor(Math.random()*n); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function edgeCell(e){ const k=e[0], i=+e[1]; return k==='T'?i : k==='B'?6+i : k==='L'?3*i : 3*i+2; }
function trialEdges(k){ const r=Math.floor(k/3), c=k%3; return ['L'+r,'R'+r,'T'+c,'B'+c]; }
function cellEdges(k){ return EDGES.filter(e => edgeCell(e)===k); }

function newGame(cfg){
  let uid=0;
  const skillDeck=[];
  Object.values(SKILLS).forEach(s => { for(let i=0;i<s.copies;i++) skillDeck.push({u:++uid, t:s.id}); });
  shuffle(skillDeck);
  const G = {
    troy: !!cfg.troy,
    trialDeck: shuffle(TRIALS.concat(cfg.troy?TROY_TRIALS:[]).map(t=>t.id)), trialRow:[],
    skillDeck, skillGrid:[[],[]],
    itemPile: shuffle(Object.keys(ITEMS).map(Number)), itemRow:[],
    players:[], cur:0, phase:'A', pend:null, bought:false, sel:null, events:[]
  };
  for(let i=0;i<4;i++) G.trialRow.push(G.trialDeck.shift());
  for(let r=0;r<2;r++) for(let c=0;c<5;c++) G.skillGrid[r].push(G.skillDeck.shift());
  for(let i=0;i<4;i++) G.itemRow.push(G.itemPile.shift());
  const heroes = shuffle(HEROES.slice());
  cfg.players.forEach((pc,i) => G.players.push({
    name:pc.name, ai:!!pc.ai, hero:heroes[i].k, sym:heroes[i].sym, gold:1,
    cells:[null,null,null,null,'H',null,null,null,null], done:Array(9).fill(false),
    edges:{}, items:[], zeus:0, turns:0, muses:0, freeItems:[],
    troy:!!cfg.troy, flipped:false, jokers:{}, usedJoker:false, usedFree:false, menelas:0
  }));
  G.cur = rnd(G.players.length);
  G.first = G.cur;
  ev(G,'start',{p:G.cur});
  return G;
}
function ev(G,k,a){ G.events.push(Object.assign({k},a||{})); }
function P(G){ return G.players[G.cur]; }

// ---------- Lecture d'état ----------
function freeCells(p){ const r=[]; for(let k=0;k<9;k++) if(k!==4 && p.cells[k]==null) r.push(k); return r; }
function availableEdges(p){ return EDGES.filter(e => !p.edges[e] && p.cells[edgeCell(e)]!=null && edgeCell(e)!==4); }
function symCounts(p,k){
  const c={S:0,C:0,E:0,W:0,L:0};
  trialEdges(k).forEach(e => { const card=p.edges[e]; if(card) SKILLS[card.t].syms.forEach(s=>c[s]++); });
  return c;
}
function power(p,k){ return p.troy && p.hero===k; }
function missingFor(p,k){
  const have={S:0,C:0,E:0,W:0,L:0}, need={};
  let wild=(p.jokers&&p.jokers[k])||0;
  const ajax=power(p,'endurance');
  trialEdges(k).forEach(e => { const card=p.edges[e]; if(!card) return; const s=SKILLS[card.t];
    if(ajax && s.glory) wild+=s.syms.length; else s.syms.forEach(x=>have[x]++); });
  TR[p.cells[k]].r.forEach(s => need[s]=(need[s]||0)+1);
  let m=0; for(const s in need) m+=Math.max(0, need[s]-have[s]);
  return Math.max(0,m-wild);
}
function itemCost(p,id){ return power(p,'strength') ? 2 : ITEMS[id].cost; }
function troyDone(p){ let n=0; for(let k=0;k<9;k++) if(p.done[k] && TR[p.cells[k]] && TR[p.cells[k]].troy) n++; return n; }
function isComplete(p,k){ return missingFor(p,k)===0; }
function godCount(p,god,onlyDone){ let n=0; for(let k=0;k<9;k++){ const t=p.cells[k]; if(t && t!=='H' && TR[t].god===god && (!onlyDone || p.done[k])) n++; } return n; }
function zeusSets(p){ return Math.min(...GOD_KEYS.map(g=>godCount(p,g,true))); }
function gloryOf(p){ let g=0; Object.values(p.edges).forEach(c => g+=SKILLS[c.t].glory); if(p.items.includes(15)) g++; return g; }
function heroSyms(p){ let n=0; Object.values(p.edges).forEach(c => SKILLS[c.t].syms.forEach(s=>{ if(s===p.sym) n++; })); return n; }
function trialValue(p,tid){
  const t=TR[tid], s=t.s;
  if(s.t==='flat') return s.v;
  if(s.t==='item') return p.items.includes(s.item) ? s.v*2 : s.v;
  if(s.t==='god') return s.v*godCount(p,s.god,false);
  if(s.t==='glory') return s.v*gloryOf(p);
  if(s.t==='items') return s.v*p.items.length;
  return 0;
}
function itemValue(p,id){
  const ni=p.items.length;
  switch(id){
    case 1:return 4; case 2:return 5; case 3:return 6; case 4:return 7; case 5:return 8;
    case 6:return 2*ni; case 7:return 5;
    case 8:return 3*godCount(p,'POS'); case 9:return 3*godCount(p,'HER');
    case 10:return 3*godCount(p,'ATH'); case 11:return 3*godCount(p,'APO');
    case 12:return 3; case 13:return 2*gloryOf(p); case 14:return 3*ni;
    case 15:return 0; case 16:return 10;
  }
  return 0;
}
function score(p){
  let trials=0; const detail=[];
  for(let k=0;k<9;k++){ const t=p.cells[k]; if(t && t!=='H' && p.done[k]){ const v=trialValue(p,t); trials+=v; detail.push([t,v]); } }
  const hero=(p.troy?(p.flipped?3:1):2)*heroSyms(p);
  const gl=gloryOf(p), glory=(p.flipped?GLORY_TROY:GLORY_TABLE)[Math.min(gl,5)];
  let items=0; p.items.forEach(id => items+=itemValue(p,id));
  return {trials, hero, glory, gloryCount:gl, items, total:trials+hero+glory+items, detail};
}

// ---------- Actions ----------
function canAct(G){ return G.phase!=='end'; }
function muses(G,row){
  const p=P(G); if(G.phase!=='A') return false;
  const free=power(p,'luck') && !p.usedFree;
  if(!free && p.gold<1) return false;
  if(free){ p.usedFree=true; p.freeRows=p.freeRows||{trials:0,skills:0,items:0}; p.freeRows[row==='trials'?'trials':row==='items'?'items':'skills']++; } else { p.gold--; p.muses++; }
  if(row==='trials'){ G.trialRow.forEach(t=>{ if(t) G.trialDeck.push(t); }); G.trialRow=[]; for(let i=0;i<4;i++) G.trialRow.push(G.trialDeck.shift()||null); }
  else if(row==='skill0'||row==='skill1'){ const r=+row[5]; G.skillGrid[r].forEach(c=>{ if(c) G.skillDeck.push(c); }); for(let c=0;c<5;c++) G.skillGrid[r][c]=G.skillDeck.shift()||null; }
  else if(row==='items'){ G.itemRow.forEach(i=>{ if(i) G.itemPile.push(i); }); G.itemRow=[]; for(let i=0;i<4;i++) G.itemRow.push(G.itemPile.shift()||null); }
  ev(G,'muses',{p:G.cur,row,free});
  G.sel=null;
  return true;
}
function eligibleSkills(G){
  const out=[];
  if(G.phase==='skill'){
    const any=power(P(G),'wisdom') && P(G).gold>=1;
    for(let c=0;c<5;c++) if(any || G.pend.cols.includes(c)) for(let r=0;r<2;r++) if(G.skillGrid[r][c]) out.push([r,c]);
  }
  else if(G.phase==='torch'){ for(let r=0;r<2;r++) for(let c=0;c<5;c++) if(G.skillGrid[r][c]) out.push([r,c]); }
  return out;
}
function placeTrial(G,slot,cell){
  const p=P(G), tid=G.trialRow[slot];
  if(G.phase!=='A' || !tid || p.cells[cell]!=null || cell===4) return false;
  const t=TR[tid];
  p.cells[cell]=tid;
  G.trialRow[slot]=G.trialDeck.shift()||null;
  G.sel=null;
  if(t.b.g) p.gold+=t.b.g;
  ev(G,'face',{p:G.cur,t:tid,g:t.b.g});
  G.pend={skills:t.b.s, cols:[slot,slot+1], took:0};
  G.phase='skill';
  if(!skillStepPossible(G)) finishSkillStep(G);
  return true;
}
function skillStepPossible(G){
  const p=P(G);
  return G.pend.skills>0 && eligibleSkills(G).length>0 && availableEdges(p).length>0;
}
function takeSkill(G,r,c,edge){
  const p=P(G);
  if(G.phase!=='skill' && G.phase!=='torch') return false;
  if(!eligibleSkills(G).some(([a,b])=>a===r&&b===c)) return false;
  if(!availableEdges(p).includes(edge)) return false;
  const paid = G.phase==='skill' && !G.pend.cols.includes(c);
  if(paid){ p.gold--; p.menelas++; }
  const card=G.skillGrid[r][c]; G.skillGrid[r][c]=null;
  p.edges[edge]=card;
  const s=SKILLS[card.t];
  if(s.gold) p.gold++;
  ev(G,'take',{p:G.cur,s:card.t,paid});
  if(G.phase==='torch'){ refillCheck(G); G.phase='flow'; continueFlow(G); return true; }
  G.pend.skills--; G.pend.took++;
  if(!skillStepPossible(G)) finishSkillStep(G);
  return true;
}
function finishSkillStep(G){ refillCheck(G); G.pend=null; G.phase='flow'; continueFlow(G); }
function refillCheck(G){
  let empty=0;
  for(let c=0;c<5;c++) if(!G.skillGrid[0][c] && !G.skillGrid[1][c]) empty++;
  if(empty>=2){
    for(let r=0;r<2;r++) for(let c=0;c<5;c++) if(!G.skillGrid[r][c]) G.skillGrid[r][c]=G.skillDeck.shift()||null;
    P(G).gold++;
    ev(G,'refill',{p:G.cur});
  }
}
function continueFlow(G){
  const p=P(G);
  for(let k=0;k<9;k++){
    if(k===4 || p.cells[k]==null || p.done[k]) continue;
    if(isComplete(p,k)){ p.done[k]=true; ev(G,'done',{p:G.cur,t:p.cells[k]}); }
  }
  if(p.troy && !p.flipped && troyDone(p)>=2){ p.flipped=true; ev(G,'flip',{p:G.cur}); }
  const sets=zeusSets(p);
  if(sets>p.zeus){
    if(G.itemRow.some(Boolean)){ G.phase='zeus'; ev(G,'zeus',{p:G.cur}); return; }
    p.zeus=sets;
  }
  if(p.pendingTorch){
    p.pendingTorch=false;
    G.phase='torch';
    if(eligibleSkills(G).length && availableEdges(p).length) return;
  }
  if(G.bought){ endTurn(G); return; }
  G.phase='C';
}
function acquire(G,slot,free){
  const p=P(G), id=G.itemRow[slot];
  if(!id) return false;
  if(!free){ const c=itemCost(p,id); if(p.gold<c) return false; p.gold-=c; }
  p.items.push(id);
  G.itemRow[slot]=G.itemPile.shift()||null;
  if(id===12) p.pendingTorch=true;
  if(free) p.freeItems.push(id);
  ev(G,'item',{p:G.cur,i:id,free:!!free,cost:free?0:itemCost(p,id)});
  return true;
}
function zeusPick(G,slot){
  if(G.phase!=='zeus') return false;
  if(!acquire(G,slot,true)) return false;
  P(G).zeus++; G.phase='flow'; continueFlow(G); return true;
}
function buy(G,slot){
  if(G.phase!=='C') return false;
  if(!acquire(G,slot,false)) return false;
  G.bought=true; G.phase='flow'; continueFlow(G); return true;
}
function canJoker(G){ const p=P(G); return power(p,'cunning') && !p.usedJoker && p.gold>=1 && (G.phase==='A'||G.phase==='C'); }
function jokerTargets(G){ const p=P(G); if(!canJoker(G)) return []; const out=[]; for(let k=0;k<9;k++) if(k!==4 && p.cells[k]!=null && !p.done[k]) out.push(k); return out; }
function joker(G,k){
  const p=P(G); if(!jokerTargets(G).includes(k)) return false;
  p.gold--; p.usedJoker=true; p.jokers[k]=(p.jokers[k]||0)+1;
  ev(G,'joker',{p:G.cur,t:p.cells[k]});
  if(G.phase==='C'){ G.phase='flow'; continueFlow(G); }
  else if(isComplete(p,k)){ p.done[k]=true; ev(G,'done',{p:G.cur,t:p.cells[k]}); if(p.troy&&!p.flipped&&troyDone(p)>=2){ p.flipped=true; ev(G,'flip',{p:G.cur}); } }
  return true;
}
function aiJoker(G){
  const p=P(G); let best=null, bv=1.5;
  for(const k of jokerTargets(G)){ if(missingFor(p,k)!==1) continue; const v=trialValue(p,p.cells[k])+(p.turns>=6?2:0); if(v>bv){ bv=v; best=k; } }
  return best;
}
function pass(G){ if(G.phase!=='C') return false; endTurn(G); return true; }
function endTurn(G){
  const p=P(G); p.turns++; G.bought=false; G.pend=null; G.sel=null;
  if(G.players.every(q=>q.turns>=TURNS)){ G.phase='end'; ev(G,'end'); return; }
  G.cur=(G.cur+1)%G.players.length; G.phase='A';
  const q=P(G); q.usedJoker=false; q.usedFree=false;
}
function ranking(G){
  return G.players.map((p,i)=>({i, p, s:score(p)})).sort((a,b)=> b.s.total-a.s.total || b.p.gold-a.p.gold);
}

// ---------- IA ----------
function clone(G){
  return Object.assign({},G,{trialDeck:G.trialDeck.slice(), trialRow:G.trialRow.slice(), skillDeck:G.skillDeck.slice(),
    skillGrid:[G.skillGrid[0].slice(),G.skillGrid[1].slice()], itemPile:G.itemPile.slice(), itemRow:G.itemRow.slice(),
    pend:G.pend?{skills:G.pend.skills,cols:G.pend.cols.slice(),took:G.pend.took}:null, events:[], sel:null,
    players:G.players.map(p=>Object.assign({},p,{cells:p.cells.slice(),done:p.done.slice(),edges:Object.assign({},p.edges),items:p.items.slice(),freeItems:p.freeItems.slice(),jokers:Object.assign({},p.jokers),freeRows:p.freeRows?Object.assign({},p.freeRows):undefined}))});
}
function evalPlayer(G,pi){
  const p=G.players[pi], s=score(p);
  const free=freeCells(p).length;
  let v=s.total;
  const uly=power(p,'cunning'); let jkLeft=Math.max(0,TURNS-p.turns-(p.usedJoker?1:0));
  for(let k=0;k<9;k++){
    if(k===4 || p.cells[k]==null || p.done[k]) continue;
    let m=missingFor(p,k);
    if(uly){ if(m===1 && jkLeft>0 && p.gold>=1){ m=0.2; jkLeft--; } v+=0.25*Math.max(0,TR[p.cells[k]].r.length-3); }
    const slots=trialEdges(k).filter(e=>!p.edges[e]).length;
    const cap=Math.min(slots*1.6, free*1.1+0.6);
    if(m<=cap){
      let tv=trialValue(p,p.cells[k]);
      v+=tv*0.7*(1-m/(cap+1));
    }
  }
  if(p.troy && !p.flipped){
    let prog=troyDone(p);
    for(let k=0;k<9;k++){ const t=p.cells[k]; if(t && TR[t] && TR[t].troy && !p.done[k]) prog+=Math.max(0,0.6-0.2*missingFor(p,k)); }
    const gl=Math.min(gloryOf(p),5), gain=2*heroSyms(p)+(GLORY_TROY[gl]-GLORY_TABLE[gl])+6;
    v+=gain*Math.min(1,prog/2)*0.6;
  }
  if(power(p,'endurance')) Object.values(p.edges).forEach(c=>{ if(SKILLS[c.t].glory) v+=0.4; });
  // potentiel des bords encore libres pour le Héros/la Gloire
  v+=availableEdges(p).length*0.4;
  v+=p.gold*(free>0?0.7:0.05);
  return v;
}
// Valeur qu'une carte Compétence aurait pour les adversaires (contre-draft)
function denyValue(G,pi,card){
  const s=SKILLS[card.t]; let best=0;
  G.players.forEach((q,qi)=>{ if(qi===pi) return;
    for(let k=0;k<9;k++){
      if(k===4||q.cells[k]==null||q.done[k]) continue;
      if(!trialEdges(k).some(e=>!q.edges[e])) continue;
      const m=missingFor(q,k); if(m<=0||m>2) continue;
      const need={}; TR[q.cells[k]].r.forEach(x=>need[x]=(need[x]||0)+1);
      const have=symCounts(q,k); let help=0;
      s.syms.forEach(x=>{ if((need[x]||0)>have[x]){ help++; have[x]++; } });
      if(power(q,'endurance')&&s.glory) help=Math.max(help,s.syms.length);
      if(help) best=Math.max(best, trialValue(q,q.cells[k])*Math.min(1,help/m)*(m===help?1:0.5));
    }
    if(power(q,'endurance')&&s.glory) best=Math.max(best,3);
  });
  return best;
}
function aiBestSkill(G){
  const p=P(G), pi=G.cur;
  let best=null, bv=-1e9;
  for(const [r,c] of eligibleSkills(G)) for(const e of availableEdges(p)){
    const g=clone(G); const q=g.players[pi];
    const card=g.skillGrid[r][c]; g.skillGrid[r][c]=null; q.edges[e]=card;
    if(SKILLS[card.t].gold) q.gold++;
    const paid = G.phase==='skill' && !G.pend.cols.includes(c);
    if(paid) q.gold--;
    let emptyCols=0; for(let x=0;x<5;x++) if(!g.skillGrid[0][x]&&!g.skillGrid[1][x]) emptyCols++;
    let before=0; for(let x=0;x<5;x++) if(!G.skillGrid[0][x]&&!G.skillGrid[1][x]) before++;
    if(emptyCols>=2 && before<2) q.gold++;
    for(let k=0;k<9;k++) if(k!==4 && q.cells[k]!=null && !q.done[k] && isComplete(q,k)) q.done[k]=true;
    let v=evalPlayer(g,pi)+Math.random()*0.01;
    if(power(p,'wisdom')) v+=(paid?0.2:0.1)*denyValue(G,pi,card)-(paid?1.2:0);
    if(v>bv){ bv=v; best={r,c,e}; }
  }
  return {move:best, v:bv};
}
function simulateRest(g){
  let guard=0;
  while((g.phase==='skill'||g.phase==='torch') && guard++<10){
    const m=aiBestSkill(g).move; if(!m) break; takeSkill(g,m.r,m.c,m.e);
  }
  if(g.phase==='zeus'){ const z=aiBestItem(g,true); if(z!=null) zeusPick(g,z); }
}
function aiBestTrial(G){
  const p=P(G), pi=G.cur;
  let best=null, bv=-1e9;
  G.trialRow.forEach((tid,slot)=>{ if(!tid) return;
    freeCells(p).forEach(cell=>{
      const g=clone(G); placeTrial(g,slot,cell); simulateRest(g);
      const v=evalPlayer(g,pi)+Math.random()*0.01;
      if(v>bv){ bv=v; best={slot,cell}; }
    });
  });
  return {move:best, v:bv};
}
function aiBestItem(G,free){
  const p=P(G), pi=G.cur;
  const base=evalPlayer(G,pi);
  let best=null, bv=free?-1e9:(power(p,'strength')?0.2:0.8);
  G.itemRow.forEach((id,slot)=>{ if(!id) return; if(!free && p.gold<itemCost(p,id)) return;
    const g=clone(G); acquire(g,slot,free);
    const q=g.players[pi];
    let v=evalPlayer(g,pi)-base;
    if(id===12) v+=2.5;
    if(v>bv){ bv=v; best=slot; }
  });
  return best;
}
function aiMuses(G){
  const p=P(G), pi=G.cur;
  if(power(p,'luck') && !p.usedFree){
    const base=aiBestTrial(G).v;
    let best=null, bv=0.4;
    const itemGain=g=>{ const q=P(g), b0=evalPlayer(g,g.cur); let m=0;
      g.itemRow.forEach((id,slot)=>{ if(!id||q.gold<itemCost(q,id)) return; const h=clone(g); acquire(h,slot,false); m=Math.max(m,evalPlayer(h,h.cur)-b0); }); return m; };
    const rows=['skill0','skill1','trials']; if(p.gold>=2 && G.itemPile.length) rows.push('items');
    for(const row of rows){
      let tot=0; const N=2;
      for(let s=0;s<N;s++){
        const g=clone(G); shuffle(g.skillDeck); shuffle(g.trialDeck);
        if(row==='items'){ shuffle(g.itemPile); muses(g,row); tot+=itemGain(g); continue; }
        muses(g,row); tot+=aiBestTrial(g).v;
      }
      let gain=row==='items'? tot/N-itemGain(G)-0.5 : tot/N-base;
      if(row==='skill0'||row==='skill1'){
        const r=+row[5]; let deny=0;
        G.skillGrid[r].forEach(c=>{ if(c) deny=Math.max(deny,denyValue(G,pi,c)); });
        gain+=0.3*deny+0.5;
      } else if(row==='trials') gain-=0.8;
      if(gain>bv){ bv=gain; best=row; }
    }
    return best;
  }
  if(p.gold<3 || freeCells(p).length<2) return null;
  const base=evalPlayer(G,pi);
  const cur=aiBestTrial(G).v;
  if(cur-base<2.5) return 'trials';
  return null;
}


// ---------- Simulation & statistiques ----------
function playAI(G){
  let guard=0;
  while(G.phase!=='end' && guard++<3000){
    if(G.phase==='A'){ const m=aiMuses(G); if(m) muses(G,m); const t=aiBestTrial(G).move; placeTrial(G,t.slot,t.cell); }
    else if(G.phase==='C' && aiJoker(G)!=null){ joker(G,aiJoker(G)); }
    else if(G.phase==='skill'||G.phase==='torch'){ const m=aiBestSkill(G).move; if(!m){ G.phase='flow'; continueFlow(G); } else takeSkill(G,m.r,m.c,m.e); }
    else if(G.phase==='zeus'){ zeusPick(G,aiBestItem(G,true)); }
    else if(G.phase==='C'){ const b=aiBestItem(G,false); if(b!=null) buy(G,b); else pass(G); }
    G.events.length=0;
  }
  return G;
}
function summarize(G){
  const n=G.players.length;
  const rk=ranking(G);
  const winners=rk.filter(x=>x.s.total===rk[0].s.total && x.p.gold===rk[0].p.gold).map(x=>x.i);
  return {n, troy:G.troy?1:0, players:G.players.map((p,i)=>{
    const s=score(p);
    return {seat:(i-G.first+n)%n, hero:(p.troy?'troy_':'')+p.hero, flipped:p.flipped?1:0, menelas:p.menelas||0, jokers:Object.values(p.jokers||{}).reduce((a,b)=>a+b,0), win:winners.includes(i)?1/winners.length:0, rank:rk.findIndex(x=>x.i===i)+1,
      total:s.total, trials:s.trials, heroPts:s.hero, glory:s.glory, gloryCount:s.gloryCount, itemsPts:s.items, gold:p.gold,
      zeus:p.zeus, muses:p.muses, done:p.done.filter(Boolean).length,
      cards:p.cells.map((t,k)=>t&&t!=='H'?{t, d:p.done[k], v:p.done[k]?trialValue(p,t):0}:null).filter(Boolean),
      items:p.items.map(id=>({id, v:itemValue(p,id), free:p.freeItems.includes(id)})),
      gods:GOD_KEYS.concat(p.troy?['TROY']:[]).map(g=>godCount(p,g,true))};
  })};
}
function simulate(nPlayers,troy){ const G=newGame({troy,players:Array.from({length:nPlayers},(_,i)=>({name:'IA'+(i+1),ai:true}))}); playAI(G); return summarize(G); }
function newAgg(){
  const A={games:0, byN:{}, seats:{}, heroes:{}, hist:{}, doneHist:{}, players:0, sum:{total:0,trials:0,heroPts:0,glory:0,itemsPts:0,gold:0,zeus:0,muses:0,done:0}, winSum:0, marginSum:0, trials:{}, items:{}, gods:{}};
  TRIALS.concat(TROY_TRIALS).forEach(t=>A.trials[t.id]={taken:0,done:0,vp:0,winTaken:0,winDone:0,expDone:0});
  Object.keys(ITEMS).forEach(id=>A.items[id]={own:0,free:0,vp:0,win:0,exp:0});
  GOD_KEYS.concat(['TROY']).forEach(g=>A.gods[g]={done:0});
  HEROES.forEach(h=>{ A.heroes[h.k]={n:0,win:0,total:0}; A.heroes['troy_'+h.k]={n:0,win:0,total:0,flipped:0}; });
  A.troyPlayers=0; A.troyGames=0;
  return A;
}
function addAgg(A,R){
  A.games++; const n=R.n; if(R.troy) A.troyGames=(A.troyGames||0)+1;
  const bn=A.byN[n]||(A.byN[n]={games:0,total:0,winTotal:0}); bn.games++;
  const sorted=R.players.map(p=>p.total).sort((a,b)=>b-a);
  A.winSum+=sorted[0]; A.marginSum+=sorted[0]-sorted[1]; bn.winTotal+=sorted[0];
  R.players.forEach(p=>{
    A.players++; bn.total+=p.total;
    for(const k in A.sum) A.sum[k]+=p[k];
    const sk=n+':'+p.seat; const se=A.seats[sk]||(A.seats[sk]={n:0,win:0,total:0}); se.n++; se.win+=p.win; se.total+=p.total;
    const h=A.heroes[p.hero]; h.n++; h.win+=p.win; h.total+=p.total; if(p.flipped) h.flipped=(h.flipped||0)+1;
    const b=Math.floor(p.total/10)*10; A.hist[b]=(A.hist[b]||0)+1;
    A.doneHist[p.done]=(A.doneHist[p.done]||0)+1;
    p.cards.forEach(c=>{ const t=A.trials[c.t]; t.taken++; t.winTaken+=p.win; if(c.d){ t.done++; t.vp+=c.v; t.winDone+=p.win; t.expDone+=1/n; } });
    p.items.forEach(it=>{ const x=A.items[it.id]; x.own++; x.vp+=it.v; x.win+=p.win; x.exp+=1/n; if(it.free) x.free++; });
    GOD_KEYS.concat(['TROY']).forEach((g,i)=>{ if(p.gods[i]!=null) A.gods[g].done+=p.gods[i]; });
    if(p.gods.length>4) A.troyPlayers=(A.troyPlayers||0)+1;
  });
  return A;
}

function mergeAgg(A,B){
  const m=(a,b)=>{ for(const k in b){ const v=b[k]; if(typeof v==='number') a[k]=(a[k]||0)+v; else if(v&&typeof v==='object'){ if(!a[k]||typeof a[k]!=='object') a[k]={}; m(a[k],v); } } return a; };
  return m(A,B);
}
const API={denyValue,TROY_TRIALS,GLORY_TROY,power,itemCost,troyDone,canJoker,jokerTargets,joker,aiJoker,mergeAgg,playAI,summarize,simulate,newAgg,addAgg,TRIALS,TR,SYM,GODS,GOD_KEYS,SKILLS,ITEMS,HEROES,EDGES,TURNS,GLORY_TABLE,
  newGame,P,freeCells,availableEdges,symCounts,missingFor,isComplete,godCount,zeusSets,gloryOf,heroSyms,trialValue,itemValue,score,
  muses,eligibleSkills,placeTrial,takeSkill,zeusPick,buy,pass,ranking,edgeCell,trialEdges,cellEdges,
  aiBestSkill,aiBestTrial,aiBestItem,aiMuses,evalPlayer};
if(typeof module!=='undefined') module.exports=API; else root.CH=API;
})(this);
