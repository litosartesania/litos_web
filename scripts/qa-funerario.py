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
        # One-screen layout: on desktop all options are in the LEFT rail and the entire
        # stone stays on the RIGHT; narrow screens show the full stone above the options.
        positions=page.evaluate("""() => {
          const root=document.getElementById('memorial-workbench');
          const rail=root.querySelector('.memorial-options');
          const slab=root.querySelector('.memorial-display');
          const stone=document.getElementById('memorial-canvas');
          const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
          return {parent:rail?.parentElement===root,
            toolbar:rail?.contains(document.getElementById('memorial-toolbar')),
            controls:rail?.contains(root.querySelector('.memorial-controls')),
            selects:rail?.querySelectorAll('.memorial-quick-field select').length,
            overview:rail?.querySelectorAll('.memorial-selection-item').length,
            rail:rect(rail),slab:rect(slab),stone:rect(stone),
            svg:rect(stone.querySelector('svg')),
            overflow:document.documentElement.scrollWidth>innerWidth+1};
        }""")
        assert positions['parent'] and positions['toolbar'] and positions['controls']
        assert positions['selects']==5 and positions['overview']>=10,positions
        assert not positions['overflow'],positions
        assert positions['svg']['width']>0 and positions['svg']['height']>0,positions
        if width>=900:
            assert positions['rail']['right']<=positions['slab']['x']+2,positions
            assert positions['stone']['right']<=width+1,positions
            assert positions['rail']['height']<=height,positions
        else:
            assert positions['slab']['y']<positions['rail']['y'],positions
        page.locator('#memorial-stone').select_option('macael')
        page.wait_for_function("()=>document.querySelector('.memorial-selection-overview')?.textContent.includes('Blanco Macael')")
        page.locator('#memorial-stone').select_option('sudafrica')
        page.wait_for_function("()=>document.querySelector('.memorial-selection-overview')?.textContent.includes('Negro Sudáfrica')")
        page.locator('img').evaluate_all('(els)=>els.forEach(e=>e.loading="eager")')
        page.wait_for_function('()=>[...document.images].every(e=>e.complete&&e.naturalWidth>0)')
        page.locator('.memorial-controls details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
        page.locator('#personalizar').screenshot(path=str(root/'preview'/f'LITOS_PANEL_IZQUIERDO_{width}.png'),animations='disabled')
        result=page.evaluate(scenarios)
        page.locator('#memorial-stone').focus();page.keyboard.press('ArrowDown');page.keyboard.press('Enter')
        assert page.locator('#memorial-stone').evaluate('(el)=>el===document.activeElement')
        page.locator('#memorial-reset').click()
        with page.expect_download() as pending:page.locator('#memorial-download').click()
        download=pending.value
        assert download.suggested_filename=='LITOS-simulacion-orientativa.png' and download.failure() is None
        base_png=Path(download.path()).read_bytes()
        assert base_png[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(base_png[16:20],'big')==2000
        # Eight owner-approved visual prototypes are selectable; old rejected drawings remain hidden.
        assert page.locator('#memorial-gallery-category option[value="religiosas"]').count()==1
        assert page.locator('#memorial-devotional option').count()==9
        assert not page.locator('#memorial-devotional').is_disabled()
        page.locator('#memorial-gallery-category').select_option('religiosas')
        assert page.locator('#memorial-gallery .memorial-motif img').count()==8
        assert page.locator('.memorial-motif[data-item-id="madre"]').count()==0
        page.locator('.memorial-motif[data-item-id="cristo-corona"]').click()
        page.wait_for_selector('[data-slot="devotional"] image')
        assert page.locator('[data-slot="devotional"] image').get_attribute('href').startswith('data:image/webp;base64,')
        assert page.locator('#memorial-download').is_enabled()
        page.locator('#memorial-reset').click()
        page.locator('#memorial-gallery-category').select_option('cruces')
        for candidate in ('santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'):
            assert page.locator('#memorial-symbol option[value="'+candidate+'"]').count()==1
            assert page.locator('.memorial-motif[data-item-id="'+candidate+'"]').count()==1
        page.locator('.memorial-motif[data-item-id="moldurada"]').click()
        page.wait_for_function('()=>document.querySelector("#memorial-symbol").value==="moldurada"')
        assert page.locator('#memorial-download').is_enabled()
        page.locator('#memorial-reset').click()
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
    # Offline copy also offers the public prototype crosses; rejected religious drawings stay hidden.
    for width in (390,1440):
        context=browser.new_context(viewport={'width':width,'height':880},accept_downloads=True)
        review=context.new_page()
        review_errors=[];review_network=[]
        review.on('pageerror',lambda err:review_errors.append(str(err)))
        review.on('request',lambda req:review_network.append(req.url) if req.url.startswith(('http://','https://')) else None)
        review.goto((root/'preview/LITOS_REVISION_CRUCES_6.html').as_uri())
        review.wait_for_selector('#memorial-workbench[data-ready="true"]')
        assert review.locator('#review-only-notice').count()==1
        assert review.locator('#memorial-gallery-category option[value="religiosas"]').count()==1
        assert review.locator('#memorial-devotional option').count()==9
        review.locator('#memorial-gallery-category').select_option('cruces')
        for candidate in ('santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'):
            assert review.locator('#memorial-symbol option[value="'+candidate+'"]').count()==1
            tile=review.locator('.memorial-motif[data-item-id="'+candidate+'"]')
            assert tile.count()==1
            tile.click()
            review.wait_for_function('(id)=>document.querySelector("#memorial-symbol").value===id',arg=candidate)
            assert review.locator('#memorial-download').is_enabled(),candidate
        assert review.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        with review.expect_download() as download_info:
            review.locator('#memorial-download').click()
        downloaded=download_info.value
        assert downloaded.failure() is None
        png=Path(downloaded.path()).read_bytes()
        assert png[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(png[16:20],'big')==2000
        assert not review_errors and not review_network,(review_errors,review_network)
        context.close()
    # A sandbox-only transparent PNG may be tested in the independent local image reviewer.
    # Generated RGBA image contains no photograph, inscription, or personal data.
    import struct,zlib
    def chunk(kind,payload):
        return struct.pack('>I',len(payload))+kind+payload+struct.pack('>I',zlib.crc32(kind+payload)&0xffffffff)
    size=64
    rgba=b''.join(b'\x00'+b''.join(bytes([90+col,90+row,90,(row+col)%128+127]) for col in range(size)) for row in range(size))
    fixture=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(rgba))+chunk(b'IEND',b'')
    pictorial_context=browser.new_context(viewport={'width':390,'height':844},accept_downloads=True)
    pictorial=pictorial_context.new_page()
    errors=[];network=[]
    pictorial.on('pageerror',lambda error:errors.append(str(error)))
    pictorial.on('request',lambda req:network.append(req.url) if req.url.startswith(('https://','http://')) else None)
    pictorial.goto((root/'preview/LITOS_REVISION_FIGURATIVOS_LOCALES.html').as_uri())
    pictorial.wait_for_selector('#memorial-workbench[data-ready="true"]')
    pictorial.locator('#litos-local-upload').set_input_files({'name':'generic-relief.png','mimeType':'image/png','buffer':fixture})
    pictorial.wait_for_function('()=>document.getElementById("memorial-devotional").value==="arte_local_temporal"')
    pictorial.wait_for_selector('[data-slot="devotional"] image')
    assert pictorial.locator('#memorial-download').is_enabled()
    assert pictorial.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    with pictorial.expect_download() as download_info:
        pictorial.locator('#memorial-download').click()
    png=Path(download_info.value.path()).read_bytes()
    assert png[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(png[16:20],'big')==2000
    assert not errors and not network,(errors,network)
    pictorial_context.close()
    # Stone-first conceptual gallery: verify material choices and motif selection without network.
    gal_context=browser.new_context(viewport={'width':1440,'height':900})
    gallery_page=gal_context.new_page()
    gal_errors=[];gal_network=[]
    gallery_page.on('pageerror',lambda err:gal_errors.append(str(err)))
    gallery_page.on('request',lambda req:gal_network.append(req.url) if req.url.startswith(('http://','https://')) else None)
    gallery_page.goto((root/'preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html').as_uri())
    assert gallery_page.locator('.motif-card').count()==15
    # The full-page mobile screenshot revealed lazy-loaded candidates blank below the fold.
    # All 15 local SVG miniatures must decode even before the visitor scrolls.
    gallery_page.wait_for_function('()=>[...document.querySelectorAll(".motif-card img")].every(im=>im.complete&&im.naturalWidth>0)')
    assert gallery_page.locator('.motif-card img[loading="eager"]').count()==15

    assert gallery_page.locator('.motif-card[data-id="madre"]').count()==0
    assert gallery_page.locator('.motif-card[data-id="santiago"]').count()==1
    gallery_page.locator('.material-choice[data-stone="macael"]').click()
    assert gallery_page.locator('body').get_attribute('data-stone')=='macael'
    gallery_page.locator('.motif-card[data-id="moldurada"]').click()
    assert gallery_page.locator('#motif-select').input_value()=='moldurada'
    assert gallery_page.locator('.motif-card[data-id="moldurada"]').get_attribute('aria-pressed')=='true'
    assert gallery_page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    assert not gal_errors and not gal_network,(gal_errors,gal_network)
    gal_context.close()
    mobile_gallery_context=browser.new_context(viewport={'width':390,'height':844})
    mobile_gallery=mobile_gallery_context.new_page()
    mobile_gallery.goto((root/'preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html').as_uri())
    mobile_gallery.wait_for_function('()=>[...document.querySelectorAll(".motif-card img")].length===15&&[...document.querySelectorAll(".motif-card img")].every(im=>im.complete&&im.naturalWidth>0)')
    assert mobile_gallery.locator('.motif-card img[loading="eager"]').count()==15
    assert mobile_gallery.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    mobile_gallery_context.close()

    browser.close()
print(json.dumps({'status':'PASS','checks':results,'standalone':'PASS'},ensure_ascii=False,indent=2))
