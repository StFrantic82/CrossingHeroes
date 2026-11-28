const C=require(process.argv[2]||__dirname+'/../engine.js');
const N=+process.argv[3]||600, troy=process.argv[4]==='1';
const A=C.newAgg(); for(let i=0;i<N;i++) C.addAgg(A,C.simulate(3,troy));
const by={};
C.TRIALS.concat(troy?C.TROY_TRIALS:[]).forEach(t=>{ const x=A.trials[t.id]; const k=t.s.t; const b=by[k]||(by[k]={done:0,win:0,exp:0,taken:0,vp:0}); b.done+=x.done; b.win+=x.winDone; b.exp+=x.expDone; b.taken+=x.taken; b.vp+=x.vp; });
for(const [k,b] of Object.entries(by)) console.log(k.padEnd(6),'Δ',((b.win-b.exp)/b.done*100).toFixed(1).padStart(5),'pt · PV moy',(b.vp/b.done).toFixed(1),'· réussite',(b.done/b.taken*100).toFixed(0)+'%');
const gl=C.TRIALS.filter(t=>t.s.t==='glory').map(t=>{const x=A.trials[t.id];return t.n+' '+((x.winDone-x.expDone)/x.done*100).toFixed(0)+'pt ('+(x.vp/x.done).toFixed(1)+' PV)';});
console.log(gl.join(' | '));
console.log('Gloire moy/joueur',(A.sum.glory/A.players).toFixed(1));
