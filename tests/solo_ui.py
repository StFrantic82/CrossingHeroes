import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1440,'height':950})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto('http://localhost:8766/index.html'); await pg.wait_for_timeout(800)
        await pg.click('[data-lang=fr]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='/home/claude/h1.png')
        await pg.click('[data-tab=stats]'); await pg.select_option('#simGames','50'); await pg.click('#runSim')
        for i in range(120):
            await pg.wait_for_timeout(500)
            if not await pg.evaluate("document.querySelector('#runSim').disabled"): break
        await pg.screenshot(path='/home/claude/st1.png', full_page=True)
        await pg.click('[data-lang=en]'); await pg.wait_for_timeout(300)
        await pg.click('[data-tab=play]')
        await pg.evaluate("aiSpeed=5"); await pg.click('#start'); await pg.wait_for_timeout(2500)
        for i in range(200):
            st=await pg.evaluate("""()=>{ if(!G) return 'none'; if(G.phase==='end') return 'end'; if(me().ai||busy) return 'wait';
              const ph=G.phase;
              if(ph==='A'){ const m=C.aiBestTrial(G).move; document.querySelector(`[data-trial="${m.slot}"]`).click(); document.querySelector(`[data-cell="${m.cell}"]`).click(); return 'A'; }
              if(ph==='skill'||ph==='torch'){ const m=C.aiBestSkill(G).move; document.querySelector(`[data-skill="${m.r},${m.c}"]`).click(); document.querySelector(`[data-edge="${m.e}"]`).click(); return ph; }
              if(ph==='zeus'){ document.querySelector(`[data-item="${C.aiBestItem(G,true)}"]`).click(); return ph; }
              if(ph==='C'){ const b=C.aiBestItem(G,false); if(b!=null) document.querySelector(`[data-item="${b}"]`).click(); else document.querySelector('[data-act=pass]').click(); return ph; }
              return ph; }""")
            if st=='end': break
            if i==16:
                el=await pg.query_selector('.tcard'); await el.hover(); await pg.wait_for_timeout(300)
                await pg.screenshot(path='/home/claude/g1.png')
            await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(1200); await pg.screenshot(path='/home/claude/g_end.png')
        await pg.click('[data-close]'); await pg.click('#quitBtn'); await pg.click('[data-tab=stats]'); await pg.wait_for_timeout(300)
        await pg.click('[data-lang=it]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path='/home/claude/st_it.png', full_page=True)
        print(st, errs[:5]); await b.close()
asyncio.run(main())
