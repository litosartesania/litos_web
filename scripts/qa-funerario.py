"""Current memorial acceptance checks across mobile, tablet and desktop."""
from pathlib import Path
import hashlib,json
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for width,height in ((390,844),(768,1024),(1440,1000)):
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=width==390,reduced_motion='reduce',accept_downloads=True)
        page=context.new_page();errors=[];external=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http://','https://')) else None)
        page.goto((root/'_site/funerario.html').as_uri()+'#personalizar')
        page.wait_for_selector('#memorial-workbench[data-ready="true"]',state='attached')
        assert page.locator('.memorial-studio').get_attribute('data-path')=='explore'
        assert page.locator('.memorial-case-card').count()==18
        assert page.locator('.memorial-accessory-card').count()==16
        assert page.locator('.memorial-controls > details').count()==5
        assert page.locator('.memorial-toolbar,.memorial-selection-overview').count()==0
        assert not page.locator('#memorial-workbench').is_visible()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        page.locator('#memorial-filter-type').select_option('columbario')
        assert page.locator('.memorial-case-card').count()==1
        page.locator('.memorial-case-card button').click()
        assert page.locator('#memorial-case-detail h5').inner_text()=='Columbario con aplique'
        assert 'Propuesta de diseño' in page.locator('.memorial-case-provenance').text_content()
        page.locator('.memorial-case-detail-copy button').first.click()
        page.wait_for_function('()=>document.querySelector("#memorial-slab")?.dataset.model==="columbario"')
        assert page.locator('.memorial-studio').get_attribute('data-path')=='customize'
        assert page.locator('#memorial-stone').input_value()=='sudafrica'
        assert page.locator('#memorial-symbol').input_value()=='metalica'
        assert page.locator('#memorial-text').input_value()=='NOMBRE APELLIDO'
        page.locator('#memorial-back-catalog').click()
        assert page.locator('.memorial-studio').get_attribute('data-path')=='explore'
        page.locator('#memorial-create').click()
        assert page.locator('.memorial-studio').get_attribute('data-path')=='create'
        assert page.locator('#memorial-symbol').input_value()=='metalica'
        page.locator('.memorial-controls > details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
        page.locator('#memorial-accessory').select_option('vaso-estriado')
        page.wait_for_selector('[data-slot="accessory"][data-accessory="vaso-estriado"]')
        assert 'fijación' in page.locator('#memorial-accessory-note').inner_text()
        page.locator('#memorial-accessory').select_option('florero')
        page.wait_for_function('()=>document.querySelector("[data-slot=accessory]")?.dataset.accessoryFinish==="acero"')
        page.locator('#memorial-width-mm').fill('900')
        page.locator('#memorial-height-mm').fill('700')
        page.wait_for_function('()=>!document.querySelector("#memorial-plan-download").disabled')
        with page.expect_download() as pending_plan:page.locator('#memorial-plan-download').click()
        plan=pending_plan.value
        assert plan.suggested_filename=='LITOS-plano-colocacion-orientativo.svg' and plan.failure() is None
        plan_text=Path(plan.path()).read_text(encoding='utf8')
        assert 'width="900"' in plan_text and 'height="700"' in plan_text and 'NO USAR PARA CORTE' in plan_text
        page.locator('#memorial-layout').select_option('devocionlateral')
        page.locator('#memorial-gallery-religiosas .memorial-motif[data-item-id="cristo-corona"]').click()
        page.wait_for_selector('[data-slot="devotional"] image')
        for technique,filter_id in (('grabado','pictorial-engraved'),('bajorrelieve','carved-relief'),('aplique 3D','applied-relief')):
            page.locator('#memorial-devotional-technique').select_option(technique)
            assert page.locator('button[data-slot]').count()==0
            assert page.locator('[data-slot=devotional]').count()==1
            page.wait_for_function('(name)=>document.querySelector("[data-slot=devotional]")?.dataset.technique===name',arg=technique,timeout=5500)
            assert page.locator('[data-slot="devotional"]').get_attribute('filter')==f'url(#{filter_id})'
        white=page.locator('#applied-relief feColorMatrix[type="matrix"]').get_attribute('values')
        for stone in ('macael','quintana','absoluto'):
            page.locator('#memorial-stone').select_option(stone)
            page.wait_for_function('(name)=>document.querySelector("#memorial-slab")?.dataset.stone===name',arg=stone)
            assert page.locator('#applied-relief feColorMatrix[type="matrix"]').get_attribute('values')==white
        page.locator('#memorial-finish').select_option('oro')
        page.wait_for_function('()=>document.querySelector("#memorial-slab")?.dataset.finish==="oro"')
        assert page.locator('#applied-relief feColorMatrix[type="matrix"]').get_attribute('values')==white
        assert page.locator('#memorial-download').is_enabled()
        with page.expect_download() as pending:page.locator('#memorial-download').click()
        download=pending.value
        assert download.suggested_filename=='LITOS-simulacion-orientativa.png' and download.failure() is None
        png=Path(download.path()).read_bytes()
        assert png[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(png[16:20],'big')==2000
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        assert not errors and not external,(errors,external)
        results.append({'viewport':width,'catalog_models':page.evaluate('window.LitosMemorialData.catalog.commercialModels.length'),'accessories':page.locator('.memorial-accessory-card').count()-1,'png_sha256':hashlib.sha256(png).hexdigest()[:12],'external_requests':len(external),'javascript_errors':len(errors)})
        context.close()
    context=browser.new_context(viewport={'width':390,'height':844})
    page=context.new_page();external=[];errors=[]
    page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http://','https://')) else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto((root/'preview/LITOS_CONFIGURADOR_FUNERARIO.html').as_uri())
    page.wait_for_selector('#memorial-workbench[data-ready="true"]',state='attached')
    assert page.locator('.memorial-case-card').count()==18
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    assert not external and not errors,(external,errors)
    context.close();browser.close()
print(json.dumps({'status':'PASS','checks':results,'standalone':'PASS'},ensure_ascii=False,indent=2))
