# Fase 3 funeraria · revisión artística y técnica · 18/10/2026

## Resultado y procedencia

La auditoría agregada está en `FUNERARIO_FASE3_INVESTIGACION.md`: 33 recortes accesibles, 16 figurativos y 17 de cruces/crucifijos, asociados a 30 trabajos según la base privada. Los originales, recortes, identificadores y correspondencias permanecen fuera de este repositorio. Se estudiaron directamente en entorno privado. Ninguno se envió al generador de imágenes. Las ocho imágenes nuevas se generaron con descripciones **genéricas de familias iconográficas**; no son calcos ni fotografías de piezas LITOS.

La fuente visual es un único relieve claro por motivo con transparencia, optimizado en WebP. El compositor conserva la fuente y aplica por material una mezcla y luz de contacto simuladas. Las miniaturas usan la misma fuente a escala menor. Esto mejora rostros, manos, pliegues y volumen respecto a los cinco SVG lineales rechazados, pero el tratamiento sigue siendo pictórico y puede parecer un aplique sobre piedras de grano grueso. No acredita un grabado o relieve fabricable.

## Estado de cada candidato

| ID | Familia / formato | Revisión artística | Técnica y derechos |
| --- | --- | --- | --- |
| `cristo-corona` | busto escultórico, WebP alfa | aprobada para simulación pública el 18/10/2026 | bajorrelieve simulado; pendiente de taller y uso comercial |
| `cristo-crucificado` | figura vertical sobre cruz, WebP alfa | aprobada para simulación pública el 18/10/2026 | relieve/aplique por determinar |
| `virgen-nino` | maternidad escultórica, WebP alfa | aprobada para simulación pública el 18/10/2026 | bajorrelieve simulado |
| `san-jose-nino` | figura paterna escultórica, WebP alfa | aprobada para simulación pública el 18/10/2026 | bajorrelieve simulado |
| `angel` | figura vertical con alas, WebP alfa | aprobada para simulación pública el 18/10/2026 | talla escultórica por confirmar |
| `paloma-olivo` | ave horizontal, WebP alfa | aprobada para simulación pública el 18/10/2026 | relieve por confirmar |
| `medallon-mariano` | medallón circular, WebP alfa | aprobada para simulación pública el 18/10/2026 | medallón aplicado frente a talla: por confirmar |
| `medallon-cristo` | medallón oval, WebP alfa | aprobada para simulación pública el 18/10/2026 | medallón aplicado frente a talla: por confirmar |

Los ocho se aprobaron visualmente para exhibición pública como **prototipos orientativos**: `publicSelectable:true` y `commercialReady:false`. La validación técnica del taller, el uso industrial y los derechos de explotación comercial siguen pendientes. Los WebP completos y sus miniaturas figuran con SHA-256 en `FUNERARIO_ASSETS_MANIFEST.json` y se sirven desde Pages. Las miniaturas se cargan al abrir la galería; la imagen completa se carga al elegirla y se reutiliza al cambiar la piedra. Ninguna foto privada del taller entra en el sitio.

## Seis cruces de PR #60

Las seis ya se muestran en la web como **prototipos orientativos**, por autorización anterior, y mantienen `commercialReady:false`. Se revisó su miniatura y vista grande sobre piedra negra; el compositor diferencia la incisión, la talla y el aplique con filtros de luz y sombra. Se cambiaron los trazados de `moldurada.svg` (dos canales más legibles y bisel) y `metalica.svg` (placa más presente y cuatro fijaciones). El generador de recursos lee esos SVG sin regenerarlos, por lo que no deshace los retoques.

| Cruz | Juicio visual actual | Pendiente del taller |
| --- | --- | --- |
| `santiago` | silueta propia y legible; color solo conceptual | confirmar pigmento y geometría de ejecución |
| `doblefilete` | trazos limpios; aún se parece a la cruz calada a tamaño pequeño | definir sección e incisión reales |
| `moldurada` | canales y volumen reforzados | validar sección, profundidad y remates |
| `metalica` | placa y puntos de fijación más diferenciados | confirmar metal, tornillería y separación real |
| `florenzada` | remates ornamentales reconocibles; delicados en miniatura | decidir talla y grosor mínimo |
| `medalloncruz` | aro distinto del resto; limpia en miniatura | decidir incisión frente a medallón aplicado |

Ninguna cruz se certifica para fabricación. La comparación con el inventario privado es tipológica: cruz tallada, perfilada, ornamental, metal y Santiago aparecen en la base; no se copió una cruz particular.

## Composiciones y revisión navegable

Se añaden tres composiciones justificadas por patrones de figura lateral grande, crucifijo vertical lateral y figura/medallón superior con texto inferior. Las zonas reservadas se calculan en el mismo motor que exporta PNG. Están disponibles como prototipos públicos (`publicSelectable:true`, `commercialReady:false`). Un motivo sin zona o un texto truncado bloquea la exportación.

- Galería: `preview/LITOS_GALERIA_RELIEVES_FASE3.html` (ocho miniaturas, vista grande y selector local de Negro Sudáfrica, Blanco Italia y Gris Quintana).
- Configurador: `preview/LITOS_REVISION_RELIEVES_FASE3.html` (capas, escala/posición, retirada de motivo, texto independiente y exportación local).
- Capturas de las tres piedras: `preview/LITOS_FASE3_SUDAFRICA_RELIEVE.png`, `preview/LITOS_FASE3_ITALIA_RELIEVE.png`, `preview/LITOS_FASE3_QUINTANA_RELIEVE.png`.
- Captura de la galería: `preview/LITOS_GALERIA_RELIEVES_FASE3.png`.
- Comparación antes/después: `preview/LITOS_COMPARACION_FIGURAS_FASE3.html` y su captura `.png` presentan cuatro pares de familias semejantes sobre el mismo fondo simulado. Los cinco SVG religiosos rechazados se conservan en `assets/funerario/ornamentos/religiosas/`; continúan ocultos en la web y no se incorporan a la galería general.

Los HTML de revisión autónomos quedan en artefactos de la PR, fuera de Pages. El configurador público incorpora las opciones aprobadas por separado. Los revisores siguen siendo accesibles a quien tenga acceso a la PR; no son un entorno privado autenticado.

## Verificaciones y límites

`scripts/check-funerario.py` verifica 47 motivos, 9 layouts, 82 recursos del manifiesto público (incluidos ocho WebP completos y ocho miniaturas), tamaño y SHA-256. `scripts/check-site.py _site --production` prueba la lista permitida y ausencia de originales privados. `scripts/qa-funerario-phase3.py` recorre 8 figuras × 3 piedras × 3 layouts = 72 composiciones a cada una de 390, 768 y 1440 px (216 en total), más 6 cruces × 3 piedras × 3 anchuras = 54 composiciones adicionales. Comprueba choques de texto/figura, texto fuera de zona, solicitudes externas y errores JS; descarga PNG de 2000 px y coteja píxeles del área artística entre vista SVG y archivo. La diferencia media por canal fue 0,84, 0,72 y 1,02/255 para las tres piedras, respectivamente (antialiasing distinto, no igualdad absoluta). Además prueba la galería a 390 y 1440 px. `scripts/qa-funerario-public-loading.py` comprueba carga diferida de imágenes completas y privacidad de peticiones en la versión pública.

Pendientes: verificación técnica y de derechos de explotación comercial, muestras físicas de las piedras y pruebas en Safari/dispositivos reales. Blanco Italia continúa como interpretación no certificada. Las texturas y las sombras de relieve son simulaciones digitales; no son planos ni promesas de acabado.

## Generación de imágenes

Herramienta: ImageGen integrado. Entrada: solo indicaciones de texto que pedían motivos funerarios religiosos **genéricos**, talla clara, anatomía proporcionada, luces laterales y fondo transparente. Se generaron ocho fuentes raster independientes; luego se ajustaron únicamente formato y tamaño máximo de 1024 píxeles, sin editar ni incorporar fotos del taller. Rutas entregadas en `assets/funerario/ornamentos/religiosas/relieves/`; un archivo WebP por ID de la tabla. Esta trazabilidad declara el proceso de creación, no una aprobación de derechos para vender o fabricar.
