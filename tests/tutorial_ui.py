import asyncio
from playwright.async_api import async_playwright
STEP=open(__import__('os').path.join(__import__('os').path.dirname(__file__),'tutorial_flow.py')).read().split('STEP="""')[1].split('"""')[0]
async def run(p,vw,vh):
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':vw,'height':vh})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8766/index.html'); await pg.wait_for_timeout(500)
    await pg.evaluate("aiSpeed=5"); await pg.click('#tutBtn'); await pg.wait_for_timeout(400)
    res={}
    async def check():
        await pg.wait_for_timeout(450)
        c=await pg.evaluate("TUT.cur")
        if c and c not in res:
            res[c]=await pg.evaluate("(()=>{const b=document.getElementById('tutbox').getBoundingClientRect();const z=document.getElementById('zoom');return {ov:+document.getElementById('tutbox').dataset.overlap, n:document.querySelectorAll('.tut-hl').length, vis:[...document.querySelectorAll('.tut-hl')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).length, inview:b.top>=0&&b.bottom<=innerHeight+1&&b.left>=0&&b.right<=innerWidth+1}})()")
            await pg.screenshot(path=f'/home/claude/ov_{vw}_{c}.png')
        return c
    for i in range(900):
        c=await check()
        if c=='end': break
        if c in ('intro','hero','done','ai','glory','refill','mid') and await pg.query_selector('#tutbox [data-tut=ok]'):
            await pg.click('#tutbox [data-tut=ok]'); continue
        if c=='A0':
            m=await pg.evaluate("C.aiBestTrial(G).move"); await pg.click(f'[data-trial="{m["slot"]}"]'); await check(); await pg.click(f'[data-cell="{m["cell"]}"]'); continue
        if c=='skill':
            m=await pg.evaluate("C.aiBestSkill(G).move"); await pg.click(f'[data-skill="{m["r"]},{m["c"]}"]'); await check(); await pg.click(f'[data-edge="{m["e"]}"]'); continue
        st=await pg.evaluate(STEP)
        if st=='end': await check(); break
    await b.close()
    return res,errs
async def main():
    async with async_playwright() as p:
        for vw,vh in ((1440,900),(1280,720),(1024,768),(390,844)):
            r,e=await run(p,vw,vh)
            bad={k:v for k,v in r.items() if v['ov']>0 or not v['inview'] or (v['n'] and not v['vis'])}
            print(vw,'x',vh,'étapes',len(r),'problèmes',bad or 'aucun','erreurs',e[:2])
asyncio.run(main())
