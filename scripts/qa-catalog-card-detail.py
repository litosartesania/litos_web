#!/usr/bin/env python3
"""Assert editorial five-column catalog and keyboard-accessible product modal, offline."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
url=(root/'_site/mobiliario.html').resolve().as_uri()
out=root/'review-layout/screenshots'
out.mkdir(parents=True,exist_ok=True)

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
    for width,height in [(390,844),(820,1180),(1100,900),(1200,900),(1440,900),(1600,900),(1920,1000)]:
        page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded')
        cards=page.locator('.piece-card:visible')
        assert cards.count()==21,(width,cards.count())
        assert page.locator('.category-filter-bar button').count()==7
        assert page.locator('#material-picker option').count()==10
        assert page.locator('#detail-material-picker option').count()==10
        assert page.locator('.product-open').count()==21
        assert page.locator('form').count()==0
        boxes=[cards.nth(i).bounding_box() for i in range(6)]
        assert all(box and box['width']>165 for box in boxes),(width,boxes)
        close=lambda a,b: abs(a-b)<4
        if width>=1200:
            assert all(close(boxes[0]['y'],boxes[i]['y']) for i in range(1,5)),(width,'not five across',boxes)
            assert boxes[5]['y']>boxes[0]['y']+150,(width,'sixth must start second row',boxes)
        elif width>=1100:
            assert all(close(boxes[0]['y'],boxes[i]['y']) for i in range(1,3)),(width,'not three across',boxes)
            assert boxes[3]['y']>boxes[0]['y']+150,(width,'fourth must start second row',boxes)
        elif width>=700:
            assert close(boxes[0]['y'],boxes[1]['y']) and boxes[2]['y']>boxes[0]['y']+150,(width,'not two across',boxes)
        else:
            assert boxes[1]['y']>boxes[0]['y']+150,(width,'not single-column on mobile',boxes)
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
        # A drawing is one per product. Both selectors synchronize; no false dimensions.
        last_price=page.locator('#detail-price').inner_text()
        page.locator('#detail-material-picker').select_option('plano-tecnico')
        assert page.locator('#material-picker').input_value()=='plano-tecnico'
        drawing=page.locator('.detail-stage .technical-drawing-figure img')
        assert drawing.count()==1
        assert drawing.get_attribute('src')=='assets/catalogo/planos/mesa-centro-mon.png'
        drawing.evaluate('(im)=>{im.loading="eager"}')
        drawing.evaluate('(im)=>im.decode()')
        assert drawing.evaluate('(im)=>im.naturalWidth===1600&&im.naturalHeight===1200')
        assert drawing.evaluate('(im)=>getComputedStyle(im).objectFit')=='contain'
        assert page.locator('.piece-grid .technical-drawing-figure img').count()==21
        assert page.locator('.piece-grid .technical-placeholder').count()==0
        assert page.locator('#detail-price').inner_text()==last_price
        assert 'Negro Marquina' in page.locator('#detail-stone').inner_text()
        if width in (390,1440):page.screenshot(path=str(out/f'plano-mon-detalle-{width}.png'),animations='disabled')
        page.locator('#detail-material-picker').select_option('marquina')
        assert page.locator('#material-picker').input_value()=='marquina'
        assert img.get_attribute('src')=='assets/catalogo/variantes/mesa-centro-mon__marquina.png'
        assert page.locator('.detail-stage .technical-placeholder').count()==0
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
        page.locator('#detail-material-picker').select_option('travertino')
        assert page.locator('#material-picker').input_value()=='travertino'
        new_image=page.locator('.detail-stage .material-variant-figure img')
        assert new_image.get_attribute('src')=='assets/catalogo/revisiones/20261013/travertino-seleccion/mesa-aux-bal__travertino.png'
        new_image.evaluate('(el)=>el.decode()')
        assert new_image.evaluate('(el)=>el.naturalWidth===1122&&el.naturalHeight===1402')
        page.locator('#detail-material-picker').select_option('marquina')
        page.locator('.detail-close').click()
        assert not dialog.is_visible()

        # Newly illustrated product in the detail modal and honest fallback for Marquina.
        page.locator('[data-product="macetero"] .product-open').click()
        assert dialog.is_visible()
        page.locator('#detail-material-picker').select_option('travertino')
        image=page.locator('.detail-stage .material-variant-figure img')
        assert image.get_attribute('src')=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/macetero__travertino.png'
        image.evaluate('(el)=>{el.loading="eager"}')
        image.evaluate('(el)=>el.decode()')
        assert image.evaluate('(el)=>el.naturalWidth===1086&&el.naturalHeight===1448')
        page.locator('#detail-material-picker').select_option('marquina')
        assert page.locator('.detail-stage .material-placeholder').count()==1
        page.locator('.detail-close').click()

        # Mesa auxiliar pedestal: all new stone materials are displayed and synced.
        page.locator('[data-product="mesa-aux-ped"] .product-open').click()
        assert dialog.is_visible()
        assert page.locator('#detail-product-title').inner_text()=='Mesa auxiliar pedestal'
        for stone in ('caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
            page.locator('#detail-material-picker').select_option(stone)
            assert page.locator('#material-picker').input_value()==stone
            im=page.locator('.detail-stage .material-variant-figure img')
            assert im.count()==1 and im.get_attribute('src')=='assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__'+stone+'.png'
            im.evaluate('(e)=>e.decode()')
            assert im.evaluate('(e)=>e.naturalWidth===1122&&e.naturalHeight===1402')
        page.locator('#detail-material-picker').select_option('plano-tecnico')
        assert page.locator('.detail-stage .technical-drawing-figure img').get_attribute('src')=='assets/catalogo/planos/mesa-aux-ped.png'
        page.locator('.detail-close').click()
        assert not dialog.is_visible()

        # Corrected console imagery is available in modal and synchronized with main selector.
        page.locator('[data-product="consola-esc"] .product-open').click()
        assert dialog.is_visible()
        assert page.locator('#detail-product-title').inner_text()=='Consola escultórica'
        page.locator('#detail-material-picker').select_option('caliza')
        assert page.locator('#material-picker').input_value()=='caliza'
        revised_console=page.locator('.detail-stage .material-variant-figure img')
        assert revised_console.get_attribute('src')=='assets/catalogo/revisiones/20261013/variantes/consola-esc__caliza.png'
        revised_console.evaluate('(e)=>{e.loading="eager"}')
        revised_console.evaluate('(e)=>e.decode()')
        assert revised_console.evaluate('(e)=>e.naturalWidth===1122&&e.naturalHeight===1402')
        before_technical=page.locator('#detail-price').inner_text()
        page.locator('#detail-material-picker').select_option('plano-tecnico')
        assert page.locator('#material-picker').input_value()=='plano-tecnico'
        revised_plan=page.locator('.detail-stage .technical-drawing-figure img')
        assert revised_plan.get_attribute('src')=='assets/catalogo/revisiones/20261013/planos/consola-esc.png'
        revised_plan.evaluate('(e)=>{e.loading="eager"}')
        revised_plan.evaluate('(e)=>e.decode()')
        assert revised_plan.evaluate('(e)=>e.naturalWidth===1448&&e.naturalHeight===1086')
        assert page.locator('#detail-price').inner_text()==before_technical
        page.locator('.detail-close').click()
        assert not dialog.is_visible()
        # Additional new drawing: planter in synchronized product detail.
        page.locator('[data-product="macetero"] .product-open').click()
        assert dialog.is_visible()
        page.locator('#detail-material-picker').select_option('plano-tecnico')
        sheet=page.locator('.detail-stage .technical-drawing-figure img')
        assert sheet.count()==1 and sheet.get_attribute('src')=='assets/catalogo/revisiones/20261013/planos-12-seleccion/macetero.png'
        sheet.evaluate('(im)=>{im.loading="eager"}')
        sheet.evaluate('(im)=>im.decode()')
        assert sheet.evaluate('(im)=>im.naturalWidth===1600&&im.naturalHeight===1200')
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

