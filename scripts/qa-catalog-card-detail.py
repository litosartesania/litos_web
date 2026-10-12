#!/usr/bin/env python3
"""Assert editorial three-column catalog and keyboard-accessible product modal, offline."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
url=(root/'_site/mobiliario.html').resolve().as_uri()
out=root/'review-layout/screenshots'
out.mkdir(parents=True,exist_ok=True)

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
    for width,height in [(390,844),(820,1180),(1100,900),(1440,900),(1600,900)]:
        page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded')
        cards=page.locator('.piece-card:visible')
        assert cards.count()==21,(width,cards.count())
        assert page.locator('.category-filter-bar button').count()==7
        assert page.locator('#material-picker option').count()==9
        assert page.locator('.product-open').count()==21
        assert page.locator('form').count()==0
        boxes=[cards.nth(i).bounding_box() for i in range(4)]
        assert all(box and box['width']>165 for box in boxes),(width,boxes)
        close=lambda a,b: abs(a-b)<4
        if width>=1200:
            assert close(boxes[0]['y'],boxes[1]['y']) and close(boxes[1]['y'],boxes[2]['y']),(width,'not three across',boxes)
            assert boxes[3]['y']>boxes[0]['y']+200,(width,'fourth must be on second row')
        elif width>=700:
            assert close(boxes[0]['y'],boxes[1]['y']) and boxes[2]['y']>boxes[0]['y']+150,(width,'not two across',boxes)
        else:
            assert boxes[1]['y']>boxes[0]['y']+150,(width,'not single-column on mobile')
        sidebar=page.locator('.material-planner').bounding_box()
        if width>=1100:
            assert sidebar['x']+sidebar['width']+8<boxes[0]['x'],(width,'sidebar not at left',sidebar,boxes[0])
        else:
            assert sidebar['y']+sidebar['height']<=boxes[0]['y']+2,(width,'sidebar not above cards')

        # Opening a product also opens the material selector ABOVE its enlarged image.
        trigger=page.locator('[data-product="mesa-centro-mon"] .product-open')
        trigger.click()
        dialog=page.locator('#product-dialog')
        assert dialog.is_visible(),width
        assert dialog.get_attribute('aria-labelledby')=='detail-product-title'
        assert page.locator('#detail-product-title').inner_text()=='Mesa de centro monolítica'
        assert page.locator('#detail-material-picker').input_value()=='travertino'
        sel=page.locator('#detail-material-picker').bounding_box()
        img=page.locator('.detail-stage .material-variant-figure img')
        assert img.count()==1
        imagebox=img.bounding_box()
        assert sel['y']<imagebox['y'],(width,'material picker must be above image',sel,imagebox)
        assert img.get_attribute('src')=='assets/catalogo/variantes/mesa-centro-mon__travertino.png'
        img.evaluate('(im)=>{im.loading="eager"}')
        img.evaluate('(im)=>im.decode()')
        assert img.evaluate('(im)=>im.naturalWidth===1122&&im.naturalHeight===1402')
        prev_price=page.locator('#detail-price').inner_text()
        page.locator('#detail-material-picker').select_option('marquina')
        assert page.locator('#material-picker').input_value()=='marquina',(width,'main selector not synced')
        assert img.get_attribute('src')=='assets/catalogo/variantes/mesa-centro-mon__marquina.png'
        img.evaluate('(im)=>im.decode()')
        assert page.locator('#detail-price').inner_text()!=prev_price
        assert page.locator('#detail-source').get_attribute('rel')=='noopener noreferrer'
        if width in (390,1440):
            page.screenshot(path=str(out/f'producto-mon-detalle-{width}.png'),animations='disabled')
        page.keyboard.press('Escape')
        assert not dialog.is_visible(),(width,'ESC did not close dialog')
        page.wait_for_function('() => document.activeElement === document.querySelector(\'[data-product="mesa-centro-mon"] .product-open\')',timeout=4000)

        # Unillustrated products must never pretend to have a stone-specific rendering.
        page.locator('[data-product="mesa-aux-bal"] .product-open').click()
        assert dialog.is_visible()
        assert page.locator('#detail-product-title').inner_text()=='Mesa auxiliar con baldas'
        assert page.locator('.detail-stage .material-placeholder').count()==1
        assert 'sin imagen propia' in page.locator('.detail-stage .material-placeholder').inner_text()
        page.locator('.detail-close').click()
        assert not dialog.is_visible()

        page.locator('[data-category-filter="Baño"]').click()
        assert page.locator('.piece-card:visible').count()==3,(width,'family filter not retained')
        page.locator('[data-category-filter="Todos"]').click()
        assert page.locator('.piece-card:visible').count()==21
        assert page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1'),(width,'horizontal overflow')
        assert not errors,(width,errors)
        if width in (390,820,1440,1600):
            page.locator('#catalogo').scroll_into_view_if_needed()
            page.screenshot(path=str(out/f'catalogo-grid-{width}.png'),animations='disabled')
        print('PASS',width,'gallery columns, left filters, 21 cards, synced modal, ESC, image fallback, filters')
        page.close()
    browser.close()
