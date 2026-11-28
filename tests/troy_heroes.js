const C=require(__dirname+'/../engine.js');
const st={};
for(let i=0;i<400;i++){
  const G=C.newGame({troy:true,players:[0,1,2].map(j=>({name:'IA'+j,ai:true}))}); C.playAI(G);
  const rk=C.ranking(G);
  G.players.forEach((p,pi)=>{
    const s=st[p.hero]||(st[p.hero]={n:0,win:0,tot:0,glory:0,big:0,jk:0,men:0,fr:{trials:0,skills:0,items:0},items:0,flip:0});
    s.n++; s.tot+=C.score(p).total; if(rk[0].i===pi) s.win++;
    s.glory+=Object.values(p.edges).filter(c=>C.SKILLS[c.t].glory).length;
    s.big+=p.cells.filter(t=>t&&t!=='H'&&C.TR[t].r.length>=4).length;
    s.jk+=Object.values(p.jokers).reduce((a,b)=>a+b,0); s.men+=p.menelas||0; s.items+=p.items.length; s.flip+=p.flipped?1:0;
    if(p.freeRows) for(const k in p.freeRows) s.fr[k]+=p.freeRows[k];
  });
}
const f=x=>x.toFixed(1);
for(const [k,s] of Object.entries(st)) console.log(k.padEnd(10),'win',(s.win/s.n*100).toFixed(0)+'%','PV',f(s.tot/s.n),'Gloire',f(s.glory/s.n),'Épr4+',f(s.big/s.n),'jokers',f(s.jk/s.n),'Ménélas',f(s.men/s.n),'refill comp/épr',f(s.fr.skills/s.n)+'/'+f(s.fr.trials/s.n),'objets',f(s.items/s.n),'retourné',(s.flip/s.n*100).toFixed(0)+'%');
