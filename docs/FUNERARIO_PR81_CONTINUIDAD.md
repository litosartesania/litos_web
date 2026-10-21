# Continuación de PR81 · 20/10/2026

## Estado recuperable

Se conserva la organización de PR81: galerías dentro de cada categoría, navegación común y borrador de contacto por correo. PR79 no se duplica. El punto de recuperación `a50456e` ya está en la rama remota de PR81; el siguiente commit incorpora las validaciones y proporciones aquí descritas.

## Cambios reales

- Eliminada la colisión entre botones de galería y capas SVG (`data-motif-slot` / `data-slot`). La figura no desaparecía: una consulta encontraba el botón antes que la figura. La regresión comprueba unicidad y cambio de las tres técnicas.
- Tres complementos originales adicionales: florero cónico de acero, cilindro blanco y jarrón de granito. Transparencia real, materiales propios, miniaturas pequeñas y render completo bajo demanda. Se conservan los diez anteriores.
- Olivo figurativo grabado y cruz incisa alta de línea continua, ambos originales. El olivo funciona tanto como motivo principal como adicional, con espera y reintento antes de habilitar la exportación.
- Tres nuevas distribuciones: cruz alta a izquierda, cruz alta a derecha y árbol lateral. En ellas, el nombre parte de un 5,5 % de la altura de la cara y las fechas del 3,9 %, con reducción por ajuste de texto. Son proporciones visuales orientativas, no medidas tomadas en taller.
- Modelo blanco revisado: cruz sencilla, nombre ficticio en tres líneas, fechas en dos líneas y cono mural. Dos modelos adicionales: cruz derecha y olivo en granito. Total: **15 modelos comerciales genéricos, 12 distribuciones, 10 geometrías, 13 complementos, 59 motivos y 10 fuentes**.
- Galerías y constructores offline sincronizados; referencias al selector global antiguo eliminadas. Recursos públicos: 143 archivos identificados por hash, dentro del allowlist. Presupuesto funerario ampliado de 4,2 a 4,6 MB para los recursos nuevos; el paquete inicial embebido se mantiene alrededor de 1,51 MB.

## Evidencia y límites del archivo

Se revisaron las seis hojas de contacto de una clasificación de 202 entradas y una fotografía individual ampliada. Las entradas comprenden 88 fichas técnicas, 42 productos físicos, 30 detalles físicos, 13 referencias, 11 notas manuscritas, 9 croquis, 7 maquetas y 2 retratos. Una hoja de contacto **no equivale** a analizar y medir cada original por separado. La correspondencia entre referencias y modelos se conserva exclusivamente fuera del repositorio público.

No se ha copiado ningún original, nombre, fecha real, identificador de trabajo o enlace privado. Los modelos son recreaciones genéricas editables. La precisión dimensional, el tallado, las fijaciones y el suministro requieren validación del taller.

## Referencia externa y cobertura

Consulta pública: [accesorios](https://lapidasmadrid.es/accesorios/), [libros](https://lapidasmadrid.es/libros/), [cerámicas](https://lapidasmadrid.es/ceramicas/) e [inscripciones](https://lapidasmadrid.es/inscripciones/). Se identificaron respectivamente 22, 5, 6 y 14 imágenes de galería; son referencias de familias, no un inventario de LITOS ni un permiso para copiar sus fotografías.

| Familia observada | Estado en esta versión |
| --- | --- |
| Figuras religiosas y medallones | Ocho originales propios; grabado, tallado y aplique diferenciados |
| Floreros, búcaros, jardineras y piezas de luz | Trece complementos originales; dos posiciones independientes en la composición |
| Libros y pergaminos | Libro abierto vectorial original añadido; variantes volumétricas pendientes |
| Fotocerámicas y portafotos | Óvalo cerámico original con imagen temporal local y exportación en el dispositivo; catálogo ampliado pendiente |
| Inscripciones | Diez fuentes con licencia; no se afirma equivalencia con las tipografías comerciales ajenas |
| Nichos y columbarios | Geometrías propias existentes; pendiente comparación sistemática de esas dos galerías externas |

No se presenta la web externa como extraída por completo. Las imágenes y textos de terceros no se han incorporado a la web ni al repositorio.

## Validación local

- Build, allowlist, hashes, sintaxis JS y privacidad estática: PASS.
- Cinco páginas a 390/820/1440 px: PASS.
- Configurador y exportaciones PNG/SVG: PASS en 390/768/1440; vista autónoma sin solicitudes externas.
- Regresión: **2.400 combinaciones**, 15 presets, 13 complementos, 320/390/768/1440, cero errores y cero desbordamientos. Comprobación específica de proporciones y líneas del modelo blanco.
- Relieves: 72 combinaciones por ancho, tres piedras, tres técnicas; comparación del PNG con el visor inferior a un nivel RGB medio en la región revisada.
- HTTP: carga diferida y reintento tras fallo tanto de complemento como de árbol; descargas bloqueadas mientras falta el recurso completo. Texto del visitante sin solicitudes de red.
- Revisión visual de nuevas escenas y capturas móvil/escritorio guardadas en `preview/PR81-*.png`; vista navegable en `preview/LITOS_CONFIGURADOR_FUNERARIO.html`.
- Detector de diseño ejecutado: mantiene avisos heredados de tipografía pequeña, jerarquía de títulos y paleta. No se ha sustituido la identidad visual ni se declara una auditoría de accesibilidad completa.

## Bloqueos y siguiente avance

1. **Producción bloqueada** por identificación legal del responsable pendiente; `check-site.py _site --production` falla por el motivo esperado. No eliminar el gate ni fusionar esta PR para eludirlo.
2. Verificar CI del nuevo HEAD; la CI anterior no cubre estos archivos.
3. Ampliar variantes de libros y fotocerámicas y comprobar dimensiones y montajes con el taller.
4. Ampliar mediciones privadas por imagen y deduplicación; no convertir proporciones visuales en cotas de fabricación ni afirmar que todo el archivo ya está reproducido.

## 21/10/2026 — Pieza de libro

El avance posterior incorpora un **libro abierto vectorial original** como complemento de piedra. Se dibuja como pieza con lomo, páginas y cantos visibles, conserva controles de tamaño y posición y se incluye en el plano y la exportación. Nuevo modelo ficticio de inspiración, sin inscripciones reales. El catálogo queda en 16 modelos, 14 complementos y 144 recursos. La pieza es conceptual: volumen y montaje requieren validación de taller.

La CI del commit anterior `81f1723` terminó correctamente en la ejecución 39483744412. La CI del nuevo HEAD debe comprobarse por separado. El requisito legal de producción permanece bloqueado.

## 21/10/2026 — Dos complementos independientes

El configurador permite seleccionar un segundo complemento, con controles propios de tamaño y posición que recorren la cara completa. Ambos se representan en capas separadas, aparecen por separado en el plano acotado y se incluyen en la exportación. Se avisa si se solapan con texto o entre sí. Nuevo modelo genérico «Dos floreros laterales» con dos piezas originales de acero y datos ficticios. Total: **18 modelos, 15 complementos y 145 recursos públicos**. La fotocerámica local también puede ocupar la segunda posición sin cambiar la primera.

La captura local `preview/PR81-dos-floreros-canvas.png` confirma la composición visual; el archivo de previsualización se genera localmente y no es material de producción. Build, allowlist, sintaxis, regresión de 2.400 combinaciones y pruebas de exportación/carga local pasan. La fabricación, dimensiones reales y anclajes siguen pendientes de validación del taller. La producción permanece bloqueada por la identificación legal indicada en el relevo.

## 21/10/2026 — Fotocerámica local

Se añadió un óvalo de porcelana conceptual como pieza independiente y un modelo ficticio. La foto opcional se procesa solo en el navegador y se incluye en la descarga PNG del visitante; al quitarla o restablecer la composición desaparece de memoria. El recurso público es un óvalo vacío creado para LITOS. No se utilizan retratos históricos, terceros ni nombres propios. QA sintética en `scripts/qa-funerario-ceramic.py`, incluida en la PR.

Quedan **17 modelos, 15 complementos y 145 archivos públicos**. Su cerámica, impresión, anclaje, medidas y disponibilidad comercial requieren confirmación del taller.
