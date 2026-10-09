#!/usr/bin/env python3
"""Playwright-based local preview with inlined assets, no localhost/network needed."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
import re

root=Path(__file__).resolve().parents[1]
site=root/'_site'
html=(site/'index.html').read_text()
css=(site/'styles.css').read_text()
js=(site/'script.js').read_text()
def to_data(ref):
    content=(site/ref).read_bytes()
    kind='image/svg+xml' if ref.endswith('.svg') else 'image/webp'
    return 'data:'+kind+';base64,'+base64.b64encode(content).decode()
css=css.replace('url("assets/limestone-texture.webp")',f'url("{to_data("assets/limestone-texture.webp")}")')
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
html=html.replace('<script src="script.js"></script>','<script>'+js+'</script>')
for ref in ['assets/favicon.svg','assets/hero-workshop.webp','assets/workshop-strip.webp','assets/concept-mesa.webp','assets/concept-lavabo.webp','assets/concept-objetos.webp']:
    html=html.replace('src="'+ref+'"','src="'+to_data(ref)+'"')
html=re.sub(r'<link rel="icon"[^>]+>','',html)
with sync_playwright() as engine:
    browser=engine.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for name,size in [('iphone',(390,844)),('ipad',(820,1180)),('desktop',(1440,900))]:
        page=browser.new_page(viewport={'width':size[0],'height':size[1]}, device_scale_factor=1, reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='load')
        # Lazy media may not load until scrolled into view.
        for image in page.locator('img').all():
            image.evaluate('(img) => {img.loading = "eager";}')
        page.wait_for_timeout(500)
        page.evaluate('window.scrollTo(0,0)')
        dims=page.evaluate('''() => ({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,loaded:[...document.images].every(x=>x.complete && x.naturalWidth>0)})''')
        assert dims['scroll'] <= dims['client']+1,(name,dims)
        assert dims['loaded'],(name,'images did not load')
        assert not errors,(name,errors)
        hero_bounds=page.evaluate('''() => {const parent=document.querySelector('.hero').getBoundingClientRect();const p=document.querySelector('.hero-copy p').getBoundingClientRect();return {heroBottom: parent.bottom, subtitleBottom: p.bottom}}''')
        assert hero_bounds['subtitleBottom'] < hero_bounds['heroBottom']-15,(name,'subtitle clipped',hero_bounds)
        if name!='desktop':
            page.locator('.menu-button').click()
            assert page.locator('.menu-button').get_attribute('aria-expanded')=='true'
            assert page.locator('main').evaluate('(x)=>x.inert')
            assert page.locator('.mobile-menu').is_visible()
            page.keyboard.press('Escape')
            assert page.locator('.menu-button').get_attribute('aria-expanded')=='false'
            assert not page.locator('main').evaluate('(x)=>x.inert')
        else:
            page.locator('input[name="nombre"]').fill('Prueba Local')
            page.locator('input[name="correo"]').fill('prueba@example.test')
            page.locator('textarea[name="mensaje"]').fill('Prueba local sin enviar')
            assert page.locator('#contact-form').evaluate('(f)=>f.checkValidity()')
            assert page.locator('#contact-form').get_attribute('action').startswith('mailto:')
        print(f"PASS {name}: {size[0]}x{size[1]}, no overflow, assets loaded, no JS errors, tested accessible mobile navigation" if name!='desktop' else f"PASS {name}: {size[0]}x{size[1]}, no overflow, assets loaded, no JS errors, contact data validation")
        page.close()
    browser.close()
