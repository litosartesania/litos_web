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
| Floreros, búcaros, jardineras y piezas de luz | Trece complementos originales; tres nuevos en esta continuación |
| Libros y pergaminos | Motivos vectoriales genéricos existentes; pendiente libro como objeto volumétrico y variantes |
| Fotocerámicas y portafotos | Pendiente catálogo específico y fotografía temporal local con exportación privada |
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
3. Completar fotocerámicas, libros volumétricos y varios complementos simultáneos, conservando el catálogo actual.
4. Ampliar mediciones privadas por imagen y deduplicación; no convertir proporciones visuales en cotas de fabricación ni afirmar que todo el archivo ya está reproducido.
