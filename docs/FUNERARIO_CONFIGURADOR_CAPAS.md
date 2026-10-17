# Configurador funerario por capas · revisión 17/10/2026

Estado: prototipo funcional para revisión. Rama `work/funerario-capas-20261017`, basada en el commit `b6f33a23` de la PR #54. No autoriza fusión ni despliegue.

## Implementado

- Motor SVG con superficie, geometría, símbolos, ornamentos, texto y efectos separados. Las selecciones permanecen en memoria al cambiar material, modelo, composición o acordeón.
- Cinco geometrías propias: nicho recto, doble con pilastras/cornisa/repisa, columbario cuadrado, portada con arco y losa horizontal de panteón. El nicho utiliza **97/80 = 1,2125** como proporción conceptual. Ninguna geometría define medidas, espesores o anclajes de fabricación.
- Siete materiales, dos recreaciones originales por material. Los mapas son superficies limpias, sin nombres, grabados, símbolos ni herrajes. Geometría y fijaciones opcionales se construyen aparte.
- 19 ornamentos originales SVG: cinco cruces, cuatro separadores, cuatro marcos, tres motivos florales y tres símbolos. Cada categoría admite «Ninguno». Cruz y motivo floral/simbólico tienen escala y posición dentro de zonas reservadas. El marco y los separadores siguen las zonas de la composición.
- Cinco campos independientes: encabezado, denominación, fechas opcionales, epitafio y texto adicional. Contenido, visibilidad, tamaño, interlineado y alineación editables; ajuste de líneas y tamaño según el espacio disponible.
- Cuatro composiciones: centrado clásico, cruz lateral, ornamento superior, texto con separadores. Las zonas de texto y motivos no se superponen.
- Siete elecciones de acabado: automático según piedra, inciso oscuro, inciso claro, blanco, gris/plateado, dorado y relieve suave. Efectos visuales moderados, sin afirmar técnicas de fabricación disponibles.
- PNG local de 2000 × 2000 con material, ornamentos, fuente activa e inscripción; archivo genérico `LITOS-simulacion-orientativa.png`, con aviso de simulación. El grabado usa las mismas fuentes ya cargadas para evitar sustituciones al exportar.
- Interfaz Luz rasante, controles de teclado y táctiles, vista previa fija mientras se editan los controles. Todos los recursos se sirven localmente; el archivo autónomo funciona sin red.

## Materiales: disponibilidad y límites

| Material | Recursos disponibles | Contraste de denominación y aspecto | Pendiente |
| --- | --- | --- | --- |
| Negro Sudáfrica | A y B | [Grupimar](https://grupimar.es/granitos/negro-sudafrica-impala/): fondo gris intenso y grano más claro | Ajustar escala/tono del grano a muestra LITOS |
| Negro Absoluto | A y B | [Cupa Stone](https://www.cupastone.es/productos/negro-absoluto/): negro muy uniforme | Confirmar variedad y pulido del proveedor |
| Negro Tezal | A y B | [Grupimar](https://grupimar.es/granitos/granito-negro-tezal/): gris, negro y blanco de grano medio | Validar tamaño de cristales y tono |
| Blanco Macael | A y B | [Mármoles de Macael](https://www.marmolesmacael.com/catalogo): blanco cristalino con vetas grises ocasionales | Validar veta y selección de tabla |
| Blanco Italia | A y B, provisionales | [Grupo Carmena](https://grupocarmenamarmoles.com/catalogo/marmol-blanco-italia/): confirma denominación comercial; la evidencia no identifica una variedad única | **Identificar piedra exacta y sustituir recreaciones si no corresponden** |
| Blanco Champagne | A y B | [Arteaco](https://arteaco.es/home/materiales/granito/gblanco/blancochampagne/): granito blanco grisáceo con grano negro/gris | Validar distribución y grano; no interpretarlo como mármol crema |
| Gris Quintana | A y B | [Canteras Agustín Tena](https://canterasagustintena.com/gris-quintana/): granito gris de cantera propia | Validar selección, tono y acabado |

Los 14 WebP son **recreaciones generadas originales, no fotografías de muestras ni reproducciones certificadas de las variedades del taller**. Hay rasgos generales contrastados, pero no una calibración mineral o colorimétrica: la escala de grano, las vetas y los brillos necesitan revisión. No se consideran recursos comerciales definitivos ni obras ejecutadas. Dos atlas nuevos de 4 × 2 campos se empaquetaron por celdas completas, sin deformar las superficies ni incorporar originales particulares. La octava celda no se utiliza.

## Tipografías y licencias

La documentación anónima existente recoge Aldine, Remus, Inglesa, Cataneo, Redonda y Gótica, pero **no aporta fuentes digitales originales o muestras suficientes para demostrar equivalencia**. No se ha consultado ni modificado otro repositorio, ni se han importado matrices privadas.

| Referencia histórica | Fuente digital real | Etiqueta del selector |
| --- | --- | --- |
| Aldine | EB Garamond | Serif clásica · aproximación |
| Remus | Cinzel | Capital romana · aproximación |
| Inglesa | Great Vibes | Caligráfica · aproximación |
| Cataneo | Libre Baskerville Italic | Itálica · aproximación |
| Redonda | Noto Sans | Sans redonda · aproximación visual |
| Gótica | UnifrakturMaguntia | Fractura · aproximación |

Las seis fuentes se distribuyen con SIL Open Font License 1.1. Se conservan los seis archivos `*-OFL.txt`, con sus titulares y condiciones, junto a los WOFF2. Origen: [repositorio oficial Google Fonts](https://github.com/google/fonts/tree/main/ofl), directorios identificados en `catalogo.json`. Se usa el subconjunto latino, con acentos y ñ; otros alfabetos pueden recurrir a sustituciones del navegador. No hay Google Fonts ni CDN en ejecución: los bytes están embebidos en el paquete local.

## Archivos y reproducción

- `funerario.html`, `styles.css`: integración en el estudio existente; navegación y catálogo previo conservados.
- `funerario-personalizador.js`: controles y estado efímero.
- `funerario-compositor.js`: motor SVG, coordenadas, zonas, texto y acabados.
- `funerario-exportar.js`: descarga PNG local.
- `funerario-recursos.js`: paquete determinista de imágenes, fuentes y vectores.
- `assets/funerario/`: 14 texturas, 19 SVG, 6 fuentes, 6 licencias y catálogo JSON; 46 archivos con hashes en `FUNERARIO_ASSETS_MANIFEST.json`.
- `tools/define-funerario-catalog.mjs`, `build-funerario-ui.mjs`, `build-funerario-resources.mjs`: fuentes editables del catálogo, estructura de controles y empaquetado. `prepare-funerario-assets.py` solo empaqueta atlas originales y requiere Pillow al preparar nuevos recursos.
- `scripts/stage-funerario.py`: copia exclusivamente recursos permitidos y verificados por hash, sin copiar directorios completos.
- `scripts/funerario-scenarios.js`, `qa-funerario.py`: escenarios de aceptación compartidos y ejecución Chromium en CI.
- `tools/build-funerario-preview.mjs`: vista previa autónoma del configurador. El builder general conserva también la navegación entre las cinco páginas.

Preparar, sin publicar:

```sh
node tools/define-funerario-catalog.mjs
node tools/build-funerario-ui.mjs
node tools/build-funerario-resources.mjs
sh scripts/build-site.sh
python3 scripts/check-site.py _site
python3 scripts/check-funerario.py
node --check script.js
node --check funerario-compositor.js
node --check funerario-personalizador.js
node --check funerario-exportar.js
node tools/build-preview.mjs
node tools/build-standalone.mjs
node tools/build-funerario-preview.mjs
python3 scripts/check-preview.py preview
python3 scripts/visual-qa.py
python3 scripts/qa-funerario.py
```

Los dos últimos comandos requieren Playwright/Chromium. El motor del visitante no necesita paquetes ni servidor. El HTML autónomo se abre en un navegador; algunos visores de adjuntos desactivan JavaScript.

## Validación ejecutada

- Build y auditoría estática, allowlist de 298 archivos y hashes de recursos anteriores: PASS.
- Sintaxis de todos los módulos nuevos y `script.js`: PASS. Sintaxis Python: PASS.
- Escenarios compartidos ejecutados en Chromium a **390, 768 y 1440 px**: 240 composiciones por anchura, **720 en total** (5 modelos × 4 layouts × 6 fuentes × textos corto/largo). Se comprueban cajas reales de texto, límites y separación de texto/símbolos.
- Selección de 7 materiales × 2 variantes, 19 ornamentos activados/eliminados, seis fuentes, acabados, posición/escala, ocultar/restaurar campos, alineación y texto literal potencialmente hostil: PASS.
- Teclado en las tres anchuras y apertura táctil a 390 px: PASS. Exportación PNG descargada en las tres anchuras: PASS.
- Comparación de PNG y SVG visible para serif, caligráfica y fractura: diferencia media RGB aproximada **0,96–1,17 sobre 255**, con antialiasing y sombreado distintos. Misma fuente y disposición. No se afirma identidad de píxel.
- Regresión de las cinco páginas a las tres anchuras (15 vistas), imágenes y menú: PASS; 21 fichas de mobiliario y selector de granito conservados. Cero errores JavaScript, cero desbordamientos y cero solicitudes HTTP externas en estas pruebas.
- Vistas autónomas general y funeraria: PASS; la funeraria inicializa con **cero solicitudes de red**.
- No se afirma haber probado Safari/WebKit o dispositivos físicos. La ejecución de CI reproduce el runner Python en Linux; el control local de Chromium se ejecutó mediante el navegador de pruebas, porque el sandbox impide lanzar otro proceso Chromium desde el terminal.

## Privacidad y reversibilidad

Sin fotografías originales, retratos, pedidos, inscripciones reales, correos privados, facturas, enlaces internos o datos del visitante en archivos/commits. Solo texto genérico de demostración y datos técnicos públicos. Los nombres de autores en licencias se conservan por obligación de atribución.

El estado de controles e inscripción vive en memoria. No usa almacenamiento web, cookies, URL, registros, analítica, formularios o llamadas de red. Solo una descarga explícita contiene lo escrito. Los campos se insertan como texto, nunca como HTML. Los SVG importados proceden exclusivamente de los 19 vectores del catálogo, no de entradas del visitante.

Se conservan los binarios y precios anteriores del catálogo y no se alteran procesos internos. Reversión mediante los commits de esta rama; sin push forzado. No se ejecuta Pages, no se fusiona y no se modifica `main`. Las condiciones legales anteriores no se reinterpretan ni se alteran en esta fase.

## Pendientes antes de considerarlo definitivo

1. Validación visual de la interfaz y de los 14 mapas con muestras despersonalizadas de piedra; sustituir cualquier recreación que no represente el material.
2. Identificar la variedad exacta de Blanco Italia y las fuentes/matrices reales con su licencia; la equivalencia histórica sigue sin demostrarse.
3. Confirmar geometrías, medidas y técnicas disponibles mediante documentación técnica de taller. Los modelos no son planos constructivos.
4. Revisar la experiencia en Safari/iPhone/iPad reales y aprobar la publicación expresamente.

El prototipo satisface la composición interactiva por capas sin regeneración de imágenes en cada cambio. No satisface todavía una certificación fotográfica o de fabricación.
