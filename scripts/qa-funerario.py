"""Mandatory memorial acceptance checks; same DOM scenarios as the local review."""
from pathlib import Path
import json
import hashlib
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
scenarios=(root/'scripts/funerario-scenarios.js').read_text()
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for width,height in [(390,844),(768,1024),(1440,1000)]:
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=width==390,reduced_motion='reduce',accept_downloads=True)
        page=context.new_page();errors=[];external=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http://','https://')) else None)
        page.goto((root/'_site/funerario.html').as_uri()+'#personalizar')
        page.wait_for_selector('#memorial-workbench[data-ready="true"]')
        page.locator('img').evaluate_all('(els)=>els.forEach(e=>e.loading="eager")')
        page.wait_for_function('()=>[...document.images].every(e=>e.complete&&e.naturalWidth>0)')
        page.locator('.memorial-controls details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
        result=page.evaluate(scenarios)
        page.locator('#memorial-stone').focus();page.keyboard.press('ArrowDown');page.keyboard.press('Enter')
        assert page.locator('#memorial-stone').evaluate('(el)=>el===document.activeElement')
        page.locator('#memorial-reset').click()
        with page.expect_download() as pending:page.locator('#memorial-download').click()
        download=pending.value
        assert download.suggested_filename=='LITOS-simulacion-orientativa.png' and download.failure() is None
        base_png=Path(download.path()).read_bytes()
        assert base_png[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(base_png[16:20],'big')==2000
        # Rejected religious drawings remain internal prototypes, not public choices.
        assert page.locator('#memorial-gallery-category option[value="religiosas"]').count()==0
        assert page.locator('#memorial-devotional option').count()==1
        assert page.locator('#memorial-devotional').is_disabled()
        page.locator('#memorial-gallery-category').select_option('cruces')
        for candidate in ('santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'):
            assert page.locator('#memorial-symbol option[value="'+candidate+'"]').count()==0
            assert page.locator('.memorial-motif[data-item-id="'+candidate+'"]').count()==0
        assert page.locator('[data-slot="devotional"]').count()==0
        page.locator('#memorial-layout').select_option('devocionlateral')
        page.locator('#memorial-secondary').select_option('rosaabierta')
        page.wait_for_selector('[data-slot="secondary"]')
        assert page.locator('[data-slot="secondary"]').count()==1
        assert page.locator('[data-slot="devotional"]').count()==0
        with page.expect_download() as pending:page.locator('#memorial-download').click()
        layered_png=Path(pending.value.path()).read_bytes()
        assert layered_png[:8]==b'\x89PNG\r\n\x1a\n' and hashlib.sha256(layered_png).digest()!=hashlib.sha256(base_png).digest()
        assert not errors and not external,(errors,external)
        results.append({'viewport':width,**result,'external_requests':len(external),'javascript_errors':len(errors),'png_download':'OK','layered_png':'OK'})
        context.close()
    # Self-contained file must work without assets, HTTP, cookies or storage.
    page=browser.new_page(viewport={'width':390,'height':844})
    network=[];page.on('request',lambda r:network.append(r.url) if not r.url.startswith(('data:','blob:','file:')) else None)
    page.goto((root/'preview/LITOS_CONFIGURADOR_FUNERARIO.html').as_uri())
    page.wait_for_selector('#memorial-workbench[data-ready="true"]')
    assert not network and page.locator('#memorial-stone option').count()==7
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'standalone preview overflows on mobile'
    browser.close()
print(json.dumps({'status':'PASS','checks':results,'standalone':'PASS'},ensure_ascii=False,indent=2))
