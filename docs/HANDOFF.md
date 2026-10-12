# LITOS Comercial — handoff ChatGPT ↔ Codex

## Estado a 2026-10-08

- Objetivo: sustituir la web antigua por «Luz rasante», con dos recorridos honestos (arte funerario y proyectos a medida); fotos conceptuales señaladas como tales.
- Fuente recuperada: ZIP que conserva cambios sin commit de Codex sobre `codex/commercial-prototype` (commit previo `bfd40e1`); remoto `main` en `c449012`. No asumir que estos cambios ya están subidos.
- Se trabaja **solo** en `litosartesania/litos_web`. Sin cambios a LITOS interno.
- Conexión GitHub actual de ChatGPT: cuenta diferente de la marca, con lectura pero sin escritura en este repositorio a fecha de revisión. Hace falta autorización de `litosartesania` antes de abrir rama/PR. No cambiar conexiones de otros proyectos a ciegas.

## Cambios de seguridad y calidad en esta iteración

- Se elimina Google Forms oculto y su falsa confirmación de recepción. El formulario compone un `mailto:` sin enviar información automáticamente. Es importante informar de la limitación: el visitante debe abrir y enviar el correo.
- Se eliminan solicitudes a Google Fonts para evitar transferencia innecesaria de IP a un tercero; se usan tipografías de sistema.
- Se mejora el menú móvil: `inert` para contenido al abrir, gestión de foco/Escape, cierre ante cambio a escritorio.
- Imágenes con dimensiones HTML para reducir cambios de maquetación; metadatos canonical/OpenGraph.
- GitHub Pages despliega solo 10 archivos permitidos de `_site/`. Quedan fuera documentos, prototipos e imágenes antiguas.
- La publicación tiene un bloqueo deliberado: `scripts/check-site.py _site --production` falla si sigue el aviso legal provisional. No eliminar este bloqueo antes de validar el texto legal.
- Pruebas estáticas: `sh scripts/build-site.sh && python3 scripts/check-site.py _site && node --check script.js`.

## Bloqueos antes de publicación en producción

1. **Acceso GitHub** con escritura bajo cuenta `litosartesania`; no existe en la conexión actual de ChatGPT.
2. Revisar información legal/RGPD completa, identidad legal del responsable del tratamiento, contacto y detalles de procesamiento de correos. El footer actual es un AVISO PROVISIONAL y no una política legal lista.
3. Confirmar que el correo de contacto público es el deseado.
4. Revisar visualmente iPhone, iPad y escritorio con las fuentes de sistema; probar navegación y formulario SIN enviar datos reales.
5. Confirmar que el usuario autoriza sustituir la web pública. Mantener `main` intacto hasta entonces.
6. Sustituir conceptos visuales por fotos verificadas cuando estén disponibles (o mantener la etiqueta explícita de concepto).

## Siguiente paso

- Con permiso de escritura, crear rama de revisión desde el SHA remoto actual, aplicar los cambios recuperados y auditados, abrir PR para inspección; no mergear a `main` antes de los bloqueos.
- Mantener este handoff actualizado sin incluir datos privados de taller o familia.


## Actualización comprobada — 2026-10-09

- **GitHub:** acceso de administrador con la cuenta correcta `litosartesania` confirmado. Rama segura existente: `work/luz-rasante-handoff-20261009`, PR borrador #1, `main` sin cambios. Las referencias anteriores a que falta permiso de GitHub están obsoletas.
- **Código:** este paquete procede del ZIP original `LITOS_CODIGO_REVISADO(1).zip`, SHA256 `738ee11596b1913f248ed38e8491e2be6fdf6c8e671d7190d69dadf7a935e792`. No se ha reconstruido el diseño, sino corregido el original.
- **Mejoras posteriores al ZIP de Codex:** altura hero corregida para evitar subtítulo recortado en escritorio; navegación sin JavaScript para pantallas pequeñas; test de límites geométricos del hero.
- **QA:** build y auditoría estática pasan, JS syntax pasa, Playwright móvil (390x844), tableta (820x1180) y desktop (1440x900) pasan; test adicional 320x640 y 1920x1080 (sin desbordamiento ni subtítulo cortado); fallback sin JS verificado. No se enviaron datos de formulario.
- **Producción:** la comprobación `python3 scripts/check-site.py _site --production` **falla intencionadamente** hasta completar el texto legal, y así debe permanecer. Fotografías conceptuales claramente marcadas; confirmar derechos antes de publicar.
- **Transferencia pendiente:** debido a que el conector GitHub no acepta referencias locales a archivos binarios, el ZIP fuente revisado completo todavía no se ha transferido a GitHub; la rama remota contiene documentación y controles de preparación. Para evitar un árbol incompleto, no afirmar que el PR incluye `Luz rasante` hasta verificar SHA/blob de las imágenes. La copia descargable de este ZIP es la fuente de trabajo para el siguiente relevo.

## 2026-10-09 — precios comparables y deslocalización del mensaje comercial
- El usuario autorizó expresamente la publicación de la web pero las puertas de validación y privacidad del proyecto siguen aplicando.
- Se eliminó la localización regional solicitada de toda la web y metadatos. Los precios publicados proceden de una investigación de comparables en tiendas externas, detallada en `docs/MARKET_STUDY_2026-10.md`.
- Estos números NO son tarifas de LITOS. Faltan costes y estimación del margen para fijar precios vinculantes.
- El aviso legal y los derechos de imágenes son requisitos pendientes; se mantiene el bloqueo de producción hasta verificación real, sin escribir valores ficticios.


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


## 2026-10-11 — Publicación verificada del catálogo 18/18 originales
- Usuario autorizó publicar el segundo lote de 8 imágenes. PR #10 fusionado, `main` commit `638144cd6c0f59daf4340170e8072af68593359f`.
- Pages SUCCESS y verificación HTTP/SHA-256 18/18: https://github.com/litosartesania/litos_web/actions/runs/38159245695
- Consola escultórica y banco escultórico terminados en las nueve piedras; progreso total publicado **18/189 (9,5 %)**. Los otros 19 modelos no tienen imágenes específicas verificadas. Restan 171 combinaciones.
- Referencia vigente: `docs/PROGRESO_CATALOGO.md` y `docs/PUBLICACION_18PNG_20261011.md`. Las notas previas de transferencia/revisión se conservan como historial, pero su estado de “no publicado” ya quedó superado.
- Mantener cuenta y repositorio `litosartesania/litos_web`, privacidad, cero gasto adicional, integridad de PNG y web exclusivamente informativa, sin encargos.

## 2026-10-11 — Menú lateral compacto (propuesta sin publicar)
- Captura y petición: controles de selección/filtros a la izquierda de la imagen; ver producto completo y menú simultáneamente.
- Rama exclusiva `work/catalogo-sidebar-imagen-20261011`, basada en `main` `74fca759463d0aedfc6221764b4117ce7ea388ef`. CSS/HTML responsivos y texto de ayuda breve; sin cambiar precio, imágenes (18 PNG originales), producto, hashes, privacidad, servicios ni otros repositorios.
- Desde 1100px: menú lateral pegajoso con desplazamiento interno y fichas de imagen (sin recorte) junto al texto; entre 791 y 1099px controles arriba y fichas con imagen/texto lado a lado; en móvil controles y fichas apilados. Página de catálogo única.
- Prueba específica `scripts/qa-catalog-sidebar.py` en 390,820,1100,1440,1600 px, diseño, filtro, 2 PNG naturales, sin filtros y sin desbordamiento. Workflow de revisión genera capturas de pantalla y previsualización offline, no Pages.
- **NO PUBLICAR** sin auditoría integral y revisión visual. La tabla de progreso conserva 18/189.


## 2026-10-11 — Menú lateral de piedra: ya publicado
- PR #12 (rama `work/catalogo-sidebar-imagen-20261011`) fusionado: layout compacto con sidebar a la izquierda en pantallas >=1100px, imágenes originales completas sin recorte, detalle al lado; móvil/tablet apilados. CSS/HTML + breve ayuda; precios y 18 PNG intactos.
- Pruebas: 38160566652 y auditoría 38160614811, ambas SUCCESS. Capturas automáticas de 390,820,1100,1440,1600 px en Actions.
- El workflow inicial de Pages 38160808024 desplegó el sitio, pero falló por comprobador HTTP con token CSS obsoleto. Corregido en PR #13 y commit `094ef23654b9f1c2abd66ef50db26b33b8a40f21`; workflow final `38161319526` **SUCCESS**, verificación de diseño HTML/CSS y 18 PNG HTTP+SHA-256.
- Web pública activa: https://litosartesania.github.io/litos_web/mobiliario.html#catalogo . Se mantienen 18/189 imágenes específicas completas (dos productos × nueve materiales), 171 pendientes. Cero coste adicional, privacidad estricta, sin formularios/encargos.


## 2026-10-12 — Mesa de comedor ovalada, Concepto 2, 9 PNG en proceso (NO PUBLICAR)
- Se verificaron visualmente nueve variantes de una única mesa ovalada con dos pedestales cilíndricos: travertino, caliza, Blanco Macael, Carrara, Negro Marquina, granito gris, cuarcita, Calacatta Gold, Verde Alpi. Referencia original conservada `assets/catalogo/litos-mesa-comedor-02.webp`. Siete PNG aportados por el usuario + dos previamente generados en la conversación. Materiales conceptuales, no certificación geológica ni obra ejecutada.
- Todos los PNG 1122×1402, inspeccionados y catalogados por SHA-256, rutas y bytes exactos en `docs/LOTE_9_MESA_OVAL_20261012.json`. Lote local en dos ZIPs <25MiB para subida web a GitHub (5+4 archivos), sin recodificar imágenes.
- Rama aislada `work/catalogo-mesa-oval-9png-20261012` desde main `7d986e9b9986c85fded367ba9572c298dd9c0156`. Código de integración para `mesa-comedor-oval` preparado, con allowlist de 27 imágenes, QA de selector, release HTTP+SHA para 27. Los 18 PNG existentes, 12 WebP, 21 productos y fórmulas no se modifican.
- **ALTO DE PUBLICACIÓN**: falta transferir BINARIOS, validar 27/27 y revisar el sitio con el propietario antes de merge/publicación. Estado oficial HECHO sigue 18/189 (9,5%); 9 nuevas en preparación. GitHub Pages seguirá en su versión verificada previa hasta permiso expreso.
- Transferencia con dos ZIPs en `transfer/` sobre la rama aislada; un workflow verifica hashes independientes y retira los ZIPs del control de versiones tras materializarlos. No interferir con otros procesos ni usar servicios de pago.


## 2026-10-12 — Transferencia finalizada y QA 27/27 superado (NO PUBLICADO)
- El usuario subió correctamente los 2 ZIP al directorio `transfer/` en `work/catalogo-mesa-oval-9png-20261012`. Importación por GitHub Actions **SUCCESS** en https://github.com/litosartesania/litos_web/actions/runs/38179616443: 9/9 originales 1122×1402 comprobados mediante hashes SHA-256 y tamaños, incorporados byte a byte y ZIPs temporales eliminados de la rama. Commit de importación `4fb709de79111432b5e151e4d31c6ae8b3d90328`.
- Validación general del catálogo offline **SUCCESS** https://github.com/litosartesania/litos_web/actions/runs/38179723349 (cinco páginas, guard de privacidad, navegadores).
- Validación específica **SUCCESS** https://github.com/litosartesania/litos_web/actions/runs/38179720303: 27/27 PNG intactos, 9 tipos de piedra × 3 productos y 21 fichas, 390/820/1440px, vista previa descargable `litos-mesa-oval-27-originales-vista-previa`. No desplegó Pages.
- PR #15 sigue en borrador y no fusionado. **La web pública y `main` permanecen con 18/189 combinaciones hechas.** Las 9 de la mesa están preparadas y validadas pero no se consideran hechas hasta autorización expresa, publicación Pages y verificación HTTP 200/SHA-256 de 27 originales.
- Ningún otro repositorio afectado; 0 € de coste adicional; privacidad, carácter conceptual y archivos originales conservados.


## 2026-10-12 — Mesa ovalada 9/9 PUBLICADA y progreso 27/189 verificado
- El usuario autorizó expresamente «Aprobado, publica». PR #15 fusionado mediante squash en `main`, SHA `8e728cdfcbcfe625ed333bef9c26d04de7dbe585`.
- Pages https://github.com/litosartesania/litos_web/actions/runs/38180458652: **SUCCESS**, con 5 páginas, controles responsive/privacidad y verificación de **27/27 PNG originales** mediante HTTP 200, tamaño y SHA-256 desde producción.
- Mesa comedor ovalada Concepto 2: 9/9 variantes publicadas. Consola escultórica y banco escultórico permanecen 9/9. **HECHO = 27/189 (14,3 %); 162 pendientes**. Los archivos originales y precios no se modificaron.
- Matriz vigente: `docs/PROGRESO_CATALOGO.md`; manifiesto: `docs/LOTE_9_MESA_OVAL_20261012.json`; esta sección actual sustituye las notas históricas de «no publicado». 0 € extra, privacidad estricta, sin aceptar encargos y sin tocar otros repositorios.

## 2026-10-12 — Mesa redonda, 9 imágenes preparadas para subir (AÚN NO PUBLICADAS)
- El propietario autoriza la publicación de las nueve variantes de la mesa redonda, previamente catalogadas y guardadas en su Mac. Se validaron contra los PNG montados en esta conversación con tamaño original 1122×1402; SHA-256 en `docs/LOTE_9_MESA_REDONDA_20261012.json` (están en local; GitHub **aún no** contiene los binarios).
- Rama de revisión: `work/catalogo-mesa-redonda-9png-20261012`, basada en `main` `afd09217fd1639b83105a8e63ecbec4b8c5860b8`. `catalogo-precios.js` contiene 9 mapeos adicionales para `mesa-comedor-red`; 21 productos, nueve IDs de material y fórmulas intactas. Copia estricta en `scripts/build-site.sh`; verificación en `scripts/check-site.py`, `scripts/verify-litos-36-png.py`, Playwright y `scripts/check-live-deployment.py`.
- El propietario debe subir los nueve PNG canónicos desde `~/Documents/LITOS_TRANSFER/mesa-comedor-red` con Git en esta rama, previa comparación con los nueve hashes del manifiesto del propio repositorio. No modificar/convertir/recomprimir imagen alguna, ni subir archivos privados.
- QA aislada de 36/36 originales mediante `.github/workflows/review-litos-round-36-originals.yml`, vista previa offline; no Pages. **NO FUSIONAR NI DESPLEGAR antes de que el repositorio contenga los nueve binarios, las pruebas sean SUCCESS y se pueda comprobar visualmente.**
- Hasta publicación y HTTP 200/SHA-256 36/36 en GitHub Pages: progreso real HECHO = **27/189** (14,3 %); la mesa redonda está preparada localmente, no completada públicamente.
- Mantener 0 € de servicios adicionales, privacidad estricta, únicamente `litosartesania/litos_web`. Las imágenes siguen siendo conceptos, sin ofertas de ejecución o formularios de contacto.

## 2026-10-12 — Publicación definitiva mesa de comedor redonda: 36/189
- Superada la transferencia binaria 9/9 a GitHub en commit `cd6c92d3f81e612374c811814ba726bb01438ee3`; 36/36 originales verificados con SHA-256. Cuenta colaboradora `mamg97` aceptó la invitación con permisos `write`; las nueve imágenes subieron por Git sin alterar `main` durante la fase de revisión.
- QA aislada https://github.com/litosartesania/litos_web/actions/runs/38241754408 (**SUCCESS**); controles del PR https://github.com/litosartesania/litos_web/actions/runs/38241951840 (**SUCCESS**).
- PR #17 autorizado: https://github.com/litosartesania/litos_web/pull/17, fusionado a `main` mediante squash `d417f9311d95d888146958b915193f8d511ccf61`. GitHub Pages https://github.com/litosartesania/litos_web/actions/runs/38242073251 **SUCCESS**, incluida comprobación HTTP de 5 páginas y SHA-256 36/36 PNG de producción. Sitio: https://litosartesania.github.io/litos_web/mobiliario.html#catalogo.
- **La información previa de mesa redonda 'AÚN NO PUBLICADA' queda SUPERADA por esta comprobación posterior**. Documento canónico: `docs/PROGRESO_CATALOGO.md`: 4 productos × 9 piedras, **36/189 hechas (19,0 %)**; 17 productos y 153 combinaciones pendientes. Próximo candidato previsto: mesa comedor rectangular, 0/9.
- Los 27 originales previos intactos; imágenes conceptuales 1122×1402, sin tintes ni recortes, sin atribuir fabricación o tarifas reales. Cero gastos adicionales, privacidad, no interferencia en otros procesos/repositorios, no usar ni fusionar el PR experimental #8.

## 2026-10-12 — Mesa comedor rectangular: lote visual 9/9 aprobado, aún NO PUBLICADO
- Nueve imágenes originales 1122×1402 (Travertino, Caliza, Blanco Macael, Carrara, Negro Marquina, Granito gris, Cuarcita, Calacatta Gold y Verde Alpi) aprobadas por el usuario tras revisar que las dos patas cilíndricas conserven igual diámetro/altura. Archivos en su Mac: `~/Documents/LITOS_TRANSFER/mesa-comedor-rect`, con manifiesto SHA-256 local.
- Rama de revisión aislada: `work/catalogo-mesa-rectangular-9png-20261012`, desde main `d9d723ac2e1a6b40edb3f98c697b8fe7ee12b72c`. Se preparan 9 mapas para `mesa-comedor-rect`, el constructor, el comprobador exacto de 45/45 PNG, QA Playwright y verificación posterior de Pages. Los 36 originales ya publicados NO se modifican.
- **Bloqueo antes del despliegue:** subir desde el Mac únicamente los nueve PNG + `docs/LOTE_9_MESA_RECTANGULAR_20261012.json`, con rutas y SHA-256 exactos. Hasta entonces la rama no es publicable; una vez transferidos, exigir GitHub Actions SUCCESS para 45/45, vista previa navegable y revisión de privacidad. No fusionar en `main` hasta posterior autorización explícita de publicación.
- Conteo HECHO público: **36/189 (19,0 %)**; lote preparado 9/9, objetivo eventual tras despliegue verificable 45/189 (23,8 %). Mantener coste adicional 0 €, privacidad, no interferencia con otros proyectos/ramas/PR #8 y carácter de diseños conceptuales.
