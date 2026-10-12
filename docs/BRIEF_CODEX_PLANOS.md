# CODEX — LITOS COMERCIAL · 21 bocetos técnicos ortogonales

## Objetivo
Crear **una lámina técnica conceptual por cada uno de los 21 productos** de `litosartesania/litos_web`, con **alzado frontal, planta y perfil lateral** acotados en **centímetros**. Son 21 láminas adicionales, independientes de las 189 variantes de material; **no** hay una décima piedra.

## Fuentes obligatorias
Leer `PROJECT_CONTEXT.md`, `docs/HANDOFF.md`, `docs/PROGRESO_CATALOGO.md`, `catalogo-precios.js` y los PNG de las siete referencias completas, además de los WebP originales del catálogo. Obtener el modelo y su `product_id` de `catalogo-precios.js`. No rehacer el diseño ni cambiar las imágenes ya aprobadas.

## Alcance estricto
**Generar, revisar, catalogar y entregar ficheros para importación posterior; NO modificar GitHub, código web, `main`, PR #8 ni ningún repositorio distinto. No publicar ni desplegar.** No exponer datos familiares, de clientes, de producción, costes o instalaciones del taller. Sin servicios de pago.

## Productos y nombres de salida exactos
1. `mesa-comedor-oval` — Mesa de comedor ovalada (Concepto 2 aprobado).
2. `mesa-comedor-red` — Mesa de comedor redonda.
3. `mesa-comedor-rect` — Mesa de comedor rectangular.
4. `mesa-centro-mon` — Mesa de centro monolítica.
5. `mesa-centro-red` — Mesa de centro circular.
6. `mesa-aux-ped` — Mesa auxiliar pedestal.
7. `mesa-aux-bal` — Mesa auxiliar con baldas.
8. `consola-esc` — Consola escultórica.
9. `consola-rect` — Consola recta.
10. `banco-esc` — Banco escultórico.
11. `banco-rect` — Banco lineal.
12. `lavabo-ped` — Lavabo pedestal.
13. `lavabo-sobre` — Lavabo de sobreponer.
14. `encimera-bano` — Encimera de baño.
15. `encimera-cocina` — Encimera de cocina.
16. `balda` — Balda / repisa de piedra.
17. `panel` — Panel de revestimiento por m².
18. `bandeja` — Bandeja de piedra.
19. `peana` — Peana escultórica.
20. `cuenco` — Cuenco decorativo.
21. `macetero` — Macetero mineral.

## Requisitos gráficos
- Entregar por producto un **PNG horizontal 1600×1200** de buena legibilidad, fondo claro neutro y líneas oscuras finas, estilo dibujo técnico de diseño industrial; sin fotografía, perspectiva ni sombras artísticas.
- Tres vistas **ortogonales alineadas y coherentes**: **ALZADO** (ancho × alto), **PLANTA** (ancho × fondo) y **PERFIL** (fondo × alto). Cotas principales y, solo cuando proceda y se pueda justificar, grosor de tablero, sección del pedestal, luces, radios o diámetro. Etiquetas en castellano y **cm**.
- Mantener geometría fiel al producto de referencia (formas, proporciones, apoyos, curvaturas, vaciados). Conservar el mismo objeto en las tres proyecciones. No mezclar diferentes conceptos ni inventar detalles internos invisibles.
- **Las imágenes conceptuales no acreditan dimensiones reales.** Proponer cotas plausibles y proporcionales, marcadas visiblemente **«DIMENSIONES ORIENTATIVAS · CONCEPTO NO FABRICADO · NO APTO PARA FABRICACIÓN»**. No presentarlas como mediciones obtenidas de la imagen, certificados de resistencia ni planos ejecutivos. Las cotas elegidas son hipótesis que deberán confirmarse con el taller. Indicar también «Sin escala garantizada».
- Evitar cotas incongruentes: ancho/alto/fondo deben coincidir entre vistas. Para piezas cuya referencia sea insuficiente, señalar explícitamente la hipótesis geométrica y el aspecto que requiere validación. No inventar accesos de fontanería, anclajes, tolerancias, espesores resistentes ni prestaciones estructurales.
- Las categorías de encimeras, baldas y revestimientos deben presentar dimensiones **ejemplificativas de una unidad** y no fijar un formato universal por m²; para lavabo, indicar que el desagüe no está especificado.

## Entregables
- **21 archivos** `assets/catalogo/planos/<product_id>.png` (se entregan en un ZIP, sin subir a repo).
- `manifest_planos.json` con `product_id`, `path`, `width`, `height`, `size_bytes`, `sha256`, `dimensions_cm` (ancho, alto, fondo), `assumptions`, `reference_assets`, `review_status` para cada lámina.
- `contact_sheet.png` y `REVIEW.md`: cuadrícula de las 21 miniaturas y tabla con geometría, cotas propuestas, dudas, coherencia entre vistas y lista de pendientes.
- No recalcular ni modificar los 63 PNG de acabados existentes. No incluir datos personales o comerciales del taller.
- **Lotes de 3–5 productos para revisión visual**, comenzando por los siete modelos ya completos y sin bloquear los catorce conceptos restantes. SHA-256 por archivo y SHA-256 del ZIP final; no cambiar bytes tras calcular hash.

## Verificación previa a entrega
Comprobar **21/21 `product_id` únicos**, ficheros 1600×1200, tres vistas por lámina, unidades cm y avisos de provisionalidad; igualdad de ancho, alto y fondo entre alzado/planta/perfil; PNG decodificables; manifiesto coincidente y SHA-256 íntegros. Si un dibujo no cumple, marcarlo `PENDIENTE_REVISION`, **no** reportarlo como válido. No publicar ni pedir merges: la integración, QA GitHub y autorización de Pages se harán por separado.

## Contexto de integración
Existe una rama aislada `work/catalogo-vista-planos-tecnicos-20261012` que ya incorpora **«Plano técnico · alzado, planta y perfil»** como décima *opción de visualización* de los dos desplegables, pero sigue habiendo **9 piedras reales**. Mientras no haya un plano revisado, muestra «Plano técnico pendiente». El incorporador añadirá al mapa `approvedTechnicalDrawings` exclusivamente los archivos revisados y realizará QA. **Tu trabajo termina con los ZIP y manifiestos descargables.**
