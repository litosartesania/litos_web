#!/usr/bin/env python3
"""Render and test real catalog preview at three viewport widths (Playwright)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
pageurl=(root/'review-package/site/mobiliario.html').resolve().as_uri()
names=['travertino','caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi']
screenshots=root/'review-package/screenshots'
screenshots.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
    for width,height in [(390,844),(820,1180),(1440,900)]:
        page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda x:errors.append(str(x)))
        page.goto(pageurl,wait_until='domcontentloaded')
        assert page.locator('.piece-card').count()==21
        assert page.locator('form').count()==0
        assert page.locator('img[src*="catalogo/variantes"]').count()==2
        for name in names:
            page.locator('#material-picker').select_option(name)
            for pid in ['consola-esc','banco-esc']:
                im=page.locator(f'[data-product="{pid}"] .material-variant-figure img')
                assert im.count()==1,(pid,name)
                assert im.get_attribute('src')==f'assets/catalogo/variantes/{pid}__{name}.png',(pid,name)
                im.evaluate('(el)=>{el.loading="eager"}')
                im.evaluate('(el)=>el.decode()')
                assert im.evaluate('(el)=>el.naturalWidth===1122 && el.naturalHeight===1402'),(pid,name)
                assert im.evaluate('(el)=>getComputedStyle(el).filter')=='none',(pid,name)
                if width==1440:
                    card=page.locator(f'[data-product="{pid}"]')
                    card.screenshot(path=str(screenshots/f'{pid}__{name}__catalogo.png'),animations='disabled')
        assert page.locator('.concept-availability').count()==4
        assert page.locator('.material-placeholder').count()==15
        assert not errors,(width,errors)
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth+1'),width
        print('PASS responsive',width,'21 pieces; 18 stone variants load natively with no tint or script error')
        page.close()
    browser.close()
