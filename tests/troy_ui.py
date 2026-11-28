import asyncio
from playwright.async_api import async_playwright
STEP="""()=>{ if(!G) return 'none'; if(G.phase==='end') return 'end'; if(!humanTurn()) return 'wait';
  const ph=G.phase;
  if((ph==='A'||ph==='C') && C.canJoker(G) && C.aiJoker(G)!=null){ document.querySelector('[data-act=joker]').click(); document.querySelector(`[data-jk="${C.aiJoker(G)}"]`).click(); return 'joker'; }
  if(ph==='A'){ const mu=C.aiMuses(G); if(mu) document.querySelector(`[data-muse="${mu}"]`).click(); const m=C.aiBestTrial(G).move; document.querySelector(`[data-trial="${m.slot}"]`).click(); document.querySelector(`[data-cell="${m.cell}"]`).click(); return 'A'; }
  if(ph==='skill'||ph==='torch'){ const m=C.aiBestSkill(G).move; document.querySelector(`[data-skill="${m.r},${m.c}"]`).click(); document.querySelector(`[data-edge="${m.e}"]`).click(); return ph; }
  if(ph==='zeus'){ document.querySelector(`[data-item="${C.aiBestItem(G,true)}"]`).click(); return ph; }
  if(ph==='C'){ const b=C.aiBestItem(G,false); if(b!=null) document.querySelector(`[data-item="${b}"]`).click(); else document.querySelector('[data-act=pass]').click(); return ph; }
  return ph; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1440,'height':950})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/index.html'); await pg.wait_for_timeout(600)
        await pg.screenshot(path='/home/claude/tr_home.png')
        stats={}
        for hero in ['cunning','wisdom','luck','strength','endurance']:
            await pg.evaluate("aiSpeed=3; troyOn=true; setup=[{name:'Moi',ai:false},{name:'Ariane',ai:true},{name:'Jason',ai:true}]")
            await pg.evaluate(f"""()=>{{ const orig=C.newGame; C.newGame=cfg=>{{ const g=orig(cfg); const p=g.players[0], o=g.players.find(x=>x.hero==='{hero}'); if(o){{ o.hero=p.hero; o.sym=p.sym; }} p.hero='{hero}'; p.sym=C.HEROES.find(h=>h.k==='{hero}').sym; C.newGame=orig; return g; }}; }}""")
            await pg.click('#start'); await pg.wait_for_timeout(300)
            cnt={}
            for i in range(800):
                st=await pg.evaluate(STEP); cnt[st]=cnt.get(st,0)+1
                if st=='end': break
                if hero=='cunning' and i==40: await pg.screenshot(path='/home/claude/tr_game.png')
                await pg.wait_for_timeout(25)
            r=await pg.evaluate("[G.players[0].hero, G.players[0].flipped, C.score(G.players[0]).total, G.players[0].menelas, Object.keys(G.players[0].jokers).length, G.players.map(p=>p.turns).join()]")
            stats[hero]=(r,cnt.get('joker',0))
            await pg.wait_for_timeout(700)
            if hero=='endurance': await pg.screenshot(path='/home/claude/tr_end.png')
            await pg.evaluate("hideModal(); goHome()")
        for k,v in stats.items(): print(k,v)
        await pg.click('[data-lang=it]'); await pg.click('[data-tab=stats]'); await pg.select_option('#simGames','50'); await pg.select_option('#simTroy','1')
        await pg.uncheck('#simCumul'); await pg.click('#runSim')
        for i in range(200):
            await pg.wait_for_timeout(400)
            if not await pg.evaluate("document.querySelector('#runSim').disabled"): break
        await pg.screenshot(path='/home/claude/tr_stats.png', full_page=True)
        print('errors',errs[:5]); await b.close()
asyncio.run(main())
