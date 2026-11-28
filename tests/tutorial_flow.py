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
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1440,'height':950})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/index.html'); await pg.wait_for_timeout(600)
        await pg.click('[data-lang=fr]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path='/home/claude/tu_home.png')
        await pg.evaluate("aiSpeed=5"); await pg.click('#tutBtn'); await pg.wait_for_timeout(500)
        seq=[]
        async def cur(): return await pg.evaluate("TUT.cur")
        seq.append(await cur()); await pg.screenshot(path='/home/claude/tu_1.png')
        await pg.click('#tutbox [data-tut=ok]'); seq.append(await cur())
        await pg.click('#tutbox [data-tut=ok]'); seq.append(await cur()); await pg.screenshot(path='/home/claude/tu_A0.png')
        m=await pg.evaluate("C.aiBestTrial(G).move")
        await pg.click(f'[data-trial="{m["slot"]}"]'); seq.append(await cur()); await pg.screenshot(path='/home/claude/tu_A1.png')
        await pg.click(f'[data-cell="{m["cell"]}"]'); seq.append(await cur()); await pg.screenshot(path='/home/claude/tu_skill.png')
        for i in range(800):
            c=await cur()
            if c and c not in seq: seq.append(c)
            if c in ('intro','hero','done','ai','glory','refill','mid') and await pg.query_selector('#tutbox [data-tut=ok]'):
                if c=='done': await pg.screenshot(path='/home/claude/tu_done.png')
                await pg.click('#tutbox [data-tut=ok]'); continue
            st=await pg.evaluate(STEP)
            if st=='end': break
            await pg.wait_for_timeout(30)
        await pg.wait_for_timeout(1500); seq.append(await cur())
        await pg.screenshot(path='/home/claude/tu_end.png')
        print(await pg.evaluate('[...TUT.seen]'), seq, 'turns', await pg.evaluate("G.players.map(p=>p.turns)"))
        # language switch during tutorial
        await pg.evaluate("hideModal(); goHome()"); await pg.click('[data-lang=it]'); await pg.wait_for_timeout(100); print(await pg.inner_text('#tutBtn'))
        await pg.click('#tutBtn'); await pg.wait_for_timeout(300); print((await pg.inner_text('#tutbox'))[:80])
        await pg.set_viewport_size({'width':390,'height':844}); await pg.wait_for_timeout(300); await pg.screenshot(path='/home/claude/tu_mob.png')
        print('errors',errs[:5]); await b.close()
asyncio.run(main())
