# LITOS COMERCIAL — PROJECT_CONTEXT.md
Última actualización: 2026-10-09

## Fuente canónica
Este paquete corresponde a la versión revisada y verificada de la web «Luz rasante» recuperada del ZIP original adjuntado directamente, **no a una reconstrucción**. ZIP fuente: `LITOS_CODIGO_REVISADO(1).zip`, SHA256 `738ee11596b1913f248ed38e8491e2be6fdf6c8e671d7190d69dadf7a935e792`.

## Repositorio y despliegue
Único repositorio autorizado: `litosartesania/litos_web`, cuenta `litosartesania`. Rama de trabajo remota: `work/luz-rasante-handoff-20261009`, PR borrador #1. La rama remota **todavía no contiene el código binario completo** por una limitación de transferencia del conector; el paquete ZIP descargable en la conversación preserva la revisión. `main` intacto. No auto-merge, no publicar sin revisar diseño, operación y privacidad. No modificar otros repositorios ni procesos.

## Características reales
Home editorial «Piedra para recordar. Piedra para habitar», arte funerario, mobiliario y objetos conceptuales, proyectos a medida, taller y contacto con `mailto:` manual. Assets locales WebP y SVG. Sin backend, cookies de seguimiento, Google Fonts ni formularios con envío silencioso. Materiales conceptuales expresamente identificados.

## Cambios de esta revisión
1. Mantener arte, contenido y recursos originales de Codex.
2. Corregir corte del subtítulo en hero desktop aumentando altura de la sección y validando sus bounding boxes.
3. Añadir navegación accesible con JavaScript deshabilitado (`noscript`).
4. Actualizar documentación y pruebas automáticas del hero.

## Pruebas ejecutadas
- `sh scripts/build-site.sh`: OK.
- `python3 scripts/check-site.py _site`: OK; 10 archivos autorizados, 612 KB aprox.
- `node --check script.js`: OK.
- `python3 scripts/visual-qa.py`: OK en 390×844, 820×1180, 1440×900.
- Auditoría adicional sin errores, sin overflow ni recortes en 320×640 y 1920×1080.
- `python3 scripts/check-site.py _site --production`: BLOQUEO CORRECTO por aviso legal provisional.

## Pendientes importantes
- Completar y validar aviso legal/RGPD, responsable del tratamiento y uso de email.
- Verificar procedencia, derechos y carácter conceptual de las imágenes.
- Confirmar alcance de servicios anunciados y el correo comercial.
- Subir íntegro el paquete revisado, incluidas imágenes, a la rama aislada y verificar los SHA; no usar GitHub Pages ni publicar la rama con materiales sensibles.
- Auditar en navegador real de usuario y obtener aprobación final antes de fusionar.

Consultar `AGENTS.md` y `docs/HANDOFF.md` para reglas de trabajo más completas.

## Actualización de la solicitud de publicación — 2026-10-09
- El propietario solicita publicar «Luz rasante», estudiar el mercado, agregar precios y eliminar del sitio la mención regional histórica.
- Se sustituyeron TODAS las menciones regionales del HTML y README, incluidos metadatos de buscador y footer, por una descripción del oficio sin localización.
- Rangos basados en fuentes públicas verificables, documentados en `docs/MARKET_STUDY_2026-10.md`. En la web son referencias **externas** y se aclara que NO son precios propios; no conocemos costes comerciales privados ni podemos fijar una tarifa rentable.
- Se preservan fuentes originales (Codex), estilos, imágenes y arquitectura estática sin pagos ni transmisión silenciosa de formulario.
- **Publicación bloqueada:** no hay información legal verificada de la persona/entidad titular ni domicilio de atención legal exigibles en España; evitar exponer identificadores personales/familiares sin consentimiento. `scripts/check-site.py _site --production` debe seguir fallando hasta completar y validar el texto legal. Además verificar derechos de imágenes y cargas al repositorio/CI. Se requiere transferencia íntegra de código e imágenes a GitHub por la rama exclusiva y validar PR antes de merge.

## 2026-10-09 — Integración cerrada en rama, producción bloqueada
- Se transfirieron todos los 20 archivos de la versión «Luz rasante» corregida (incluidas las imágenes WebP/SVG originales) a la rama segura en el commit `4b28d5de68937a8f7b6b64b0a7f1bee81e4b7fa4`. Los hashes Git de los 20 archivos coinciden con la copia local. La limitación de carga binaria documentada anteriormente quedó resuelta mediante Git Blobs y árbol Git.
- El estudio de precios se documentó en `docs/MARKET_STUDY_2026-10.md`. Los rangos de la web proceden de terceros y se identifican como referencias externas, no presupuestos de LITOS.
- Eliminada la referencia regional solicitada de HTML, metadatos, contenido y README. No implica borrar automáticamente el historial anterior del repositorio ni cachés de buscadores.
- Build/check-site/QA Playwright pasan; pruebas de 320 a 1920 px sin desbordes, seis rangos visibles, menú adaptado. CI de rama confirmada. `main` no se ha modificado.
- Sigue BLOQUEADO el despliegue porque la identidad legal/domicilio comercial de publicación y la información completa de privacidad NO están verificadas, al igual que los derechos de imágenes. No publicar datos personales sin autorización ni eliminar el bloqueo de `scripts/check-site.py --production` para simular legalidad.


## 2026-10-09 — Separación estricta por sensibilidad (última decisión)
- Usuario exige **vistas completas independientes**, no secciones mezcladas de una sola página. Home neutral (sin precios/catálogos), enlaces navegables a `funerario.html` y `mobiliario.html`.
- `funerario.html`: tres familias (lápidas, inscripciones, conmemorativos), solo precios externos funerarios, formulario mailto contextual.
- `mobiliario.html`: cuatro familias (mesas, lavabos, objetos, auxiliares), solo precios externos del sector, imágenes conceptuales correctamente identificadas y formulario propio.
- Sin enlaces cruzados entre especialidades, salvo regreso a `index.html`. Menús móviles y footer mantienen la separación.
- Build y preview allowlist incluyen tres documentos HTML; preview con formularios desactivados. Producción sigue BLOQUEADA por legalidad y derechos de imágenes, y requiere validación visual final.
- No se ha modificado `main`, ni otros repositorios o procesos. Cambio propuesto en el PR borrador #1; no fusionar.

## 2026-10-09 — Corrección del visor de ChatGPT (tres páginas)
- Captura de usuario: abrir `index.html` directamente desde el visor de archivos de ChatGPT mostraba página sin estilos e imágenes, porque el archivo HTML dependía de rutas relativas CSS/JS/asset que el visor no conserva. El HTML de producción de la rama no era la causa.
- Captura de GitHub Pages: la web antigua sigue publicada porque `main` se mantuvo deliberadamente intacto; el PR #1 es borrador, sin fusionar.
- Se añadió `tools/build-standalone.mjs` y su ejecución en el workflow de rama. Genera `preview/LITOS_PREVISUALIZACION_AUTONOMA.html` con imágenes/estilos integrados y navegación entre tres vistas completas desde un solo documento descargable. Se mantienen los tres HTML reales independientes en el sitio.
- Vista previa con formularios desactivados y sin servicios terceros. Revisión local con Chromium 390/820/1440 px: navegación completa, sin overflow, imágenes cargadas, solicitudes de red=0.
- El workflow adjunta el archivo HTML autónomo y la carpeta de previsualización, sin desplegar Pages ni actualizar `main`. No tratar la captura de la web antigua como prueba de fallo en la rama.
- Bloqueos de producción anteriores permanecen sin resolver: identidad/aviso legal, privacidad y derechos de imágenes. No publicar hasta completar esas verificaciones.

## 2026-10-09 — Control de calidad del artefacto autónomo
- La última ejecución de CI previa estaba correcta, pero validaba solo la generación del HTML autónomo, no su contenido.
- Se añade `scripts/check-preview.py` (Python estándar): exige las 3 vistas, imágenes CSS embebidas, ausencia de `script[src]` / imágenes remotas, formularios inhabilitados, rutas internas, `noindex` y todos los documentos de previsualización.
- `.github/workflows/branch-preview.yml` ejecuta esta comprobación **antes** de subir el ZIP de revisión.
- La previsualización autónoma es un artefacto **descargable**, no una URL web de producción ni un servicio de staging; la revisión se realiza sin transferir información de formularios.
- Pendiente para producción, sin autorización para fusionar: completar aviso legal y privacidad con datos validados fuera del repositorio público, verificar procedencia/derechos de imágenes y aprobación final del diseño. **El bloqueo `scripts/check-site.py _site --production` debe seguir activado.**

## 2026-10-09 — Confirmación de origen de imágenes por el usuario (prevalece sobre notas anteriores)
- El usuario confirmó expresamente: **«Las imágenes las generé yo»**. Las imágenes conceptuales incluidas en la versión Luz rasante deben considerarse **generadas por el propio usuario**, no material de origen desconocido ni fotografías de terceros obtenidas de internet. Es declaración del usuario; no es una auditoría independiente de cada recurso.
- Por tanto, **la mera duda sobre quién las generó deja de ser un bloqueo genérico**. No solicitar compras de licencias por defecto ni exigir fotos reales como requisito para la visualización conceptual.
- Mantener la distinción honesta entre renders/imágenes generadas y **obras fabricadas realmente por LITOS**; las imágenes generadas nunca deberán presentarse como piezas ejecutadas.
- Antes de producción, comprobar solo lo pertinente: que los recursos que efectivamente se utilicen correspondan al material generado por el usuario y que las condiciones de las herramientas de generación permitan el uso comercial previsto. Esta comprobación documental no presupone conflicto ni coste.
- **Los bloqueos vigentes de publicación siguen siendo** la validación de información legal/privacidad y la aprobación final de diseño, funcionamiento y contenido. Mantener el guard de producción y `main` intactos.


## 2026-10-09 — Legalidad/privacidad: preparación completa, identidad pendiente
- El usuario afirma que el proyecto y las imágenes son suyos. Esta declaración **no determina automáticamente el titular fiscal que factura** los servicios; no se ha confirmado si es persona física autónoma o sociedad. No asumir una identidad o un domicilio.
- Añadidos en rama: `aviso-legal.html` y `privacidad.html`, accesibles desde las tres vistas y entre sí, con estructura de aviso LSSI y descripción RGPD de consultas por email.
- Identificadores deliberadamente NO inventados: `[[PENDIENTE_TITULAR_FISCAL]]`, `[[PENDIENTE_NIF]]`, `[[PENDIENTE_DOMICILIO_PUBLICO]]`, `[[PENDIENTE_REGISTRO_SI_PROCEDE]]`. No publicar datos personales sin confirmar la titularidad, exactitud y necesidad.
- El pie de página deja de afirmar implícitamente que no se tratan datos: según GitHub Docs, GitHub Pages registra IP de los visitantes por seguridad. La web no envía campos del formulario en segundo plano; el visitante envía un correo voluntariamente y Gmail procesa los mensajes.
- El builder ahora incluye 5 HTML (3 comerciales y 2 legales), todos con sus enlaces comprobados. La vista autónoma incluye las 5 vistas, sin solicitudes externas automáticas ni envíos desde previsualización.
- `scripts/check-site.py _site --production` **rechaza marcadores fiscales y páginas legales provisionales**. No sustituir este gate por un "OK" ficticio.
- Estado del bloque legal: borradores técnicos completados, **faltan datos del prestador reales + revisión jurídica/final de privacidad del flujo de correo + aprobación final de publicación**. Los derechos sobre las imágenes generadas por el usuario ya no son un bloqueo genérico.
- Fuente oficial: https://lssi.digital.gob.es/lssi/la-ley/aspectos-basicos/obligaciones-y-responsabilidades-de-los-prestadores ; https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion ; https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- No se ha tocado `main` ni otros repositorios. Seguir sobre `work/luz-rasante-handoff-20261009` y PR borrador #1. 

## 2026-10-09 — Aclaración del usuario: LITOS todavía no emite facturas
- Declaración expresa del usuario: **«De momento no emite facturas»**. Registrar esto literalmente. **No implica por sí solo que LITOS carezca de actividad, que ningún otro titular facture los trabajos ni que opere legalmente a nombre del usuario**. No inventar titular fiscal o actividad económica.
- No publicar en la nueva web que LITOS ya vende o factura, ni presentar los precios externos como tarifas reales. Mantener los contenidos de mobiliario como conceptos y las imágenes como material generado por el usuario.
- Criterio LSSI verificado en FAQ oficial: https://lssi.digital.gob.es/lssi/la-ley/preguntas-frecuentes — una web empresarial informativa que anuncia servicios puede tener obligaciones incluso sin contratación en línea; una web puramente personal sin actividad económica se trata de manera distinta. **La ausencia actual de facturas no concede automáticamente una exención**.
- Falta una aclaración esencial del destino de futuras solicitudes: si la web será un escaparate conceptual sin aceptar encargos, si los encargos los atenderá/facturará un tercero existente, o si LITOS empezará una nueva actividad comercial propia. Determinar ese flujo antes de decidir qué identidad del prestador corresponde al aviso legal.
- Mantener la rama y PR borrador. No fusionar `main`, no publicar datos personales o familiares en el repositorio público, no fingir que el aviso legal está completo.


## 2026-10-09 — Norma de funcionamiento vigente: ESCAPARATE INFORMATIVO
- Declaración explícita del usuario: **«por ahora no aceptamos encargos»**; previamente había confirmado que LITOS todavía no emite facturas.
- En consecuencia, **no ofrecer ventas, pedidos, presupuestos, reservas de producción ni formularios para captar potenciales clientes**. Los textos no deben sugerir disponibilidad comercial presente.
- Las páginas `funerario.html` y `mobiliario.html` siguen siendo vistas independientes con sus imágenes conceptuales del usuario y precios **de terceros únicamente informativos**, nunca importes facturables de LITOS.
- Portada y cada especialidad declaran inequívocamente la situación «no aceptamos encargos». Los antiguos formularios, manejadores JS de mailto y CTA para solicitar presupuesto se retiran. Solo el contacto de finalidad legal/privacidad permanece en documentos legales.
- `privacidad.html` y `aviso-legal.html` reflejan la ausencia de captación comercial. GitHub Pages sigue tratando datos técnicos como IP de visitantes según documentación del proveedor.
- CI comprueba que no quedan formularios ni CTA comerciales y que las cinco vistas están enlazadas; se mantiene prueba independiente de que `--production` rechaza los campos legales provisionales.
- **NO fusionar ni publicar en producción:** el aviso legal sigue necesitando identificar con exactitud al responsable del sitio si jurídicamente corresponde. La declaración «sin facturas ni encargos» no constituye por sí sola una exención automática de la LSSI.
- Solo repositorio `litosartesania/litos_web` y rama `work/luz-rasante-handoff-20261009`. Ninguna modificación a `main`, ni a otros repositorios ni procesos. Preservar servicios gratuitos y privacidad familiar/comercial.


## 2026-10-09 — Decisión de sustituir web pública: versión NO comercial
- El propietario ordena expresamente **«PROCEDE, SUSTITUYELA»** para reemplazar la web antigua. La autorización se refiere exclusivamente a la versión «Luz rasante» como escaparate informativo.
- Declaraciones vigentes: el usuario generó personalmente las imágenes; LITOS actualmente no factura ni acepta encargos. Se conserva la arquitectura de tres páginas: portada y especialidades funeraria/mobiliario separadas.
- Antes de desplegar se sustituyeron los dos avisos legales provisionales: ya **no se inventan nombres, NIF ni domicilios** ni se muestran marcadores pendientes. Se explica la fase personal de presentación, ausencia de monetización y de solicitudes, los enlaces a terceros y el tratamiento de direcciones IP que GitHub Pages realiza por seguridad. Se eliminan los enlaces `mailto:` de los avisos para evitar captación accidental.
- La excepción LSSI para páginas personales sin actividad económica se apoya en el criterio oficial https://lssi.digital.gob.es/lssi/la-ley/preguntas-frecuentes . **Si se utiliza para promocionar un taller/empresa con actividad económica, incluso sin pedidos en línea, debe revisarse la identificación legal y fiscal exigible.** No dar por resuelta esa futura situación.
- El guard `scripts/check-site.py _site --production` se mantiene y se refuerza: sin campos fiscales ficticios, sin formularios ni `mailto:`, sin anuncios remunerados ni captación, con transparencia técnica de GitHub. La rama `work/luz-rasante-handoff-20261009` ejecuta también QA real de navegador en 390/820/1440 px y cinco páginas. El workflow Pages hará lo mismo **antes** del despliegue.
- Una vez todas las pruebas pasen, la orden explícita del usuario autoriza revisar el PR y fusionar a `main`, **pero solo** para este escaparate limitado. Documentar SHA final y URL de despliegue verificada.
- No tocar otros repositorios, bases de datos, procesos internos ni servicios de pago; preservación de privacidad de familiares, clientes y negocio.

## 2026-10-09 — Nuevas imágenes recuperadas y precios puntuales
- Las 12 imágenes originales de mobiliario se recuperaron **de los archivos que el usuario ya había generado en esta misma conversación**, sin generar ninguna nueva. Representan seis familias, dos variantes cada una: mesa comedor, mesa centro, consola, banco, lavabo pedestal y mesa auxiliar.
- Originales PNG y 12 WebP optimizados en la Biblioteca privada: `/LITOS_COMERCIAL/MOBILIARIO_2026_10_09`. La imagen `collage_precio.png` es solo un boceto de diseño, no un estudio de precios verificable.
- Los 12 WebP públicos (~710 KB en conjunto) se incorporan a `assets/catalogo`. Catálogo de mobiliario pasa a seis fichas con 2 imágenes cada una, render conceptual explícito y valor **único orientativo de mercado** por familia, acompañado de fuente pública enlazada.
- Precios no son tarifas ni ofertas de LITOS y no implican que el taller pueda fabricar esas piezas con sus recursos actuales; las piezas de torno, vaciado o curvado requieren análisis de maquinaria, técnicas y viabilidad antes de aceptar encargos.
- No se modificó el arte funerario ni se introdujeron formularios o captación comercial. Actualizados builder de Pages, guard de publicación, preview autónoma y QA visual para cubrir los 12 archivos.

## 2026-10-09 — Catálogo ampliado y selector de piedra (última arquitectura)
- Nuevo requerimiento usuario: hay demasiadas pocas familias/materiales; quiere elegir material y que cambie el **precio puntual estimado de mercado**. Continúa prohibido aceptar encargos, precios vinculantes o generar nuevas imágenes sin pedirlo.
- `mobiliario.html` añade selector de **8 piedras** y filtros por seis categorías. `catalogo-precios.js` renderiza **21 modelos** (incluidos seis originales con las mismas 12 imágenes) y cambia precios localmente, sin red, cookies, bases de datos ni formularios.
- Se conservan las 12 imágenes WebP de `assets/catalogo`. Para los modelos nuevos sin render se usa una tarjeta abstracta etiquetada «Propuesta sin imagen propia», no una imagen engañosa. Cambiar material NO cambia la piedra mostrada por fotos existentes.
- Índices: Travertino 70 €/m², Campaspero 50 €/m², Blanco Macael 97 €/m², Carrara 120 €/m², Marquina 125 €/m² (extrapolación), granito gris 65 €/m², cuarcita común 55 €/m², Calacatta Gold 221 €/m². Cada variante incluye enlace a su fuente de material; fuentes consultadas octubre 2026. El mercado es mucho más heterogéneo, especialmente para piezas monolíticas.
- Fórmula **ilustrativa**, nunca presupuesto: `precio_base_de_tercero × (0.70 + 0.30 × (índice_piedra/70))`, redondeado a 10 €. El 30 % es una **suposición de sensibilidad**, no un coste constatado. Los índices provienen sobre todo de placas, baldosas y revestimientos; **no** sirven para calcular viabilidad, bloques macizos, mano de obra, maquinaria, desperdicio, gastos ni precio LITOS.
- Fuente índice materiales: https://preciom2.com/guias/revestimientos/piedra-natural/ ; https://canustone.com/ ; https://interpiedrahispanica.es/wp-content/uploads/2025/05/TARIFA-BLANCO-MACAEL-MADRID-FEBRERO-2025.pdf ; https://www.tiendadelmarmol.com/es/piedranatural/marmol-lujo-calacatta-gold-precio-m2 . Por cada modelo se ofrece un enlace a un producto/categoría externo, señalando si es extrapolación.
- Build Pages, auditor de archivos, QA responsive (390/820/1440 con cambio de selección y filtros) y HTML autónomo actualizados para `catalogo-precios.js`. Mantener los guard de privacidad y solo presentación, sin interferir en arte funerario ni otros repositorios.


## 2026-10-09 — Arreglo de elección de material en el visor móvil; añadir Mármol Verde Alpi
- Captura del usuario: selector mostraba `Granito gris` y su swatch, mientras las fotos beige permanecían idénticas. La versión anterior **solo cambiaba precios y muestras**, no la representación de imagen. Usuario solicita expresamente que la selección tenga efecto visual y se incorpore mármol verde.
- Solución sin generar imágenes nuevas: estilos CSS `--stone-photo-filter`, `--stone-preview-tint`, `--stone-preview-opacity` cambian perceptiblemente las fotos existentes; granito pasa a tonos grises y `verde-alpi` pasa a una simulación verde. El filtro colorea **toda la foto, incluido el entorno**; se indica explícitamente que NO reproduce vetas/textura de mármol ni garantiza resultado real. Imagenes originales permanecen sin modificar.
- El círculo de muestra ahora es un botón accesible que intenta abrir el selector nativo; se admite teclado y Safari/iOS con fallback.
- Nuevo material `verde-alpi`, Mármol Verde Alpi natural, coste índice **262 €/m²**, de baldosa de 1 cm de Colour of Stone: https://colourofstone.com/es/shop/piedra-natural/azulejos/verde-alpi/ (precio de referencia 261,80 €/m² en octubre 2026). Es índice de revestimiento, NO tarifa de bloque escultórico o coste real del taller.
- Se mantiene fórmula previa de sensibilidad hipotética del 30 %, 21 productos, separación funeraria, ausencia de formularios/encargos, uso gratuito y privacidad.
- Nuevas pruebas responsive verifican 9 opciones, precio en granito vs mármol verde, valores visuales CSS realmente cambiantes, etiquetas honestas de simulación y fuente verde. No publicar hasta CI completa.


## 2026-10-09 — Corrección inmediata propuesta para la web pública (PR #5)
- La captura mostraba las imágenes de todo el salón teñidas de verde cuando el selector elegía Mármol Verde Alpi. Se comprobó que `main` todavía contenía `--stone-photo-filter` y `--stone-preview-tint`; el cambio anterior existía solo en una rama, por lo que GitHub Pages no lo había publicado.
- Se creó `work/hotfix-material-sin-tintado-20261009` desde el `main` actual, sin arrastrar experimentos de imágenes o documentación de otras ramas.
- Solo cuatro ficheros de código/pruebas cambiados: `catalogo-precios.js`, `styles.css`, `scripts/check-site.py` y `scripts/visual-qa.py`. Se elimina todo tintado del entorno fotográfico.
- La tarjeta de cada material seleccionado muestra `Vista no disponible para este material` si no hay imagen específica **aprobada**. Las doce imágenes de seis familias siguen visibles en `Ver concepto original (piedra no verificada)`, separadas del selector y sin alteraciones.
- Se conservan las 21 propuestas, nueve materiales, precios orientativos externos, ausencia de compras, formularios y nuevos servicios de pago.
- **Limitación conocida:** el HTML fuente heredado aún contiene texto antiguo sobre simulaciones. El CSS lo oculta y el JS lo reemplaza inmediatamente por texto preciso. Conviene corregir el HTML de origen en una edición posterior autorizada, porque sin JS se omite ese párrafo.
- PR de corrección: https://github.com/litosartesania/litos_web/pull/5. **No afirmar despliegue hasta verificar QA y GitHub Pages**.
- El lote de treinta variantes sigue sin imágenes específicas aprobadas; el hotfix no las inventa ni las publica.


## 2026-10-09 — Hotfix 2: texto fuente y caché real de GitHub Pages
- Tras el PR #5 (commit `eb04bdb6`, Actions SUCCESS) el usuario seguía viendo fotos teñidas y el texto de simulación en `mobiliario.html#catalogo`.
- Hallazgo verificable: `main` conservaba **en el HTML fuente** «simulación digital de tonalidad» y enlaces sin versión (`styles.css` y `catalogo-precios.js`). El nuevo JS/CSS sí estaba en Git, pero el navegador/CDN aún podía servir recursos antiguos.
- Rama de arreglo `work/fix-material-cache-20261009` creada desde `main`, sin tocar otros repositorios o información interna.
- El texto engañoso se reemplaza **en el HTML, también sin JavaScript**; se elimina `visibility:hidden` que ocultaba el texto antiguo hasta la carga del JS.
- `mobiliario.html` incorpora referencias versionadas `styles.css?v=stone-20261009-2` y `catalogo-precios.js?v=stone-20261009-2`. Conserva URLs locales estáticas y GitHub Pages gratuito.
- `scripts/visual-qa.py`, `tools/build-standalone.mjs` y `scripts/check-site.py` adaptados a las URLs con query, con aserciones contra la copia obsoleta.
- `scripts/check-live-deployment.py` y workflow Pages: después del despliegue, se comprueba **directamente la URL pública**, incluyendo que entrega el HTML correcto y CSS/JS sin tintados, con parámetros de cache busting y reintentos por propagación.
- Sin render nuevo aprobado para Verde Alpi ni otros materiales: se debe mostrar «Vista no disponible para este material» con fotos originales como **referencia conceptual aparte**, nunca pintadas como si fueran otra piedra.
- No afirmar que se publicó hasta aprobar la CI de PR, fusionar el hotfix y obtener el resultado de comprobación pública del workflow. Mantener guard de no venta/no captación, privacidad y separación funeraria.


## 2026-10-09 — Restauración de la galería visual sin falsear piedras
- **Motivo:** nueva captura tras corregir el tintado: los 21 productos mostraban grandes casillas vacías «Vista no disponible para este material», y las **12 imágenes conceptuales originales** (seis modelos × dos escenas) estaban detrás de un desplegable. Se perdía el valor visual del catálogo.
- **Solución:** rama aislada `work/recuperar-fotos-catalogo-20261009` derivada de `main`. En los seis modelos que ya cuentan con imágenes, sus dos originales se muestran directamente en la galería con franja «Referencias visuales originales» y texto actualizado dinámicamente «No son una vista en [material]; la imagen específica de esta piedra está pendiente». Los otros 15 conceptos conservan un aviso más compacto de ausencia de imagen propia.
- **Reglas:** ninguna foto se cambia de color ni se presenta como foto auténtica de la piedra seleccionada. Una imagen por combinación `producto__material` solamente se mostrará cuando `approvedVariants` contenga la variante validada; de momento sigue vacío, **0/30** variantes del lote aprobadas. Las dos escenas por modelo son contenido conceptual existente (12 imágenes) y **no evidencia de fabricación o disponibilidad**.
- **UX:** todas las tarjetas mantienen nombre, categorías, estimación orientativa, fuente externa, materiales seleccionables y swatch. El usuario puede ver las seis familias de inmediato sin desplegar fotos ni mirar un bloque vacío. La selección de piedra modifica textos y cifras, no los píxeles del salón.
- **Archivos:** `catalogo-precios.js`, `styles.css`, `mobiliario.html`, pruebas estáticas y responsive, y comprobación de la URL pública. URLs CSS y JS versionadas `stone-20261009-3` para invalidar versiones previas en caché. No se alteran repositorios ajenos, secciones funerarias, servicios, permisos ni datos personales.
- **Validación pendiente** hasta completar CI del PR: 12 fotos visibles, 15 propuestas sin foto, cambio de piedra con imágenes inmutables, ausencia de tintado, no overflow y audit completo en 390/820/1440 px. No publicar sin controles satisfactorios y posterior confirmación contra URL real de GitHub Pages.

## 2026-10-11 — Lote de 10 PNG aportados por el usuario, consola y banco (11:36)
- Objetivo: registrar **solo las primeras diez imágenes** del nuevo envío: cinco variaciones de `consola-esc` y cinco de `banco-esc`, cada una en travertino, Blanco Macael, Verde Alpi, granito gris y Negro Marquina. Archivos originales PNG RGBA 1122×1402 px. No regenerar, alterar píxeles, aplicar máscaras, ajustar piedras ni recomprimir.
- Archivos **del envío actual**: diez PNG distintos, con nombres definidos `assets/catalogo/variantes/<producto>__<material>.png`. Huellas exactas SHA-256 y tamaño en `docs/LOTE_10_IMAGENES_20261011.json`. Estas huellas corresponden al envío de 11:36, que no se debe confundir con lotes previos de nombres similares; preservar sin sobrescribir hasta confirmar identidad.
- Rama `work/catalogo-consola-banco-10png-20261011` creada desde `main`; la conexión verificada con GitHub tiene permisos administrativos como `litosartesania`. Manifest, README, comprobador `scripts/verify-litos-10-png.py` y workflow dedicado añadidos sin cambiar `main`, `catalogo-precios.js` ni producción.
- **Bloqueo real: los diez PNG todavía no están en GitHub.** El conector disponible escribe texto GitHub y objetos Git pero no admite referencia de archivo binario local, mientras el contenedor con los PNG no tiene acceso de red/credenciales a GitHub. No confundir un SHA catalogado con un blob efectivamente subido.
- Se entregó `LITOS_10_CONSOLA_BANCO_ETIQUETADAS_20261011.zip` con los diez PNG exactos y manifiesto. La subida pendiente puede hacerse desde el Mac en la rama especificada vía GitHub web `Add file > Upload files`, seleccionando los 10 PNG extraídos. Cada PNG cabe en el límite de subida web. No cargar el ZIP directamente.
- La acción `LITOS · Verificar 10 imágenes de consola y banco` comprobará hashes SHA-256, tamaño, dimensiones y PNG real; **solo declarar subida íntegra tras comprobar 10/10 en remoto y workflow verde**.
- Las imágenes representan conceptos generados por IA y no acreditan obras ya ejecutadas. GitHub es **público**, incluso ramas: solo se autoriza contenido comercial preparado y etiquetado, sin datos de clientes/familia/operativa.
- Mantener `approvedVariants` sin activar, no publicar en Pages, no usar rama anterior con las 10 texturas procedurales rechazadas. Continuar con otros productos solo tras consolidar este primer lote.

## 2026-10-11 16:30 — Diez imágenes originales RECEPCIONADAS Y VERIFICADAS
- El usuario subió los 10 PNG de consola y banco al repo `litosartesania/litos_web` en rama `work/catalogo-consola-banco-10png-20261011`, inicialmente en `assets/catalogo/` en vez de `assets/catalogo/variantes/`.
- Se verificaron sus diez objetos Git SHA-1 contra el ZIP original aportado por el usuario: **coincidencia 10/10 de bytes originales**; medidas 1122×1402; sin reformatear ni recomprimir. Se reubicaron los diez blobs por SHA en el árbol Git a las rutas canónicas `assets/catalogo/variantes/`; commit `50d31be7042c4e545f16cf16ddea2ef4f5d97f78`. No quedaron duplicados en la carpeta anterior.
- GitHub Actions `LITOS · Verificar 10 imágenes de consola y banco` terminó **SUCCESS**: https://github.com/litosartesania/litos_web/actions/runs/38147236466. El bloqueo de subida documentado previamente queda **resuelto**.
- Se creó un visor HTML independiente de `mobiliario.html`, `review/lote10-consola-banco.html`, que muestra las imágenes recibidas por producto/material. No aplica filtros ni simulación digital de piedra. Se añadió compilador/test de paquete offline (`scripts/build-litos-10-review.py`, `scripts/check-litos-10-review.py`) y workflow `review-litos-10-originals.yml`, que solo sube artefacto de revisión, **no GitHub Pages**.
- La rama conserva `catalogo-precios.js` sin cambios y `approvedVariants={}`: **el catálogo real de producción aún NO cambia**; la revisión del lote requiere aprobación visual. Ninguna fotografía se presenta como trabajo realmente ejecutado ni como material natural certificado.
- Para el relevo: revisar/verificar workflow de vista previa y su artefacto, inspeccionar las cinco selecciones visualmente, y después integrar en catálogo en rama aislada con QA responsive/privacidad, SIN MERGE NI PRODUCCIÓN sin aprobación. No interferir con PR #8 (texturas procedurales rechazadas).

## 2026-10-11 16:40 — Vista previa navegable de catálogo real, validada (sin despliegue)
- Como continuación del lote 10/10 verificado, se generó en Actions una **copia aislada del catálogo real**, sin modificar los ficheros fuente del sitio web en la rama: `review-package/site/mobiliario.html`. La generación está en `scripts/build-litos-10-site-preview.py`, que replica la web existente y activa **solo en esa copia** las diez rutas PNG en `approvedVariants`, adaptando su extensión y dimensiones sin alterar píxeles.
- Se añadió QA de estática y privacidad (`scripts/check-litos-10-site-preview.py`) y pruebas de navegador Chromium (`scripts/visual-qa-10-site-preview.py`) a 390, 820 y 1440 px, seleccionando las cinco piedras en consola y banco; imagen real 1122×1402, sin filtro CSS, 21 fichas, 15 conceptos pendientes, sin formularios ni errores JS. **ÉXITO:** https://github.com/litosartesania/litos_web/actions/runs/38147856989.
- La auditoría general de cinco páginas, privacidad y presentación existente también terminó **SUCCESS** en https://github.com/litosartesania/litos_web/actions/runs/38147860153.
- Se adjunta ZIP `LITOS_VISTA_PREVIA_10_ORIGINALES_20261011.zip` a la conversación: extraerlo y abrir `site/mobiliario.html` para comprobar la web real o `index.html` para comparar los dos productos. El archivo descargado contiene copias exactas de los 10 PNG y no incorpora seguimiento externo.
- PR de revisión **borrador #9**: https://github.com/litosartesania/litos_web/pull/9. No fusionar, activar en producción ni actualizar `main` hasta aprobación estética y legal. Mantener rechazo de las texturas procedurales anteriores (#8).
- Estado: binarios seguros en GitHub rama pública, integridad verificada, **previsualización validada**, integración fuente `catalogo-precios.js` aún no activada. Antes de publicación real, activar las rutas en código fuente de rama aislada y actualizar allowlist Pages/check-site/QA; revisar impacto de carga de PNG (≈32 MB) y optimizaciones sin pérdida perceptible, con copia original intacta.


## 2026-10-11 — Integración de diez variantes en la rama de revisión; NO en producción
- Repositorio exclusivo litosartesania/litos_web; rama work/catalogo-consola-banco-10png-20261011. PR borrador #9: https://github.com/litosartesania/litos_web/pull/9. main no se modifica.
- Los diez PNG originales 1122×1402 se alojan únicamente en assets/catalogo/variantes/ y figuran en docs/LOTE_10_IMAGENES_20261011.json. SHA-256, tamaño y dimensiones 10/10 confirmados previamente en https://github.com/litosartesania/litos_web/actions/runs/38147236466. No se generan, comprimen, filtran ni recolorean archivos.
- catalogo-precios.js: mapa de 10 parejas producto-piedra (consola-esc, banco-esc × travertino, macael, verde-alpi, granito, marquina). Se preservan 21 modelos, nueve materiales, las 12 imágenes originales WebP, filtros y fórmula de precio externo; otros productos conservan sus referencias o avisos de falta de imagen.
- scripts/build-site.sh copia literalmente los diez PNG a _site; scripts/check-site.py verifica SHA-256 de cada copia contra el manifiesto y mantiene controles de 5 vistas, privacidad y guard de producción. styles.css usa proporción 1122/1402, object-fit:contain y filter:none para impedir distorsión o falso color. Pruebas en Chromium adaptadas.
- Vista previa completa descargable en el artefacto de la acción LITOS · Revisar 10 originales sin desplegar (archivo review-package/site/mobiliario.html). El antiguo visor HTML autónomo permanece como muestra general con WebP sin diez PNG para evitar un único HTML de más de 40 MB: no es la vista de validación de materiales.
- Estado al preparar commit: pruebas GitHub Actions del commit de integración PENDIENTES. NO declarar integración validada hasta confirmar ejecuciones SUCCESS. No desplegar ni fusionar sin aprobación visual, técnica, jurídica/comercial y privacidad. PR #8 rechazado permanece excluido.
- Riesgo técnico: los 10 PNG suman unos 32 MB; evaluar carga móvil. No contratar servicios de pago ni incluir datos internos.

SHA-256 originales por archivo (también registrados en el manifiesto):

| Producto | Piedra | SHA-256 original |
|---|---|---|
| consola-esc | travertino | ba0b853df05fe4a42b76b4216d19aeefd0797154af8e720327b01106c98327cf |
| consola-esc | macael | ccb8b24242290c2cb64cedbb4bd7c25c4179172f4205ef3f45f21f6221227973 |
| consola-esc | verde-alpi | e5815d2ae79f5a017535935fa67d64e6c9e3a21fce8637b08b43811277aff5e6 |
| consola-esc | granito | efb24019a8151c2d5ad7085c8299797e04f3739f336f6e83da00514ac222e22c |
| consola-esc | marquina | a4698ed0d0b24657732ae3b083cf7af2a86a5496728f0c44477c0041f6599b67 |
| banco-esc | travertino | 463e76180ea4c00d87d62c3b78f0413f2a7d1169608f475b17c5343dd12be35f |
| banco-esc | macael | 76fc23e41c5a13e16e5b5ad03bddd14e8955d298b7aae8d780246d4b772b3b3c |
| banco-esc | verde-alpi | efdf2634d369ffdf37b50faf447816022b4a92d3a8496b7b43ad492e08441b41 |
| banco-esc | granito | e6e159b5dde97962387b0d7e7ebe3bb157fdbf869f2c468916bffef055eef035 |
| banco-esc | marquina | eeb4f4b4586d2f182293bf863d67018d4d18cf207edbd0d04e88b74ba090474a |


## 2026-10-11 — Cierre técnico verificado: CI verde; publicación retenida
- Commit de código fuente e integración: 20ebe328aa03fc6629334d1b8a6eac8a03a56314. Ajuste posterior de aserción de QA: 1f50a213f89fc3c94fd2b04496671d8e2c5c0720. La rama conserva todos los 10 PNG intactos, como muestran SHA Git y tamaños idénticos entre árboles previo y posterior.
- Acciones del commit final: auditoría general de 5 vistas, JavaScript, build allowlist, privacidad, guard de publicación y Chromium responsive (390/820/1440): SUCCESS https://github.com/litosartesania/litos_web/actions/runs/38150455480 ; verificación 10 PNG SHA-256 + review copy + selección 5 piedras en banco y consola en tres tamaños: SUCCESS https://github.com/litosartesania/litos_web/actions/runs/38150452502 .
- Previsualización completa navegable: descargar artefacto litos-10-originales-vista-previa de la segunda acción y abrir site/mobiliario.html (incluye también index.html y otras vistas). La vista previa no está desplegada en ninguna URL pública; los archivos originales sí están en la rama pública de GitHub.
- PR borrador #9: https://github.com/litosartesania/litos_web/pull/9 . No fusionado, no se modifica main, no se ejecuta deploy Pages. Única aprobación pendiente: inspección estética humana y autorización explícita antes de cualquier publicación, además de la revisión legal/privacidad asociada al uso comercial futuro.
- Riesgo de rendimiento: paquete con diez PNG adicionales (~32 MB). Mantener originales sin comprimir durante la revisión. Si se exige optimización de red futura, plantear una entrega derivada separada conservando los originales y solo con autorización.


## 2026-10-11 — Autorización expresa de publicación (fase de liberación)
- El propietario revisó las capturas y la vista previa del selector y escribió «Tiene buena pinta, publícalo». Autoriza exclusivamente publicar este catálogo conceptual de consola y banco con los 10 PNG originales. Mantener la condición informativa: sin aceptar encargos, sin alterar cálculos, ni exponer información personal, familiar o comercial interna.
- Último test de revisión sobre rama autorizada: GitHub Actions 38152576101 (10 originales + navegación responsive 390/820/1440 + syntax-check del comprobador de Pages) y 38152578674 (auditoría general, cinco páginas, privacidad y guard de publicación): ambos SUCCESS. No se modificó ninguno de los PNG ni se incluyó PR #8.
- Reparado scripts/check-live-deployment.py para exigir textos/rutas versionadas vigentes y validar en la URL pública los 10 originales por tamaño y SHA-256. La publicación no se considera realizada hasta fusionar PR #9, completar Pages y comprobar en GitHub el despliegue, su URL y los hashes HTTP.
- Los originales siguen siendo imágenes conceptuales; no se consideran fabricación ni oferta. Riesgo aceptado para esta publicación: ~32 MB en 10 archivos PNG (carga inicial de las variantes seleccionadas, no necesariamente todos los archivos); revisar rendimiento en conexiones móviles posteriormente sin sustituir originales sin autorización.


## 2026-10-11 — Lote segundo (8 PNG): integración aislada en preparación
- ZIP reenviado por usuario verificado localmente 8/8: SHA-256 y dimensiones 1122×1402; Caliza Campaspero, Carrara, Cuarcita, Calacatta Gold × consola escultórica y banco escultórico.
- Rama exclusiva `work/catalogo-consola-banco-18png-20261011` creada desde `main` 49d11abab406d19d802ce43ed512682efbddc9d3. No modificar `main`, Pages ni otros procesos/repo. PR borrador, no publicar sin nueva autorización.
- Pendiente transferencia de los ocho binarios: herramienta GitHub actual no importa adjuntos del sandbox. Workflow seguro `materialize-litos-8-zip.yml` admite subir **solo el ZIP original** al directorio `transfer/` de ESTA rama; script verifica hashes, formato, ruta, dimensiones y tamaño antes de materializar los 8 PNG, elimina ZIP y empuja al branch, nunca `main`.
- Código configura 18 combinaciones (10 existentes intactas + 8 pendientes), 9 materiales por dos piezas, controles de integridad y de build responsive. Si faltan binarios, verificaciones FALLAN intencionadamente; no interpretar como éxito. 21 productos restantes y fórmulas de precios preservados. 0 € adicionales; privacidad sin alteraciones.


## 2026-10-11 — Tabla canónica de progreso del catálogo
- Matriz completa de los 21 productos × 9 materiales en `docs/PROGRESO_CATALOGO.md`. Criterio del propietario: `HECHO` significa exclusivamente imagen específica publicada y funcionando en la web pública, no aprobada en revisión.
- Al cierre de esta revisión: 10/189 publicados y verificados en Pages; 8/189 imágenes del segundo lote aprobadas visualmente en la conversación, verificadas 18/18 en rama aislada PR #10 y pendientes de publicar; 171/189 combinaciones sin variante específica preparada.
- La aprobación visual del usuario («ok, esta bien; actualiza la tabla de progreso») no incluye una instrucción expresa para fusionar o desplegar. Se conserva PR #10 en borrador, `main` y Pages con 10 variantes.
- Actualizar la matriz a 18/189 solamente después de publicación autorizada y prueba HTTP/SHA-256 del nuevo despliegue. Controles, privacidad y 0 € de coste adicional permanecen obligatorios.
