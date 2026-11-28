import asyncio
from playwright.async_api import async_playwright
STEP="""()=>{ if(!G) return 'none'; if(G.phase==='end') return 'end'; if(!humanTurn()) return 'wait';
  const ph=G.phase;
  if(ph==='A'){ const m=C.aiBestTrial(G).move; document.querySelector(`[data-trial="${m.slot}"]`).click(); document.querySelector(`[data-cell="${m.cell}"]`).click(); return 'A'; }
  if(ph==='skill'||ph==='torch'){ const m=C.aiBestSkill(G).move; document.querySelector(`[data-skill="${m.r},${m.c}"]`).click(); document.querySelector(`[data-edge="${m.e}"]`).click(); return ph; }
  if(ph==='zeus'){ document.querySelector(`[data-item="${C.aiBestItem(G,true)}"]`).click(); return ph; }
  if(ph==='C'){ const b=C.aiBestItem(G,false); if(b!=null) document.querySelector(`[data-item="${b}"]`).click(); else document.querySelector('[data-act=pass]').click(); return ph; }
  return ph; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1300,'height':900})
        A=await ctx.new_page(); B=await ctx.new_page(); errs=[]
        for pg,n in ((A,'A'),(B,'B')):
            pg.on('pageerror',lambda e,n=n:errs.append(n+':'+str(e)))
        await A.goto('http://localhost:8766/index.html?mptest=1'); await A.wait_for_timeout(500)
        await A.screenshot(path='/home/claude/mp_home.png')
        await A.click('#online'); await A.fill('#mpn','Hôte'); await A.click('[data-mp=host]'); await A.wait_for_timeout(300)
        code=await A.evaluate('MP.code'); print('code',code)
        await A.evaluate("aiSpeed=5")
        await B.goto('http://localhost:8766/index.html?mptest=1#join-'+code); await B.wait_for_timeout(500)
        await B.fill('#mpn','Invité'); await B.click('[data-mp=join]'); await B.wait_for_timeout(600)
        await A.click('[data-mp=addai]'); await A.wait_for_timeout(200)
        await A.screenshot(path='/home/claude/mp_lobby.png'); await B.screenshot(path='/home/claude/mp_lobbyB.png')
        await A.click('[data-mp=start]'); await A.wait_for_timeout(800)
        st=None
        for i in range(600):
            a=await A.evaluate(STEP); bb=await B.evaluate(STEP)
            if a=='end' and bb=='end': break
            if i==20: await B.screenshot(path='/home/claude/mp_gameB.png')
            await A.wait_for_timeout(60)
        await A.wait_for_timeout(1500)
        res=await A.evaluate("G.players.map(p=>p.name+':'+C.score(p).total+':'+p.turns)")
        resB=await B.evaluate("G?G.players.map(p=>p.name+':'+C.score(p).total+':'+p.turns):'none'")
        print(a,bb,res,resB, 'seatB',await B.evaluate('MP.seat'))
        await B.screenshot(path='/home/claude/mp_endB.png')
        print('errors',errs[:5]); await b.close()
asyncio.run(main())
