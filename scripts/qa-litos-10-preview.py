#!/usr/bin/env python3
"""Offline browser QA for verified LITOS original stone renders, no production deployment."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
uri=(root / "_site/mobiliario.html").as_uri()
materials=["travertino","macael","verde-alpi","granito","marquina"]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
    for width,height in [(390,844),(820,1180),(1440,900)]:
        page=browser.new_page(viewport={"width":width,"height":height},reduced_motion="reduce")
        errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.goto(uri,wait_until="load")
        assert page.locator(".piece-card").count()==21
        assert page.locator("form").count()==0
        assert page.locator("a[href^='mailto:']").count()==0
        for material in materials:
            page.locator("#material-picker").select_option(material)
            for product in ["consola-esc","banco-esc"]:
                img=page.locator(f'[data-product="{product}"] .material-variant-figure img')
                assert img.count()==1, (width,material,product,"image missing")
                expected=f"assets/catalogo/variantes/{product}__{material}.png"
                assert img.get_attribute("src")==expected, (material,product,img.get_attribute("src"))
                img.evaluate("(el) => { el.loading = 'eager'; }")
                assert img.evaluate("async (el) => { try { await el.decode(); return el.naturalWidth === 1122 && el.naturalHeight === 1402; } catch { return false; } }"), (width,material,product,"invalid rendered PNG")
                assert page.locator(f'[data-product="{product}"] .material-variant-figure figcaption').inner_text().find("No es una obra ejecutada")>=0
            assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"),(width,material,"horizontal overflow")
        for material in ["caliza","carrara","cuarcita","calacatta"]:
            page.locator("#material-picker").select_option(material)
            assert page.locator(".material-variant-figure").count()==0, (width,material,"unapproved image")
            assert page.locator(".concept-availability").count()==6, (width,material,"original references absent")
        assert not errors, (width,errors)
        print("PASS",width,"5 provided finishes, 4 unsupported finishes, no JS errors, no overflow")
        page.close()
    browser.close()
