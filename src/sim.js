// Simulation hors navigateur : node src/sim.js [parties] [joueurs|mix]
const C=require('../engine.js');
const games=+(process.argv[2]||200), arg=process.argv[3]||'3';
const A=C.newAgg(), t0=Date.now();
for(let i=0;i<games;i++) C.addAgg(A,C.simulate(arg==='mix'?2+Math.floor(Math.random()*4):+arg));
const P=A.players, f=x=>x.toFixed(1);
console.log(`${A.games} parties en ${((Date.now()-t0)/1000).toFixed(1)} s`);
console.log(`Score moyen ${f(A.sum.total/P)} · vainqueur ${f(A.winSum/A.games)} · écart 1er-2e ${f(A.marginSum/A.games)}`);
console.log(`Points : Épreuves ${f(A.sum.trials/P)} · Héros ${f(A.sum.heroPts/P)} · Gloire ${f(A.sum.glory/P)} · Objets ${f(A.sum.itemsPts/P)}`);
console.log('Places :',Object.entries(A.seats).map(([k,x])=>`${k} ${(x.win/x.n*100).toFixed(0)}%`).join(' · '));
console.log('Héros :',Object.entries(A.heroes).map(([k,x])=>`${k} ${(x.win/x.n*100).toFixed(0)}% (${f(x.total/x.n)})`).join(' · '));
