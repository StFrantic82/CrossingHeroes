import asyncio
from playwright.async_api import async_playwright
async def run(pg):
    await pg.click('#runSim')
    for i in range(200):
        await pg.wait_for_timeout(400)
        if not await pg.evaluate("document.querySelector('#runSim').disabled"): break
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1440,'height':950})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/index.html'); await pg.wait_for_timeout(500)
        await pg.click('[data-tab=stats]'); await pg.select_option('#simGames','50')
        await run(pg); g1=await pg.evaluate('statsAgg.games')
        await run(pg); g2=await pg.evaluate('statsAgg.games')
        await pg.reload(); await pg.wait_for_timeout(500); await pg.click('[data-tab=stats]'); g3=await pg.evaluate('statsAgg&&statsAgg.games')
        await pg.uncheck('#simCumul'); await run(pg); g4=await pg.evaluate('statsAgg.games')
        print(g1,g2,g3,g4)
        el=await pg.query_selector('.tbl'); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(200)
        await pg.screenshot(path='/home/claude/cum.png')
        await pg.click('#simReset'); print('reset',await pg.evaluate('statsAgg'))
        print(errs); await b.close()
asyncio.run(main())
