importScripts('engine.js?v=9');
const C=self.CH;
onmessage=e=>{
  const {games, players, troy}=e.data; const A=C.newAgg();
  for(let i=0;i<games;i++){
    const n = players==='mix' ? 2+Math.floor(Math.random()*4) : players;
    C.addAgg(A, C.simulate(n, troy==='mix'?Math.random()<.5:!!troy));
    if(i%5===4 || i===games-1) postMessage({progress:(i+1)/games, agg:(i===games-1||i%25===24)?A:null, done:i===games-1});
  }
};
