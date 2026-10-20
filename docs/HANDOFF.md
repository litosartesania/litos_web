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

## 2026-10-12 — Mesa comedor rectangular 9 PNG subidos: QA 45/45 SUCCESS, sin publicar
- Actualización posterior al handoff anterior: transferencia completada tras segundo `git push`. GitHub confirmó el commit `3d73c71d2447dab2ba89b1e2f2742ad0ea344992` en `work/catalogo-mesa-rectangular-9png-20261012`, con exactamente nueve originales PNG y `docs/LOTE_9_MESA_RECTANGULAR_20261012.json`; el commit padre contiene el código y la configuración de QA.
- Workflow dedicado `LITOS · Mesa rectangular 9 piedras · QA 45 PNG aislada`: https://github.com/litosartesania/litos_web/actions/runs/38256820251, **SUCCESS**. Incluye 45/45 integridad SHA-256 y dimensiones, construcción privada, selector, galerías, comparación de fuentes, Playwright 390/820/1440 y previsualización offline navegable.
- Vista previa disponible en el artefacto **`litos-mesa-rectangular-45-originales-vista-previa`** (ID 11750667728; disponible temporalmente mediante el workflow). Abrir `site/mobiliario.html` una vez descargado y descomprimido; NO URL pública de producción.
- **AÚN NO PUBLICAR**: la aprobación del usuario cubre las imágenes y la preparación, no un nuevo despliegue de este lote. Solo cambiar `main` con autorización específica, tras revisión visual de preview y privacidad; después comprobar GitHub Pages HTTP/sha256 45/45 y solo entonces elevar el progreso de 36/189 a 45/189. Preservar el resto y el coste adicional cero.


## 2026-10-12 — Publicación confirmada de la mesa rectangular, 45/189 COMPLETADAS
- Actualización posterior y que **sustituye** expresamente los bloqueos previos del lote rectangular de esta misma fecha: el usuario autorizó la publicación tras revisar las nueve imágenes y la vista previa real. No queda aprobación pendiente para ese lote.
- PR #19: https://github.com/litosartesania/litos_web/pull/19 (**fusionado**, squash `d58b1e3b24dd2125da9d9b8237ed6347623db87f`). Se preservan los 36 originales previos sin modificación, el mapeo `mesa-comedor-rect` habilita nueve acabados, y el manifest fuente `docs/LOTE_9_MESA_RECTANGULAR_20261012.json` acredita SHA-256.
- QA en rama 45/45, cinco productos × nueve variantes y 390/820/1440 px: https://github.com/litosartesania/litos_web/actions/runs/38256820251 (**SUCCESS**). PR adicional QA: https://github.com/litosartesania/litos_web/actions/runs/38257303113 (**SUCCESS**).
- Producción (Pages) comprobada desde la URL pública: https://github.com/litosartesania/litos_web/actions/runs/38258374234 (**SUCCESS**), con verificaciones HTTP 200 y SHA-256 de **45/45 PNG originales** y HTML/CSS/JS con nuevo selector. URL https://litosartesania.github.io/litos_web/mobiliario.html#catalogo.
- Estado canónico nuevo: `docs/PROGRESO_CATALOGO.md` **45/189 hechas (23,8 %), 144 pendientes (76,2 %)**. Cinco productos completos (mesa ovalada, mesa redonda, mesa rectangular, consola escultórica, banco escultórico) y 16 productos incompletos.
- **Siguiente lote** deberá prepararse en rama aislada desde el `main` actual, conservar identificadores/materiales y pasar la misma puerta de publicación. Los renders son conceptuales, no obras ejecutadas ni precios comerciales acreditados. Mantener coste adicional 0 €, privacidad, no tocar otros repositorios ni PR experimental #8.

## 2026-10-12 — Dos mesas de centro, 18 PNG generados por Codex, NO PUBLICADOS
- El usuario muestra la carpeta `LITOS_CATALOGO` del Mac, con subcarpetas `mesa-centro-mon` y `mesa-centro-red`. Cada una muestra nueve PNG nombrados por material, `manifest.json` y `revision-materiales.html`. Estas imágenes NO están montadas en este chat: no afirmar verificación de sus bytes/dimensiones hasta transferencia local.
- Rama aislada `work/catalogo-mesas-centro-18png-20261012` desde main `42eaf4e2a262eda93231e8b3afd9ba45cd45066b`. Código del selector preparado para `mesa-centro-mon` y `mesa-centro-red` (2×9), build con copias exactas, guardas de 63/63 originales y vista previa real offline. Esta rama inicialmente NO contiene los 18 PNG ni sus dos manifiestos canónicos. No fusionar sin revisión e integridad verificadas.
- Manifiestos esperados: `docs/LOTE_9_MESA_CENTRO_MON_20261012.json` y `docs/LOTE_9_MESA_CENTRO_RED_20261012.json`, calculados directamente por el Mac del usuario sin modificar ni recomprimir originales. Verificar fuentes Codex: la asociación material/imagen requiere revisión visual, no basta nombre de archivo.
- Publicación sigue **45/189 (23,8 %)**; cuando se transfieran y se autorice publicar después de QA 63/63 y preview, llegaríamos a **63/189 (33,3 %)**. Servicios de coste adicional 0 €, privacidad estricta, solo repo `litosartesania/litos_web`, no tocar `main`, otros proyectos ni PR experimental #8.

## 2026-10-12 — Transferencia real de ambos lotes (confirmada)
- Terminal importó **18/18 PNG originales** y dos manifiestos SHA-256 al commit `3adf001ee562bca8ba3eb47d69f7ad71634eba2f`, en rama `work/catalogo-mesas-centro-18png-20261012`. Solo 20 rutas de datos; 45/45 PNG históricos intactos. La verificación GitHub Actions `38273055417` pasó integridad de **63 originales**, build estático y preview; prueba visual específica Playwright 390/820/1440 pasó **63/63**. Falló únicamente la aserción general desactualizada de cantidad de etiquetas de imagen (`13` frente a `11`, porque hay 7 modelos con PNG y solo 2 con fotos auxiliares, 4 imágenes). Esta corrección se aplica en rama aislada con nueva auditoría; **no publicar hasta PASS completo y autorización nueva**.
- Progreso de producción continúa **45/189 (23,8 %)**, aunque 18 nuevos PNG están correctamente transferidos; solo tras publicación y validación HTTP/SHA-256 pasará a 63/189 (33,3 %).

## 2026-10-12 — Publicación efectiva y verificada de las dos mesas de centro, 63/189
- **Esta entrada sustituye el bloqueo histórico de los dos productos de centro documentado arriba.** El usuario dio autorización expresa de publicación después de la QA de rama y vista previa.
- `mesa-centro-mon`: 9 PNG fuente; `mesa-centro-red`: 9 PNG fuente. Copia original exacta en commit de datos `3adf001ee562bca8ba3eb47d69f7ad71634eba2f`; manifiestos `docs/LOTE_9_MESA_CENTRO_MON_20261012.json` y `docs/LOTE_9_MESA_CENTRO_RED_20261012.json`. Los 45 previos se mantienen idénticos.
- Auditoría de rama https://github.com/litosartesania/litos_web/actions/runs/38273631176 (**SUCCESS**), 63 SHA-256, selector nueve materiales, tres anchos 390/820/1440, controles de privacidad.
- PR #21 https://github.com/litosartesania/litos_web/pull/21 fusionado a `main` con squash `3e909b5b9734a89431d113dcb586b4869ce71931`, tras autorización explícita.
- **Producción verificada en GitHub Pages:** https://github.com/litosartesania/litos_web/actions/runs/38274897683 (**SUCCESS**); script audita archivos HTML, CSS, JS y 63 imágenes públicas mediante HTTP 200, tamaño y SHA-256. URL https://litosartesania.github.io/litos_web/mobiliario.html#catalogo.
- Estado canónico actualizado en `docs/PROGRESO_CATALOGO.md`: **7/21 productos completos**, **63/189 combinaciones publicadas (33,3 %)** y **126 pendientes (66,7 %)**. Siguiente lote de imágenes a elegir entre las 14 referencias restantes; procesar mediante generación Codex → lote PNG y hash local → rama separada → QA → autorización → producción comprobada.
- Único repositorio modificado `litosartesania/litos_web`. No confundir con `mamg97/segundo-cerebro` ni con PR experimental #8. Sin publicar información comercial privada, sin tarifas propias y sin añadir servicios de pago.

## 2026-10-12 — Propuesta aislada: catálogo a 3 columnas y ficha en diálogo accesible (NO PUBLICADA)
- Solicitud del propietario: aprovechar mayor anchura del sitio; 3 tarjetas de producto por fila en escritorio, 2 en tableta, 1 en móvil; desplazar lateral de materiales/filtros hacia la izquierda sin eliminar ni cambiar ninguno de los 7 botones; abrir detalle completo al pulsar cualquier producto, con selector de piedra situado sobre la imagen de detalle.
- Rama exclusiva `work/catalogo-grid-3-columnas-ficha-20261012` desde main `a1c3c8ac1964273135f0c65629c53f51c447a62a`. Se conserva la estructura de 21 productos y las 63 variantes PNG originales byte a byte. Cero cambios a precios/referencias de origen: ficha muestra estimación orientativa y URL externa existente, no valores de venta de LITOS.
- Frontend: `styles.css` (3 columnas a >=1200px y menú lateral compacto a la izquierda), `catalogo-precios.js` (tarjetas y `<dialog>` modal nativo con cierre ESC, restauración de foco, selector sincronizado, mensaje explícito para productos sin imagen), `mobiliario.html` (intro y nueva versión cache). Scripts de QA ajustados y prueba adicional `scripts/qa-catalog-card-detail.py`, workflow exclusivo `.github/workflows/review-catalog-grid3.yml`. Vista previa exclusivamente descargable desde el workflow.
- **Bloqueo**: no fusionar en main ni desplegar GitHub Pages antes de ver CI success y aprobación explícita del aspecto/detalle en la vista previa. Si la QA visual falla, resolver en la misma rama; nunca alterar los 63 PNG ni los manifiestos. Tabla pública permanece **63/189 (33,3 %)**. No tocar otros repositorios, proyectos, ni PR experimental #8; cero nuevos servicios de pago, privacidad estricta, sin formularios.

## 2026-10-12 — REDISEÑO DEL CATÁLOGO PUBLICADO Y VERIFICADO (3 columnas y detalle completo)
- Esta entrada **reemplaza el bloqueo de publicación** descrito en la nota de propuesta/PR #23 anterior. El usuario autorizó explícitamente fusionar y publicar el catálogo de tres columnas y el detalle de producto.
- PR #23: https://github.com/litosartesania/litos_web/pull/23, fusionado por squash `c9974da6d0eea893c3290b4035a80ef6567232e1` desde `work/catalogo-grid-3-columnas-ficha-20261012`. Las pruebas iniciales encontraron solamente una llamada no compatible con Playwright (`Locator.is_focused`) y fueron corregidas en el commit `616e82e4dcce7b7f2e8477bcadf825bb29f4b969`. Ambas auditorías pasaron: https://github.com/litosartesania/litos_web/actions/runs/38279595436 y https://github.com/litosartesania/litos_web/actions/runs/38279839224.
- **GitHub Pages de producción verificado:** https://github.com/litosartesania/litos_web/actions/runs/38280805222 (**SUCCESS**), incluyendo build/privacidad, Playwright, despliegue y comprobación real de HTML, CSS, JS, y SHA-256 de los 63 PNG originales. Web pública: https://litosartesania.github.io/litos_web/mobiliario.html#catalogo.
- Diseño aprobado: ancho útil ampliado, 3 columnas en escritorio a partir de 1200px, 2 en tableta, 1 en móvil; menú lateral reducido y desplazado a la izquierda con sus siete filtros, sin eliminaciones. La tarjeta abre diálogo nativo con imagen completa y selector de nueve piedras situado por encima, sincronizado con el menú. Cierre por botón/Escape y restitución del foco. Para productos sin renders específicos, se mantiene indicación honesta.
- **Progreso de imágenes SIN CAMBIOS: 63/189 publicadas (33,3 %), 7 de 21 productos completos, 126 variantes pendientes.** No se han modificado PNGs, manifiestos SHA-256, cálculos/precios ni otros repositorios. Costes adicionales 0 €, privacidad estricta, sin formularios ni comercio activo.
- **Relevo siguiente conversación:** consultar `PROJECT_CONTEXT.md`, `docs/HANDOFF.md` y `docs/PROGRESO_CATALOGO.md` directamente en main; no depender de esta transcripción. Si el usuario pide retoques visuales, trabajar en una rama nueva y no desplegar hasta autorización. Flujo de catálogo: Codex genera archivos originales → usuario descarga en Mac → ChatGPT/Terminal importa a rama aislada → QA sha256/Playwright/privacidad → previa → autorización → Pages HTTP/SHA-256 → actualización documental.

## 2026-10-12 — Petición posterior a galería 3 columnas: cinco por fila, revisión aislada
- El usuario actualiza el diseño: **5 fichas de productos por fila en escritorio >=1200 px**, menú izquierdo con **los mismos 7 filtros** y selector de piedra; sigue abriéndose la ficha detallada al pulsar con selector de piedra arriba. Adaptación progresiva: 3 a 1100–1199, 2 a 700–1099, 1 en móviles.
- Partida en main `b023a50d30b3ae5857b744ff49c5501885a84914`, no en ramas obsoletas; implementación aislada `work/catalogo-grid-5-columnas-20261012`. No modificar imágenes, manifiestos ni precios. CSS amplía ancho útil a 2200px y reduce el ancho de sidebar a 205–235px.
- Pruebas: `scripts/qa-catalog-card-detail.py` exige 5 columnas en 1200/1440/1600/1920 y conserva sincronización de modal, Escape, fotos y filtros. Workflow de revisión `.github/workflows/review-catalog-grid5.yml`; la nueva caché se marca `stone-20261012-grid5` en HTML y auditores. Verificar el resultado del workflow antes de fusionar y el deploy público HTTP/SHA-256 63/63 después.
- El usuario autorizó publicación en turno anterior y modificó el número de columnas en el siguiente; dicha autorización se aplica al diseño final de cinco columnas **solo si los controles pasan**, sin otros servicios ni cambios de repositorio. No tocar PR experimental #8. Mantener 63/189 imágenes publicadas, siete productos completos.

## 2026-10-12 — Catálogo de cinco tarjetas por fila PUBLICADO Y VERIFICADO (actualiza la planificación previa)
- El usuario pidió cambiar el diseño anterior a **cinco productos por fila en escritorio**, y ya había autorizado publicar la modificación del catálogo. La implementación final fue aprobada para publicación condicionada a QA y se fusionó como [PR #25](https://github.com/litosartesania/litos_web/pull/25) en `0db580575768debcf595d55de44c7650c4fd912a`.
- Distribución responsive comprobada: **5 columnas desde 1200 px**, 3 entre 1100 y 1199 px, 2 entre 700 y 1099 px, 1 en móvil. El menú izquierdo conserva **sus siete filtros** y selector de material. Las tarjetas abren el modal nativo con foto grande, precio orientativo, fuente, explicación y selector superior de piedra sincronizado con el menú. Escape cierra el detalle y devuelve el foco.
- QA de rama: https://github.com/litosartesania/litos_web/actions/runs/38282787180 (**SUCCESS**); QA adicional del PR: https://github.com/litosartesania/litos_web/actions/runs/38283002797 (**SUCCESS**); pruebas Playwright con 390, 820, 1100, 1200, 1440, 1600 y 1920 píxeles, validación del menú y las cinco páginas. Corregido contador mínimo heredado de fotos en `scripts/qa-catalog-sidebar.py` sin tocar imágenes.
- Despliegue público: https://github.com/litosartesania/litos_web/actions/runs/38283202187 (**SUCCESS**); HTML, CSS, JS y **63/63 originales PNG** confirmados por HTTP/SHA-256 en GitHub Pages. Versión cache `stone-20261012-grid5`. URL https://litosartesania.github.io/litos_web/mobiliario.html#catalogo.
- Progreso de producción **sin cambios: 63/189 (33,3 %), siete de 21 productos completos, 126 variantes pendientes**. Ningún original PNG modificado, precios y referencias intactos; sitio informativo sin solicitudes de presupuesto ni formularios. Solo repositorio `litosartesania/litos_web`; sin costes adicionales ni cambios a otros proyectos ni PR experimental #8.
- **Relevo**: tratar este registro como estado vigente, no la entrada anterior donde cinco columnas constaban como propuesta. Para siguientes cambios, trabajar con una rama nueva desde el main más reciente, pasar QA, publicar solo con autorización, y actualizar el handoff tras verificación real.



## 2026-10-12 — Nueve planos técnicos importados; publicación autorizada en curso
- El propietario ordena «subelo a la web» tras recibir el ZIP con 21 láminas: se incorporan exclusivamente las nueve REVISADO_CON_HIPOTESIS; doce PENDIENTE_REVISION quedan fuera del repositorio y del mapa del selector.
- Rama nueva `work/publicar-planos-9-20261012` desde main `1668c09092db119ff7d28a08c6cec06a3ca230d4`; no se toca la rama ajena preparada ni PR #8. Nueve PNG 1600×1200 exactos; SHA-256/dimensiones/hipótesis en `docs/PLANOS_TECNICOS_20261012.json`.
- Décima opción de visualización «Plano técnico · alzado, planta y perfil» en selector lateral y ficha. Nueve piedras reales, 21 productos, 63 renders originales y precios intactos. Los doce modelos sin plano revisado muestran pendiente, sin solicitar un archivo ausente. Los planos conservan dimensiones orientativas, concepto no fabricado y no apto para fabricación; enlace a lámina a tamaño completo.
- Build/check-site producción y sintaxis JS locales PASS; QA Chromium en GitHub obligatoria antes de fusionar. Workflow dedicado de revisión y despliegue Pages incorporan revisión del diálogo/precios/vistas. Verificador público exige HTTP/SHA-256 de 63 renders + 9 planos después de desplegar.
- La autorización del usuario cubre publicar las nueve láminas revisadas si QA pasa; no pedir otra autorización. No declarar producción hasta Pages SUCCESS y comprobación HTTP real. Coste adicional cero, sin cambios a otros proyectos ni información privada.

## 2026-10-13 — Corrección geométrica de consola escultórica y plano oval (RAMA AISLADA, NO PUBLICADA)
- Rama de trabajo: `work/consola-9-materiales-2-planos-20261013` desde `main` `c7c2c5014258491a498460f89a5a024186e5949e`. Subida autorizada por el usuario mediante su script de transferencia, commit `53c9a55`. **Sin publicación ni fusión autorizada todavía.**
- Archivo canónico `docs/IMPORTACION_CONSOLA_ESC_20261013.json` con nueve renders corregidos de `consola-esc` en nueve piedras y dos láminas técnicas corregidas (`consola-esc`, `mesa-comedor-oval`). Los once PNG residen como originales intocados en `assets/catalogo/revisiones/20261013/`. Se conservan los 63 PNG y nueve planos anteriores en sus directorios históricos.
- La comparación SHA-256 de los nueve archivos que el usuario adjuntó nuevamente con los nueve del ZIP ya subido confirma **identidad byte a byte en los nueve casos**. Las horas en los nombres solo reflejan descargas distintas. El plano de consola más reciente `plano consola.png` es visualmente idéntico **píxel a píxel** al plano de consola ya alojado en esta revisión, pero tiene distinta codificación binaria. El plano oval adjuntado previamente también coincide a nivel de píxeles con su versión revisada. No sobrescribir las copias originales por simples duplicados.
- En `catalogo-precios.js`, los nueve acabados de consola apuntan a sus PNG corregidos, y las dos fichas técnicas a sus láminas versionadas. El selector continúa con **nueve piedras y la vista independiente Plano técnico**; conserva último material y precio al mostrar un plano.
- `scripts/build-site.sh` copia las 11 versiones corregidas mediante una allowlist explícita sin eliminar ni modificar ninguna imagen histórica. `scripts/check-site.py`, `scripts/visual-qa.py`, `scripts/qa-catalog-card-detail.py` y `scripts/check-live-deployment.py` se amplían para verificar SHA-256 de originales y revisiones, variante-material, apertura de modal, dimensiones naturales 1448×1086 de las dos láminas revisadas y funcionamiento en móviles/tabletas/escritorio.
- Alcance editorial: imágenes conceptuales, medidas técnicas orientativas, nunca producto fabricado o apto para fabricación. Ninguna modificación de precios, siete filtros, textos legales, privacidad, servicios, PR experimental #8 ni otros repositorios.
- **Estado de publicación al crear esta rama**: 63/189 renders y nueve/21 planos publicados. La corrección representa una **sustitución de visuales**, no nueve productos o variantes nuevas. Tras fusión y despliegue autorizado, los conteos permanecerán 63/189 y nueve/21, verificando públicamente los once hashes nuevos.
- Pendiente: completar CI y revisión del PR borrador; **no fusionar ni desplegar a Pages sin autorización explícita del usuario**. Evitar fusionar el PR #28 obsoleto encima del despliegue #29.

## 2026-10-13 — Publicación aprobada, PR #31 fusionado; incidencia transitoria de GitHub Pages
- Usuario autorizó expresamente publicar los once PNG correctivos. PR [#31](https://github.com/litosartesania/litos_web/pull/31) fusionada mediante squash en `main` commit `c7707fcaeb28f4c68a96dc2516ae4a44804cb405`. Código y contenidos incorporados a GitHub; el total sigue siendo **63/189** variantes y **9/21** planos, con nueve imágenes y dos láminas reemplazadas visualmente, no añadidas al cómputo.
- QA del PR: runs [38408580573](https://github.com/litosartesania/litos_web/actions/runs/38408580573) y [38408579598](https://github.com/litosartesania/litos_web/actions/runs/38408579598), ambos **SUCCESS**. Incluyen SHA-256, allowlist, navegador móvil/tableta/escritorio, filtros y fichas.
- Primer despliegue Pages [38411344917](https://github.com/litosartesania/litos_web/actions/runs/38411344917) validó web y subió artefacto, pero el endpoint de creación de despliegue de GitHub respondió HTTP **500** (error externo). Al reejecutar el mismo job, GitHub rechazó dos artefactos `github-pages` con igual nombre, de modo que no debe repetirse *ese mismo run*.
- Se genera una ejecución **limpia** mediante este cambio de documentación en rama y PR separados, para disparar un nuevo workflow Pages al fusionar. **No se modifican fuentes HTML/CSS/JS ni PNG, precios, datos personales o políticas**. No afirmar que la web pública está actualizada hasta que el nuevo Pages termine SUCCESS, incluida verificación pública de 11 SHA-256 correctivos.

## 2026-10-13 — 20 renders candidatos: siete travertinos seleccionados y preparados para QA (NO PUBLICADOS)
- Nueva línea de trabajo indicada por el propietario: primero **21/21 imágenes maestras de travertino**, luego planos técnicos y finalmente variaciones de los otros ocho materiales, producto a producto. Prohibido asumir que los renders y los bocetos son piezas fabricadas.
- Candidatas: `work/travertino-20-candidatas-20261013` commit `aa1fa14b47099a105daddc1314f66a69bcdc1920`, **20 PNG con SHA-256 cotejados**. Los archivos descartados y las distintas alternativas se conservan íntegros en esa rama; no son veinte productos nuevos.
- Preparación de integración aislada: `work/travertino-7-integracion-20261013`. Se han reutilizado los Git blobs sin modificar bytes, bajo `assets/catalogo/revisiones/20261013/travertino-seleccion/`. Siete pares producto-material nuevos: `mesa-aux-ped`, `mesa-aux-bal`, `lavabo-ped`, `lavabo-sobre`, `bandeja`, `cuenco` y `balda`, todos en travertino.
- Fuente canónica del lote seleccionado: `docs/TRAVERTINO_7_REVISION_20261013.json`, hashes SHA-256, dimensiones 1122×1402, nombre de origen y estado `SELECCION_VISUAL_PROVISIONAL`. `catalogo-precios.js` enlaza exactamente estas imágenes; `scripts/build-site.sh` publica exclusivamente las siete seleccionadas cuando exista autorización y se fusione el PR. Ningún otro archivo del lote de veinte se incluye en la build.
- Imágenes descartadas o en suspenso: mesa comedor ovalada/rectangular y centro monolítica/circular porque ya tienen 9/9; alternativas de mesa pedestal y de consola recta; banco lineal por apoyos distintos del plano provisional; peana demasiado parecida a mesa pedestal; encimera de baño/cocina mostradas como muebles o islas completas; panel mostrado como tabique, no como revestimiento; **macetero mineral sin imagen**.
- Estado actual publicado permanece **63/189 renders (7/21 travertinos) y 9/21 planos**, hasta demostrar despliegue público SUCCESS. Si el PR de siete travertinos se autoriza, fusiona y supera auditoría HTTP/SHA-256: **70/189 renders, 14/21 travertinos, 9/21 planos**; faltarán siete bases de travertino.
- QA: manifiesto SHA-256, estricto allowlist de 7, selección sincronizada en catálogo/ficha, responsive, no alteración de las 63 originales ni 11 correcciones previas, nueve planos, precios o estado "no aceptamos encargos". La versión pública solo se modifica con autorización explícita de publicación tras auditoría.


## 2026-10-13 — Segunda tanda de siete travertinos (integración en revisión)
- Origen: siete imágenes entregadas por el usuario, verificadas con SHA-256 y subidas a `work/travertino-7-extras-20261013`, commit `886c3af`.
- Rama aislada `work/travertino-21-integracion-20261013`; reutilización de los siete blobs Git sin alterar un byte, con alias canónicos y manifiesto `docs/TRAVERTINO_7_EXTRAS_INTEGRACION_20261013.json`.
- Productos: `consola-rect`, `banco-rect`, `encimera-bano`, `encimera-cocina`, `panel`, `peana`, `macetero`. Únicamente material travertino. Los ocho materiales restantes no obtienen una imagen fabricada ni simulada.
- Se incorpora a la allowlist de Pages exclusivamente este lote seleccionado, nunca la carpeta completa de candidatos. SHA-256, dimensiones, correspondencia, modal, selector y QA de navegador automatizados. Conservados 63 PNG históricos, once correcciones, siete travertinos anteriores y nueve planos.
- Advertencia editorial: las escenas de cocina y baño incluyen elementos de ambientación; el olivo es atrezzo. Verificar si el render del panel se interpreta como revestimiento y no como tabique autoportante antes de publicar.
- Estado mientras la PR está en revisión: no publicado. Tras autorización explícita, despliegue SUCCESS y verificación pública: 77/189 imágenes, 21/21 travertinos, nueve/21 planos. No se modifica ningún precio, dato privado, servicio o repositorio ajeno.

## 2026-10-13 — Travertino 21/21 PUBLICADO Y VERIFICADO EN PRODUCCIÓN (estado vigente)
- Autorización explícita del propietario en ChatGPT: «Procede, te autorizo» (13/10/2026). PR [#34](https://github.com/litosartesania/litos_web/pull/34) fusionada mediante squash `c92a1c97777aa26e253ce63fc5668ef8f2aa0bc3` en `main`. Ninguna modificación en repositorios externos ni sistemas internos.
- GitHub Pages: ejecución [#38437710472](https://github.com/litosartesania/litos_web/actions/runs/38437710472), **SUCCESS**. Las auditorías automatizadas de producción verificaron HTTP 200, presencia del HTML/CSS/JS y SHA-256 original de 63 PNG históricos, 14 vistas seleccionadas de travertino, 11 revisiones y 9 planos. Pruebas Playwright 390/820/1440 px superadas; 124 archivos públicos en allowlist.
- **Estado público confirmado**: 21/21 productos ilustrados en Travertino beige. Variantes individuales publicadas 77/189 (40,7 %), pendientes 112/189. Se mantienen nueve piedras seleccionables, **9/21 planos técnicos**; los otros ocho materiales no reciben automáticamente renders de los 14 productos incompletos.
- La segunda tanda aporta exactamente `consola-rect`, `banco-rect`, `encimera-bano`, `encimera-cocina`, `panel`, `peana`, `macetero`. Los originales son de 1086 × 1448 px, sus hashes coinciden y se conserva el manifiesto `docs/TRAVERTINO_7_EXTRAS_INTEGRACION_20261013.json`.
- Las imágenes son *representaciones conceptuales*, nunca fotografías de trabajos ejecutados; los precios siguen siendo meramente orientativos y el sitio no acepta encargos. El panel es una representación visual conceptual: el dibujo técnico futuro deberá definir si se trata de un revestimiento de pared y no sugerir un elemento estructural.
- **Próximo hito aprobado por el usuario**: completar/revisar los 12 planos restantes hasta 21/21 (alzado/planta/perfil y cotas *orientativas*) ANTES de emprender los ocho materiales faltantes, producto por producto. No considerar planos ilustrativos como documentación apta para fabricación.
- Esta anotación documental es posterior a la publicación de las imágenes y sustituye las notas previas «en revisión»; no añade ni modifica recursos visuales ni precios.

## 13/10/2026 — Tabla operativa de progreso actualizada
- `docs/PROGRESO_CATALOGO.md` contiene ahora la matriz de **21 productos × 9 piedras**, con casillas calculadas a partir de `approvedVariants` y columna independiente de planos desde `approvedTechnicalDrawings`.
- La matriz publicada muestra **77/189 imágenes**, **21/21 travertinos** y **9/21 planos**; las **112 variantes y 12 planos restantes** se mantienen pendientes. Base de evidencia: despliegue Pages [#38438636709](https://github.com/litosartesania/litos_web/actions/runs/38438636709) SUCCESS.
- Este cambio es solo de documentación: ni catálogo HTML/JS, ni assets, ni precios, ni producción comercial se alteran; PR experimental #8 intacto.

## 13/10/2026 — Los 12 planos pendientes integrados en rama SOLO DE REVISIÓN
- Recibidos y comprobados 12 PNG originales (1600×1200) + 12 SVG editables en `work/planos-12-archivos-20261013`. Reutilizados como blobs Git idénticos en `work/planos-12-integracion-20261013`, identificados en `docs/PLANOS_12_SELECCION_20261013.json`. Los SVG siguen en rama de archivos y están excluidos de Pages.
- El selector «Plano técnico» reconoce las 21 fichas SOLO en la rama de revisión. La publicación, los nueve planos anteriores, los precios y los nueve materiales se mantienen intactos. Se añadieron verificaciones de dimensiones, SHA-256, allowlist, modal y navegadores; la auditoría pública solo se ejecutará tras publicación autorizada.
- Cotas hipotéticas, bocetos conceptuales y **NO aptos para fabricación**. Ningún plano adicional aprobado todavía. Estado público vigente: 77/189 imágenes de piedra, 21/21 travertinos y **9/21 planos**; la aprobación visual y autorización expresa siguen pendientes.

## 2026-10-13 — Todos los planos conceptuales publicados (21/21) · cierre oficial
- El propietario autorizó explícitamente «PROCEDE». Se fusionó [PR #37](https://github.com/litosartesania/litos_web/pull/37) en `main`, squash `3b699e643b745597d549d8d06c4912ae8d0bfd84`.
- GitHub Pages [#38448981789](https://github.com/litosartesania/litos_web/actions/runs/38448981789): **SUCCESS**. Comprobados SHA-256 y HTTP 200 de los 12 PNG nuevos, 9 planos anteriores, 77 variantes de piedra y restantes recursos. QA responsive y privacidad superadas.
- La matriz canónica `docs/PROGRESO_CATALOGO.md` pasa a **21/21 planos publicados** (100 %), cero pendientes. Travertinos 21/21, imágenes de piedra 77/189, 112 pendientes (14 productos × 8 piedras). 7 productos tienen nueve piedras propias.
- Los planos son arte conceptual de alzado/planta/perfil con cotas **orientativas en cm, no aptas para fabricación**. Los SVG editables originales permanecen en rama aislada y están fuera de Pages; preservar sus hashes y los PNG publicados.
- Próxima fase: las ocho piedras restantes de los catorce productos incompletos, manteniendo geometría y documentación estrictamente fieles. No modificar otros repositorios, datos privados ni PR experimental #8.

## 2026-10-13 — Mesa auxiliar pedestal: 9/9 PUBLICADAS Y VERIFICADAS
- El usuario cargó ocho fotografías originales en `work/mesa-aux-ped-8-variantes-20261013` y autorizó su publicación; PR [#39](https://github.com/litosartesania/litos_web/pull/39) fusionada mediante squash `1c86ff56f755b50ef8338d6110628fb3841e5f77`.
- GitHub Pages: [#38468958479](https://github.com/litosartesania/litos_web/actions/runs/38468958479) — **SUCCESS**, HTTP 200, SHA-256 de los ocho PNG (1122×1402) y protección de los originales, 21 planos y 77 imágenes previas.
- La primera imagen fue correctamente **Caliza Campaspero**, no Travertino. Los ocho materiales incorporados: caliza, macael, carrara, marquina, granito, cuarcita, calacatta y verde-alpi. El travertino publicado anteriormente sigue intacto.
- **Estado canónico: 85/189 imágenes de piedra (45,0 %) y 104 pendientes; 8/21 productos completos con 9 piedras; 21/21 planos publicados**. Los restantes 13 productos conservan un único travertino hasta generar otras ocho variantes por producto.
- Todas las imágenes son conceptuales, no piezas ejecutadas. Los planos contienen cotas hipotéticas y no son aptos para fabricar. Precios orientativos, sin encargos ni formularios. Se mantiene el coste gratuito, privacidad y la exclusividad de `litosartesania/litos_web`.

## 2026-10-14 — Mesa auxiliar con baldas: 9/9 PUBLICADAS Y VERIFICADAS
- Ocho originales recibidos del usuario en `work/mesa-aux-baldas-8-variantes-20261014` con SHA-256 íntegros, posteriormente seleccionados como blobs Git idénticos. Se fusionó [PR #41](https://github.com/litosartesania/litos_web/pull/41), commit `be7c513c4348a1edb7580941d519f3e2dc2f6486`.
- GitHub Pages [#38595707375](https://github.com/litosartesania/litos_web/actions/runs/38595707375): **SUCCESS**. Verificación pública HTTP 200, bytes y SHA-256 de los ocho PNG originales (1122×1402), sin alterar los otros 85 materiales ni los 21 planos.
- Piedra de la mesa con baldas: travertino existente + ocho nuevas (Caliza Campaspero, Blanco Macael, Carrara, Negro Marquina, Granito gris, Cuarcita, Calacatta Gold y Verde Alpi). Todas son renders conceptuales, no piezas reales fabricadas; los planos no sirven para fabricación.
- **Estado canónico: 93/189 imágenes publicadas (49,2 %) y 96 pendientes; 9/21 productos completos; travertinos 21/21; planos 21/21**. Pendientes: ocho materiales para doce productos.
- Coste cero, privacidad preservada y trabajo exclusivamente en `litosartesania/litos_web`. No se alteraron otros repositorios ni procesos.

## 2026-10-14 — Incidencia operativa de GitHub Pages tras cierre documental
- **Contenido de producción ya comprobado:** la ejecución [#38595707375](https://github.com/litosartesania/litos_web/actions/runs/38595707375) desplegó el catálogo de 93/189 variantes y verificó por HTTP 200 y SHA-256 las ocho fotografías de `mesa-aux-bal`, junto a las 85 anteriores y los 21 planos.
- La [PR #42](https://github.com/litosartesania/litos_web/pull/42), solo documental, se fusionó en `main` tras auditoría `SUCCESS` y actualizó la matriz canónica a 93/189, 9/21 productos completos y 96 pendientes.
- El despliegue de Pages [#38596417260](https://github.com/litosartesania/litos_web/actions/runs/38596417260), provocado por el cambio documental, falló en el servicio de publicación (primer intento: `updating_pages` y timeout; reejecución del mismo run: `Multiple artifacts named github-pages`). **No es un fallo de las imágenes ni de la construcción.** No reejecutar ese mismo run porque conserva artefactos duplicados.
- Solución aplicada: nueva rama aislada y PR de documentación mínima para desencadenar **una ejecución nueva** de Pages con un artefacto único. No tocar PNG, precios, selector, datos privados ni otros repositorios.
- Mantener los modelos como conceptos, no fabricados; dibujos técnicos solo ilustrativos y no aptos para fabricación. Se mantienen las restricciones de coste cero, privacidad y publicación controlada.


## 2026-10-15 — Preparación de 80 PNG recuperados, SIN PUBLICAR
- El propietario solicita publicar las variantes pendientes de LITOS. Se localizaron diez ZIP auténticos en Biblioteca de ChatGPT para: `consola-rect`, `banco-rect`, `lavabo-ped`, `lavabo-sobre`, `encimera-bano`, `encimera-cocina`, `balda`, `panel`, `peana` y `cuenco`.
- Auditoría local: **80 PNG exactos**, **10 × 8**, sin pares duplicados, con formato PNG, dimensiones, bytes y SHA-256 coincidentes con los manifiestos originales. Inspección visual por producto/material iniciada; los archivos siguen siendo representaciones conceptuales.
- Las otras **16 imágenes de `bandeja` y `macetero`** son visibles en Biblioteca pero no tienen acceso autorizado a sus bytes originales en esta sesión; **no recrearlas ni sustituirlas**. No presentar 189/189 completadas hasta descarga, publicación y validación real.
- Preparada rama exclusiva de carga `work/lote-80-originales-20261015` desde main `5c8073873793834f80d5ed0bc2941eff4497c9ce`. La interfaz del conector GitHub no admite subir directamente ZIP/PNG desde Biblioteca; está preparado un archivo ZIP con los 80 originales, hashes y script de carga segura desde Mac sin modificar main.
- **Estado público sin cambios: 93/189 variantes, 21/21 planos.** Solo después de subir, validar los SHA originales, integrar, revisar la PR y desplegar con Pages SUCCESS se actualizará la matriz canónica. PR experimental #8 intacta. No tocar otros repositorios.

## 2026-10-15 — Integración del lote de 80 PNG en rama para QA; NO publicado aún
- Rama de trabajo `work/catalogo-80-integracion-20261015` sobre la subida `work/lote-80-originales-20261015`, commit `8da3b4b` (80 PNG originales y `docs/LOTE_80_ORIGINALES_20261015.json`). No se altera la codificación de ningún PNG. Cada imagen queda vinculada a producto y piedra exactos.
- Se incorporan los 80 a `catalogo-precios.js`, a la allowlist de `scripts/build-site.sh` y a las auditorías estática, responsive, modal y SHA-256 pública. El travertino existente y los 21 planos se mantienen.
- **Mientras no haya despliegue verificado el estado de producción sigue 93/189, nueve productos completos y 21 planos.** Después de superar CI, fusión autorizada y verificación de Pages, el objetivo será 173/189, 19/21 productos completos, 16 pendientes (bandeja/macetero).
- Trabajo exclusivo en `litosartesania/litos_web`, sin tocar la PR experimental #8, precios, repositorios ajenos ni datos privados. Producto exclusivamente conceptual y cotas no aptas para fabricación.

## 2026-10-15 — CIERRE DEFINITIVO: lote de 80 originales publicado y verificado en Pages
- `work/lote-80-originales-20261015` incorporó 80 PNG originales, verificando sus SHA-256 antes de subirlos. La [PR #44](https://github.com/litosartesania/litos_web/pull/44) fue fusionada (`9a4f31b4`) tras dos auditorías SUCCESS; se activaron 80 asociaciones de imagen, selector y pruebas para diez productos.
- El primer Pages [#38711510868](https://github.com/litosartesania/litos_web/actions/runs/38711510868) publicó el paquete pero falló la comprobación pública por sintaxis del script auditor. La [PR #45](https://github.com/litosartesania/litos_web/pull/45) corrigió el auditor y añadió un bloqueo de sintaxis en la construcción. Fusión `8762e9f6`.
- **Páginas públicas [#38712559086](https://github.com/litosartesania/litos_web/actions/runs/38712559086): SUCCESS**, verificación efectiva de HTTP 200, tamaño y SHA-256 de los 80 nuevos y preservación de originales previos, JS, HTML, CSS y 21 planos. Ninguna imagen recompuesta, ningún cambio de precio o dato privado.
- **Progreso real: 173/189 imágenes de piedra, 16 pendientes, 19/21 productos con nueve piedras, 21/21 travertinos y 21/21 planos conceptuales.** Pendiente recuperar exclusivamente las ocho piedras de **Bandeja de piedra** y las ocho de **Macetero mineral**. Sus renders están en la Biblioteca de ChatGPT, pero no deben considerarse entregados/publicados hasta recuperar los bytes originales, revisar, subir a GitHub, desplegar y comprobar hashes.
- Matriz canónica `docs/PROGRESO_CATALOGO.md` actualizada **después** de comprobar la web pública. Coste cero, repositorio exclusivo, PR experimental #8 intacta. Catálogo conceptual, no piezas ejecutadas.

## 2026-10-15 — Bandeja 8 variantes: integración preparada, aún pendiente de publicación
- Los ocho originales aprobados visualmente se recibieron en rama aislada `work/bandeja-8-originales-20261015`, commit `856173cd3fa876859769517d723acc097d176a3a`. Los SHA-256 de los ocho PNG de origen constan en `docs/BANDEJA_8_CANDIDATAS_SHA256_20261015.txt`; los blobs Git coinciden con los bytes recibidos. No se sustituyó el travertino ya publicado.
- Rama de integración: `work/bandeja-8-integracion-20261015`. Manifest `docs/BANDEJA_8_SELECCION_20261015.json`: ocho piedras, SHA-256, bytes y dimensiones de origen (Granito 1086x1448; otras siete 1122x1402); JS y Pages allowlist para los ocho originales, sin cambiar precios ni otros 173 PNG ni los 21 planos. QA estática, navegador responsive, modal y pública SHA.
- **Hasta auditoría, fusión y Pages SUCCESS el progreso público sigue en 173/189**. Si la publicación es confirmada: 181/189, 20/21 productos completos; único pendiente Macetero (8 variantes). Solo entonces actualizar `docs/PROGRESO_CATALOGO.md`.
- Imágenes conceptuales, no productos fabricados. Privacidad y servicios gratuitos mantenidos. No interferir PR #8 u otros repositorios.

## 2026-10-15 — Bandeja de piedra PUBLICADA Y VERIFICADA; catálogo 181/189
- Imágenes fuente subidas a `work/bandeja-8-originales-20261015`, commit `856173cd3fa876859769517d723acc097d176a3a`; 8/8 PNG coincidentes en SHA-256 y Git blob, copia byte-a-byte; el travertino publicado previamente permanece intacto.
- Integración en [PR #47](https://github.com/litosartesania/litos_web/pull/47), fusionada por squash `089224eaa24773aeea2f376d218053a489334741`. Auditorías [#38734035724](https://github.com/litosartesania/litos_web/actions/runs/38734035724) y [#38734035770](https://github.com/litosartesania/litos_web/actions/runs/38734035770) **SUCCESS**, incluidas QA de selector, modal y navegación móvil.
- [GitHub Pages #38734556607](https://github.com/litosartesania/litos_web/actions/runs/38734556607): **SUCCESS**; verificador público descargó los ocho PNG Bandeja (HTTP 200, bytes y SHA-256 comprobados) y preservó el resto de materiales y planos. Tamaños: 7 imágenes 1122x1402, granito 1086x1448; sin deformación declarada en JS.
- **Estado real publicado: 181/189 materiales (95,8 %), 20/21 productos completos, 8 imágenes pendientes exclusivamente de Macetero mineral; 21/21 travertinos y 21/21 planos conceptuales**. Matriz oficial `docs/PROGRESO_CATALOGO.md` actualizada solo después del despliegue. No publicar ningún otro material sin verificar. Cero servicios de pago, privacidad intacta, PR #8 y repositorios ajenos sin modificar.

## 2026-10-15 — Macetero mineral, integración preparada (NO publicada todavía)
- Rama fuente `work/macetero-8-originales-20261015` commit `3c611eff4155b6e0a10137b8cbb24376326c12cd`, ocho originales aprobados por el usuario, 8 SHA-256 y blobs Git verificados sin recompresión. Manifest original `docs/MANIFIESTO_MACETERO_8_20261015.json`, seleccionado `docs/MACETERO_8_SELECCION_20261015.json`; PNG 1024×1536. Se conserva imagen maestra original del travertino (1086×1448) y 21 planos.
- Rama aislada de integración `work/macetero-8-integracion-20261015`; actualiza únicamente selector `catalogo-precios.js` (8 rutas y tamaños), allowlist `scripts/build-site.sh`, auditorías estáticas, de navegador y de integridad pública y bust de caché `mobiliario.html`. No cambia precios, originales, demás productos, textos comerciales, privacidad ni otras ramas/PR (especialmente #8).
- Mantener progreso público en **181/189** hasta que los workflows de PR, fusión y Pages terminen con SUCCESS y los ocho archivos respondan HTTP 200 y SHA-256 correcto. Solo entonces actualizar `docs/PROGRESO_CATALOGO.md` a 189/189 y 21/21.

## 2026-10-15 — CATÁLOGO COMPLETO 189/189 Y 21/21 PRODUCTOS; VERIFICACIÓN PÚBLICA
- **Publicación terminada** mediante [PR #49](https://github.com/litosartesania/litos_web/pull/49), commit squash `0938f1fb8bb229e9e2f2377d4aaffc70ea71acd2`. Rama origen `work/macetero-8-originales-20261015`, commit `3c611eff4155b6e0a10137b8cbb24376326c12cd`, originales Macetero 8/8, hashes SHA-256 y hashes Git de origen comprobados. Manifest `docs/MACETERO_8_SELECCION_20261015.json`.
- Auditorías [#38752102260](https://github.com/litosartesania/litos_web/actions/runs/38752102260) y [#38752102352](https://github.com/litosartesania/litos_web/actions/runs/38752102352): **SUCCESS**. GitHub Pages [#38752697679](https://github.com/litosartesania/litos_web/actions/runs/38752697679): **SUCCESS**, logs con los ocho originales Macetero HTTP 200 y SHA-256 correcto (8/8), más todo el catálogo previo. Sin editar ni recomprimir originales; travertino y 21 láminas técnicas conservados.
- **Estado definitivo:** 21 productos × 9 piedras = **189/189** imágenes conceptuales (100 %), **21/21 modelos completos**, **21/21 travertinos**, **21/21 planos orientativos**. Cero pendientes de imágenes de piedra. Matriz canónica en `docs/PROGRESO_CATALOGO.md` actualizada después de comprobar la web. Sin nuevos costes, sin datos sensibles, sin modificar PR #8 ni otros repositorios.

## 2026-10-16 — Limpieza editorial de Mobiliario solicitada expresamente
- Se eliminan de `mobiliario.html` el texto superpuesto «Imagen conceptual · Línea en estudio», la introducción del catálogo con la cifra anticuada de nueve planos y la leyenda repetitiva «Imágenes conceptuales, no portfolio ejecutado».
- Se sustituye la cabecera por «Colección conceptual · 21 productos · 9 piedras · 21 planos»; continúa explícita la condición conceptual y el aviso de que no se aceptan encargos. No se modifican imágenes, fichas, precios, selectores ni descargas.
- Corregido CSS de la cabecera a una columna y QA de texto actualizado. Rama aislada `work/limpiar-comentarios-mobiliario-20261016`, separada del experimento funerario PR #51 (todavía borrador) y de PR #8. Producir fusión únicamente tras auditoría verde y verificar la web pública.

## 16/10/2026 — Corrección de verificador público tras PR #52
- La limpieza de textos de Mobiliario se fusionó con [PR #52](https://github.com/litosartesania/litos_web/pull/52), commit `6473780ce9cb445fa1d275fccc9cd36c31d22f8d`. La primera ejecución Pages #38875986966 desplegó HTML actualizado y devolvió HTTP 200, pero el control final falló por una regla obsoleta de `scripts/check-live-deployment.py` que seguía **exigiendo el comentario que el usuario ordenó quitar**. No fue un error de imágenes ni de CSS.
- Rama `work/arreglar-verificador-comentarios-20261016`: sustituye la regla esperada por la cabecera vigente «21 productos · 9 piedras · 21 planos» y añade tres comprobaciones negativas para impedir que reaparezcan los comentarios retirados. No modifica HTML, PNG, precios, páginas funerarias ni PR #8 / #51. Revalidar PR y despliegue público; no declarar SUCCESS mientras la ejecución final no termine satisfactoriamente.

## 2026-10-16 — Arte funerario genérico: desarrollo aislado basado en categorías y geometría real
- Rama `work/funerario-catalogo-generico-tecnico-20261016` desde el último `main`; reemplaza el borrador PR #51, incompatible tras PR #52/#53, que permanece sin fusionar.
- Revisión **solo lectura** de catálogo operativo y albaranes del maestro privado. Se extrajeron categorías generales, nombres de piedras y ejemplos técnicos; no se exportaron datos de clientes ni imágenes privadas. Resumen sin datos personales en `docs/FUNERARIO_REFERENCIAS_GENERICAS.md`.
- Maqueta con nicho simple/doble, columbario, portada, losa de panteón, 7 piedras, 6 estilos tipográficos aproximados, ornamentos y texto genérico local. Las medidas históricas no se declaran tamaños comerciales o de fabricación.
- GitHub Actions debe validar Web, móvil, seguridad y vista previa antes de revisión humana. **No fusionar ni publicar** el configurador sin aprobación visual. La web pública de Mobiliario y PR #8 quedan intactas.

## 2026-10-16 — Revisión visual privada aplicada al boceto funerario, sin imágenes importadas
- La inspección selectiva de referencias reales internas ha documentado cinco estilos generales (nicho con fijaciones, doble con pilastras y cornisa, columbario pulido, portada con campos simbólicos y panteón de placas horizontales). Nombres y fotografías personales se han excluido.
- Código propuesto exclusivamente en rama PR #54: nuevo modelo CSS de cornisa, pilastras, medallón esquemático, repisa, fijaciones, símbolo y particiones. Sin SVG externos, fotos originales, datos del taller, fuentes de terceros ni modificaciones a Mobiliario.
- Índice privado de pedido/fotos permanece en Sheets interno, no enlazar ni copiar a repo. Mantener PR #54 como borrador hasta evaluación visual.

## 2026-10-16 — Estudio visual contrastado, continuación sin publicación
- Se inspeccionó en un entorno privado una muestra inicial de fotografías de obra, detalles de piedra, croquis y fichas. Las fichas/documentos se **excluyen** de cualquier galería de producto; no son fotografías de la pieza.
- Se observaron en fotografía un conjunto vertical clásico de piedra clara con pilastras acanaladas, medallón y repisa; una portada de arcos gemelos; placas horizontales con moldura y herrajes; una placa oscura pulida con cruz lateral. Son patrones estéticos, nunca originales reutilizables.
- La clasificación y corrección de hipervínculos se realizó **solo en el índice privado existente**, no en GitHub. No se añadió ningún enlace autenticado al repositorio. Fuentes originales intactas.
- El documento público `docs/FUNERARIO_ESTUDIO_VISUAL_20261016.md` preserva únicamente los rasgos anónimos y la diferencia entre evidencia visual y estimación.
- Se creó una previsualización **local y autónoma** con cinco recreaciones nuevas, sin fotografías reales ni nombres/datos particulares; QA local a 390, 820 y 1440 px: sin desbordamiento, navegación funcional, imágenes embebidas y cero solicitudes de red. **No es material fotorrealista final**, no está en GitHub ni se despliega mediante Pages.
- Mantener PR #54 en borrador. Pendiente: galería privada con miniaturas auténticamente accesibles solo con autenticación; más revisión visual; renders fotorrealistas y validación; controles de privacidad; requisitos legales preexistentes. No fusionar #51, no tocar #8 y no activar producción.

## 2026-10-17 — Configurador funerario por capas, revisión aislada
- Rama `work/funerario-capas-20261017`, basada en PR #54 (`b6f33a23`), sin fusión ni despliegue. Reutiliza la página y sustituye el núcleo conceptual CSS por composición SVG.
- Siete materiales con 14 recreaciones originales orientativas; 19 ornamentos SVG; seis fuentes OFL identificadas como aproximaciones; cinco geometrías propias; cuatro layouts; cinco campos editables; PNG 2000 × 2000 íntegramente local.
- Texto y selecciones solo en memoria: sin envíos, almacenamiento, analítica ni datos en URL. No se importan originales particulares ni datos internos.
- Build/allowlist/hashes y sintaxis: PASS. Chromium: 720 composiciones a 390/768/1440, texto largo dentro de zonas, ornamentos independientes, teclado/táctil y descarga PASS. Regresión de cinco páginas × tres anchuras sin imágenes rotas, desbordamientos, errores JS o solicitudes HTTP externas. Vista autónoma sin red.
- Detalle técnico, fuentes públicas, licencias, archivos, pruebas y límites: `docs/FUNERARIO_CONFIGURADOR_CAPAS.md`; hashes: `docs/FUNERARIO_ASSETS_MANIFEST.json`.
- Pendiente validar fidelidad mineral, escala de grano y pulido; Blanco Italia es una interpretación provisional sin variedad identificada. Las fuentes no equivalen a matrices históricas; los modelos no definen medidas de fabricación. Falta QA en Safari/dispositivos físicos.
- Mantener revisión en borrador. **No fusionar ni publicar sin aprobación del usuario**. Mobiliario, imágenes previas, precios y otros repositorios conservados.

## 2026-10-17 — Continuación del configurador funerario por capas
- Se retomó la rama de revisión `work/funerario-capas-20261017` en una rama local aislada desde el mismo commit, sin alterar `main` ni la web pública. La PR de revisión es #55.
- Auditoría actual: 7 piedras con 2 recreaciones cada una, 19 ornamentos SVG, 5 modelos, 4 composiciones, 6 tipografías locales y exportación PNG. Las texturas son conceptos visuales pendientes de contraste con muestras LITOS; no se declaran fotografías certificadas ni planos de fabricación.
- Se corrigió el desbordamiento horizontal de 4 px de `preview/LITOS_CONFIGURADOR_FUNERARIO.html` a 390 px. El QA ahora comprueba la anchura de esta vista autónoma en móvil.
- Validación local: build allowlist 298 archivos, `check-site.py`, `check-funerario.py`, sintaxis JS, 720 composiciones y exportación PNG en Chromium a 390/768/1440 px, vista autónoma sin red y detector Impeccable sin hallazgos. La captura final de 390 px mide 390 px de contenido, sin desbordamiento.
- Mantener PR #55 en revisión. No fusionar ni publicar hasta revisión visual de materiales, geometrías y tipografías por el propietario; Safari/iPhone/iPad físicos siguen sin verificar.

## 2026-10-17 — Autorización para finalizar el configurador y controles de publicación
- Tras recibir la vista previa y la PR #55, el propietario escribió «Tienes permiso para todo». Se interpreta en este encargo como autorización para completar, fusionar y publicar el configurador funerario, manteniendo la separación de `litosartesania/litos_web` y la naturaleza informativa del sitio.
- Se versionó `styles.css` en `funerario.html` para que el navegador reciba el CSS del configurador tras el despliegue. El workflow de Pages ahora exige sintaxis, hashes y escenarios de composición antes de publicar.
- El verificador de Pages comprueba el HTML funerario, los cuatro módulos de ejecución y los 46 recursos del manifiesto mediante HTTP, tamaño y SHA-256. La misma verificación pasó contra una copia local servida por HTTP; no constituye por sí sola prueba del despliegue público.
- QA local: construcción y guard de producción, 720 composiciones en Chromium, cinco páginas a 390/820/1440 px, regresiones de galería y sidebar, vista autónoma sin red, y prueba básica de WebKit a 390 px con cambio de piedra, sin error JS ni desbordamiento.
- Se oscureció el valor de posición de los controles: contraste calculado 5,51:1 sobre el fondo del panel.
- Sigue siendo una simulación visual. Las 14 texturas no son muestras certificadas, Blanco Italia carece de variedad exacta confirmada, las fuentes son aproximaciones y las geometrías no son planos de fabricación. El sitio lo declara y no acepta encargos. No se han probado dispositivos físicos.
- Estado de esta anotación: cambios de publicación preparados en PR #55; verificar CI de la cabeza final y Pages público antes de declarar la función publicada.
# 2026-10-18 — Fase 2 del configurador funerario

Rama `work/funerario-fase2-20261018` desde el `main` con PR #55 fusionada. La auditoría de 202 imágenes/62 carpetas, sus límites y las categorías agregadas están en [FUNERARIO_AUDITORIA_FOTOGRAFICA_FASE2.md](FUNERARIO_AUDITORIA_FOTOGRAFICA_FASE2.md). Evidencia y trazabilidad privada: biblioteca de investigación en Drive del taller; nunca incorporar originales, enlaces internos, pedidos o epígrafes a GitHub. El catálogo incorpora 14 SVG genéricos originales y dos disposiciones nuevas. Generación: `define-funerario-catalog.mjs` → `extend-funerario-phase2.mjs` → builders de UI/recursos/preview/galería. Los nuevos vectores siguen `commercialReady: false`. La PR será de borrador y no autoriza despliegue. Pendientes: lectura de otras fuentes históricas, cotejo de fichas y medidas, muestras de piedra, revisión técnica/comercial y Safari físico.


## 2026-10-18 — Configurador funerario: nuevo diseño ancho y grabados devocionales revisados (rama aislada)
- Tras la publicación autorizada de PR #56 en `fbbe7dca181515b755aed63fc9408278af10cb18`, el propietario solicita piedra más grande, selectores por encima y mejora sustancial de las imágenes de grabado.
- Rama exclusiva `work/funerario-legibilidad-galeria-20261018`: nueva barra principal superior, galería horizontal con miniaturas, escena ampliada, ajustes avanzados debajo; cinco SVG religiosos redibujados genéricamente; hashes y bundle actualizados.
- Los 14 nuevos ornamentos de la fase 2 siguen `commercialReady: false`; no se utilizaron fotografías privadas, datos personales ni otros repositorios. Los 14 WebP originales permanecen intactos. El configurador bloquea descargar texto truncado o composiciones con capas ocultas.
- Estado: pendiente de comprobar CI y validar visualmente mediante PR de borrador. No publicar ni fusionar esta nueva rama sin aprobación.


## 2026-10-18 — Retirada visual inmediata de motivos devocionales rechazados (rama de trabajo)
- El propietario califica los cinco SVG religiosos de la PR #57 como inaceptables. Se deshabilitan del selector público `madre`, `corona`, `ala`, `orantes`, `palomamedallon`, sin borrarlos ni incorporar fotografías privadas. Se mantiene `commercialReady:false` para los 14 recursos experimentales.
- Rama aislada: `work/funerario-retirar-devocionales-no-validados-20261018`. Catálogo identifica `publicSelectable:false` y `visualReview`, compositor/controles no permiten escoger los cinco, y el test del navegador verifica ausencia de categorías/selecciones rechazadas y descarga de combinación neutra. Bundled catalog y SHA-256 sincronizados. Scripts JS versionados para evitar caché anterior.
- Los candidatos artísticos pictóricos de alta resolución no se incluyen en esta entrega y requieren aprobación visual. No tocar otros repositorios; desplegar solo tras CI en verde.

## 2026-10-18 — Cruces originales por familias observadas (solo rama de revisión)
- Tras revisar el inventario privado de 33 vistas y 30 trabajos se preparan seis SVG originales de cruces, sin copiar fotografías ni reutilizar datos particulares.
- Rama `work/funerario-cruces-tipologias-reales-20261018`: 39 ornamentos, 20 sin validar comercialmente, 11 ocultos (cinco devocionales retirados y seis cruces candidatas). Las seis nuevas opciones no están disponibles en la web pública.
- `scripts/build-site.sh` regenera el paquete y hashes antes de construir Pages; revisión de 66 entradas del manifiesto en CI. Permanecen sin modificar las piedras, inscripciones, Mobiliario y demás proyectos.
- **Pendiente:** CI, revisión visual de las propuestas, contraste de técnicas con el taller y autorización antes de cualquier fusión o publicación.

## 2026-10-18 — PR #60: revisor offline interactivo de cruces
- Se incorporó `preview/LITOS_REVISION_CRUCES_6.html` como artefacto de GitHub Actions (no GitHub Pages). Habilita seis cruces candidatas solo en memoria de la copia autónoma; la web publicada, el catálogo y el HTML de vista previa normal mantienen `publicSelectable:false`.
- La galería de 20 recursos en revisión enlaza al revisor offline; funciona con materiales, tipografías, composiciones y descarga PNG íntegramente local.
- Chromium 390/1440 px comprueba seis selecciones, ausencia de solicitudes externas, ausencia de errores JS y PNG 2000 px. CI verde en ejecución #39142906218 anterior al enlace corregido; comprobar la última ejecución de PR #60.
- Pendientes: aprobación visual y técnica, verificación de derechos y contraste con fabricación. No fusionar ni publicar la PR sin aprobación expresa. Nunca trasladar fotografías privadas a GitHub.

## 2026-10-18 — Ensayo de motivos figurativos raster en PR #60
- El compositor soporta capas PNG/WebP. El empaquetador contempla image/png.
- `preview/LITOS_REVISION_FIGURATIVOS_LOCALES.html` permite cargar una imagen desde el equipo y probarla sin guardarla ni enviarla. Es una prueba offline, no una funcion de produccion.
- CI verifica una imagen sintetica RGBA y la descarga PNG de 2000 px, junto a los controles de privacidad y las opciones ocultas.
- Los cinco prototipos pictoricos nuevos quedan para comparacion y validacion artistica. No se han incorporado fotografias internas ni se ha fusionado la PR #60.

## 2026-10-18 — Fase 2 · interfaz de una sola vista, controles laterales (PR #60, borrador)
- Feedback del propietario: mantener TODAS las selecciones desplegables a la izquierda, con la lápida completa a la derecha, sin navegar entre vista y formularios.
- `funerario-personalizador.js`: crea `.memorial-options` (barra lateral semántica), reubica en ella la barra de piedra/modelo/layout/fuente, la galería de motivos y los cuatro grupos de opciones ya existentes sin duplicar controles. Añade resumen sincronizado `.memorial-selection-overview` con 11 selecciones actuales.
- `styles.css`: grid panorámico 34% opciones / resto vista completa a partir de 821px; desplazamiento interior del lateral y piedra sticky sin recortes, SVG contenido; por debajo de 821px vista completa antes de opciones para uso táctil. Resumen seleccionado sticky en escritorio con etiquetas sin truncar.
- `scripts/qa-funerario.py`: valida DOM/posición, sincronización del resumen de piedra, no desbordamiento, descargas PNG y salvaguarda de seis candidatas ocultas; genera capturas 390/768/1440 en el artefacto de revisión. El flujo isolated preview adjunta dichas capturas.
- Cambios exclusivos de PR #60; no se ha publicado nada nuevo en main; confirmar CI actual de la rama antes de cerrar. Los seis motivos cruz y cinco religiosos rechazados permanecen `publicSelectable:false` y sin aprobación comercial. Sin originales privados ni IDs de trabajo.

## 18/10/2026 — Aprobación explícita de PR #60 para publicación de prototipos
- El propietario autorizó integrar las seis cruces genéricas y el nuevo configurador de vista única en la web, manteniendo su estado `commercialReady:false`; la autorización es visual/de exhibición, **no** de fabricación ni de copia de diseños originales.
- Habilitar exclusivamente las seis cruces nuevas como `publicSelectable:true`; los cinco motivos religiosos rechazados permanecen ocultos. Regenerador, HTML, galería y tests deben preservar esos estados después de cada build.
- Versionar CSS/JS y verificar Pages, combinaciones por capas, exportación PNG y privacidad; sin imágenes del taller, pedidos, datos personales, otros repositorios ni servicios de pago.
- Tras fusionar, anotar commit de Pages y ejecución CI pública verificada. La calidad artística de imágenes figurativas y validación industrial continúan pendientes.

## 18/10/2026 — Corrección CI post-fusión PR #60
- PR #60 fusionada por autorización explícita del propietario; commit `1c5a14afea0dee4212818b7eac8484958c2388a3`.
- El primer despliegue Pages #39159169780 falló **antes de publicar**: `scripts/qa-funerario.py` esperaba la galería offline `preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html`, pero el flujo `static.yml` solo ejecutaba `tools/build-funerario-preview.mjs`.
- Rama `fix/funerario-galeria-ci-pages-20261018`: añadir `node tools/build-funerario-gallery.mjs` a la validación de navegador **antes** de `qa-funerario.py`. Se generan recursos de revisión únicamente en `preview/`, no en `_site`, por lo que no se publican imágenes ni documentos privados.
- Fusión y publicación de la corrección sujetas a CI en verde y verificación HTTP/hash de GitHub Pages. Mantener seis cruces visibles como prototipo (`commercialReady:false`), cinco motivos figurativos rechazados ocultos.

## 18/10/2026 — Fase 3, propuesta figurativa en revisión
- Punto de partida verificado: PR #60 fusionada; rama de fase 3 `work/funerario-fase3-figurativos-20261018` desde `main` tras la reparación de Pages. Mantener `litosartesania/litos_web` separado de repositorios personales e internos.
- Bloque A guardado en `85333c1`: auditoría agregada de 33 recortes privados, 30 trabajos, sin fotos ni identificadores en Git. El lote B contiene ocho propuestas originales genéricas en WebP alfa y un manifiesto SHA-256 exclusivo de revisión.
- Bloque C: tres composiciones experimentales, filtros visuales por técnica/material, galería y configurador autónomos. Ocho figuras y tres layouts son invisibles en la web pública y se excluyen del paquete Pages. Las seis cruces de PR #60 conservan permiso solo como prototipos; `moldurada` y `metalica` tienen trazados refinados.
- Bloque D: consultar `docs/FUNERARIO_FASE3_VALIDACION.md` para matriz individual, capturas, límites y pruebas; `scripts/qa-funerario-phase3.py` cubre 216 combinaciones de figura/piedra/layout en tres anchuras y coteja la exportación PNG.
- Próximo paso de producto: revisión artística individual, técnica y de derechos, con muestras físicas. **No fusionar ni desplegar la PR de fase 3 sin aprobación expresa.**

## 18/10/2026 — Integración autorizada y corrección de caché
- El propietario indicó «procede» y se fusionó PR #63 en `main` (`4bb0ec8`), manteniendo ocultos los ocho figurativos y tres layouts nuevos; la autorización de integración no altera su estado comercial/técnico.
- Rama correctiva `fix/funerario-fase3-cache-20261018`: las referencias a los cuatro módulos funerarios cambian a `?v=funerario-fase3-20261018` desde el generador de HTML y el verificador público espera ese valor. Así los navegadores solicitan los recursos de esta fase sin reutilizar los módulos cacheados de la fase de cruces.
- Verificar el nuevo despliegue Pages y los hashes HTTP antes de declarar la fase publicada.

## 18/10/2026 — Fase 3 aprobada para simulación pública
- El propietario revisó la galería y autorizó «impleméntalo todo». Se activan ocho figuras genéricas WebP y tres composiciones en el configurador de `litosartesania/litos_web`, como prototipos orientativos (`publicSelectable:true`, `commercialReady:false`). Los cinco SVG religiosos rechazados permanecen ocultos.
- El manifiesto público verifica 82 recursos, incluidas ocho imágenes completas y ocho miniaturas. La galería descarga miniaturas y solo carga la imagen completa elegida. La composición y el PNG se producen en el navegador; no se incorporan fotos privadas del taller ni textos de visitantes en las solicitudes.
- Rama `work/funerario-activar-relieves-20261018`. Documentar PR, fusión, Pages y prueba funcional pública solo después de comprobar cada paso. Técnica de taller, uso comercial y muestras físicas siguen pendientes.

## 19/10/2026 — Ajuste solicitado del panel y la figura
- Capturas del propietario: el resumen fijo de doce elecciones hace el menú largo; el Medallón de Cristo se ve translúcido sobre Negro Sudáfrica. La figura WebP original es sólida: el compositor añadía `screen` y opacidad 0,85 a su grupo.
- Rama `work/funerario-panel-relieve-20261018`: resumen desplegable con línea compacta, galería de una fila desplazable y figura opaca con sombra de contacto. Los avisos de prototipo permanecen en el texto de la biblioteca y etiquetas accesibles. No se cambian los WebP ni las fotografías privadas.
- Verificaciones locales: 390/768/1440 px, sin desplazamiento horizontal de la página en modo táctil, 540 composiciones por tamaño, 216 combinaciones figurativas y PNG de 2000 px. Anotar PR, fusión y Pages solo tras comprobación pública.

## 19/10/2026 — Libertad de posición, opciones y plano acotado (rama aislada)
- Tras PR #66 publicada, el propietario pidió recorrer la lápida completa con los controles de posición y tamaño, unificar el color, mejorar/ampliar motivos, añadir fuentes y preparar plano para operario/CorelDRAW. Rama nueva desde `main`: `work/funerario-libertad-plano-20261019`. Investigación, límites y formato de plano: `docs/FUNERARIO_FASE4_CONTROLES_Y_PLANO.md`.
- Cruces y demás motivos ahora alcanzan los bordes de la cara vista; escala 25–250 %. Un selector común colorea texto y motivos. Se suman diez SVG genéricos originales y cuatro fuentes OFL locales. La referencia externa solo sirvió para cotejar familias, sin copiar imágenes, rótulos o modelos de otra empresa.
- El plano SVG de colocación exige ancho y alto reales en mm, muestra cotas de cada elemento y se importa en CorelDRAW como SVG métrico. No es plantilla de corte ni valida dimensiones/anclajes/técnicas. Cinco motivos religiosos previamente rechazados continúan ocultos.
- QA local: `sh scripts/build-site.sh`, `python3 scripts/check-site.py _site`, `node --check script.js` y módulos funerarios, `scripts/check-funerario.py`, 2700 combinaciones en Chromium 390/768/1440 con PNG y SVG descargados, regresión fase 3 y carga bajo demanda: PASS. WebKit 390 px: cruz de borde a borde, SVG y sin errores: PASS. 100 recursos allowlist, cero red externa en la simulación. La integración real con CorelDRAW, iPhone físico y aprobación técnica de taller quedan pendientes.
- Antes de declarar publicada esta iteración: revisar la galería de diez motivos, comprobar CI de la cabeza final, fusionar y verificar Pages público mediante HTTP/hash y prueba funcional. No afirmar fabricación lista.
- PR #67 de borrador. Su primera ejecución de CI falló en `scripts/visual-qa.py` porque aún esperaba seis opciones de fuente; el selector ahora tiene diez. Expectativa corregida a diez y prueba visual de las cinco páginas en 390/820/1440 px: PASS local. Comprobar la nueva cabeza en CI antes de revisión/publicación.

## 19/10/2026 — Publicación verificada de la fase 4
- El propietario aprobó la galería visual. PR #67 fusionada en `main` mediante commit `90b8286cc461316a528d05bd9c17281a248fb961`; CI de la cabeza final `b95480b05314dfe0c5b73be0104471f082f35385` terminó correctamente.
- Pages #39228306584 terminó con éxito, incluida su comprobación HTTP pública de HTML, módulos y los 100 recursos funerarios por tamaño y SHA-256.
- Navegador público con `?revision=90b8286cc461`: configurador listo, 10 tipografías, 10 motivos nuevos seleccionables, cruz recorrida en vertical, color común de cruz y texto, plano SVG en mm descargado. A 390 px no hubo desbordamiento ni errores de consola; restablecer la composición devolvió el estado «Lista para descargar».
- El plano descargable es **solo de colocación orientativa**. Medidas de obra, canto, fijación, tipografía final, técnica y cualquier plantilla de corte/CorelDRAW requieren validación del taller; no se declara preparado para fabricación. No se hizo prueba en iPhone físico ni importación real en CorelDRAW.

## 19/10/2026 — Selector visual funerario sin desplegable duplicado (rama aislada)
- La captura del propietario muestra el gran desplegable «Motivo adicional» justo encima de las tarjetas de motivos. Se sustituye el selector de categoría visible por una fila compacta de pestañas: cruces, religiosas, flores/símbolos, adicional, marcos y separadores. Las tarjetas son el único control visual para elegir cada motivo. Se mantienen los controles superiores de material, variante, modelo, composición y fuente.
- El `#memorial-gallery-category` queda oculto en HTML y se conserva como estado interno y punto de compatibilidad para la lógica anterior, sin duplicar selección visible. Los botones de categoría sincronizan `aria-pressed` y mantienen el comportamiento de composición y el exportador. El generador de HTML y la página comercial se actualizan conjuntamente.
- Rama `fix/funerario-selector-motivos-sin-desplegable-20261019`: cambios solo en `litosartesania/litos_web`. No se consultan fotos privadas ni se modifican materiales, textos, precios, imágenes, pedidos ni otros repositorios.
- CI obligatorio: `sh scripts/build-site.sh`, `python3 scripts/check-site.py _site`, `node --check script.js`, comprobación visual Chromium y descarga PNG. Validar la PR antes de fusionar/publicar.

## 19/10/2026 — Únicamente cinco acordeones de personalización
- Petición del propietario: eliminar «Tu configuración» y el panel superior con controles/biblioteca repetidos; conservar solo 01 Piedra y modelo, 02 Composición y símbolos, 03 Letra y acabado, 04 Inscripción editable y 05 Plano para taller, todos inicialmente cerrados.
- Eliminado HTML redundante y la lógica JS que extraía controles de sus paneles; sin duplicar elementos, sin modificar los IDs ni la composición, PNG/SVG, simulación privada ni assets.
- Biblioteca visual ahora compacta dentro del acordeón 02. CSS y JS con invalidación de caché; QA adaptada para probar DOM y funcionalidad.
- Rama aislada y revisión visual/CI obligatoria antes de fusionar y publicar. Sin materiales privados ni cambios en otros proyectos.

## 19/10/2026 — Escaparate basado en referencias internas anonimizadas, cotas y accesorios (PR en revisión)
- Se consultaron únicamente las dos hojas privadas de LITOS con índice fotográfico y pedidos. El índice verificado documenta 202 fotografías físicas de 62 carpetas, pero **no equivale a una revisión exhaustiva de cada foto**. Sin copiar imágenes ni valores identificativos al repositorio público.
- En el índice de revisión visual aparecen familias de columbarios de granito negro con cruz, conjuntos con pilastras/cornisa/medallón, portadas asimétricas y panteones con placas horizontales. Se proponen seis **interpretaciones genéricas originales**, creadas con compositor SVG y textos ficticios NOMBRE APELLIDO y DD / MM / AAAA. Nunca son fotografías originales, réplicas de pedidos concretos ni modelos certificados.
- Una muestra disponible de 23 fichas con par ancho×alto produce 97×80 cm (4), 96×80 cm (4), 108×72 cm (2). Incluye cotas en diversos estados de validación: **no se puede declarar top 3 de todo el archivo ni estándar homologado**. En el personalizador se ofrecen como atajos con aviso y sigue habiendo entrada manual; cada plano debe contrastarse con el taller y el cementerio.
- Se añaden representaciones vectoriales completamente nuevas e ilustrativas de búcaro, jardinera, florero mural y farol, elegibles con acabado y posición separados; nada se importa ni copia de catálogos ajenos. No implican disponibilidad, anclajes ni medidas de fabricación.
- El relieve religioso raster tiene filtro independiente gris/blanco, sin multiplicación por el color de texto y ornamentos; se mantienen sombras neutras. El arte de figuras procede de la biblioteca genérica previamente incorporada a LITOS comercial, no de fotos con datos de clientes.
- Código solo en rama aislada; no publicar hasta CI, privacidad y aceptación visual. No se consultan ni modifican otros repositorios.


## 20/10/2026 — Relevo de Codex y PR #72 (solo revisión)
- El usuario recuperó desde el espacio de trabajo local de Codex la rama \`work/funerario-redesign-historico-20261019\` a partir de \`554917242d51f0dc42ce9e00c7891678bf605d6f\`. Se validaron 53/53 SHA-256 de los archivos transferidos y se guardaron en GitHub mediante el commit \`9d6b0715caff7b8f65ba750bdd3298f9fff31e32\`, rama \`work/funerario-redesign-recuperado-20261020\`, PR #72 **borrador**. La rama procede del trabajo local inacabado por límite de uso; no equivaler a una publicación terminada.
- El rescate contiene nueve configuraciones públicas genéricas, diez familias visuales de complementos, diez SVG originales, diez renders WebP y diez miniaturas WebP. Las imágenes no representan productos físicamente aprobados y no se deben tratar como fotografías de trabajos ejecutados.
- La interfaz separa «Explorar modelos» y «Crear desde cero», con filtrado, ficha comercial y carga de preset editable. Conserva cinco paneles de configuración, acabados y técnicas diferenciadas, composición en el navegador y descarga orientativa PNG/SVG.
- La revisión local de la recuperación verificó sintaxis y render en 390, 768 y 1440 px, composición de complementos seleccionados y exportación. La CI \`LITOS isolated preview audit\` debe seguir verificándose en el HEAD **actual** de PR #72; no dar por aprobada la PR a partir de ejecuciones de commits anteriores.
- Privacidad: revisión de imágenes de complementos sin datos identificativos visibles y contraste local de cuatro coincidencias de rutas/correo con HEAD anterior (ninguna nueva). Esto no sustituye la auditoría de privacidad previa a producción. **Nunca subir originales de pedidos, trazabilidad privada ni datos de clientes a GitHub.**
- La muestra histórica es incompleta: **no hay fundamento para afirmar que existan tres medidas predominantes**. Las cotas actuales son opciones ilustrativas sujetas a validación del taller; ningún plano es apto para corte.
- Pendiente: CI actual, revisión visual del propietario, comprobación de derechos de imágenes, validación técnica/comercial de complementos, geometría y anclajes, y mejora progresiva de fidelidad frente a tipologías legítimamente observadas. La fuente \`litos_web\` y su rama son públicas incluso sin fusionar.
- **No hacer merge ni desplegar \`main\` sin aprobación expresa.** Único repositorio autorizado para escritura: \`litosartesania/litos_web\`.


## 20/10/2026 — Continuación de PR #72 desde el rescate
- Base comprobada: `2169c6260be854658ac6253f07e386903bf3d808`, CI #39428069603 correcta. Trabajo en checkout independiente, preservando el recuperado. Sin regeneración de las diez imágenes ni acceso a otros repositorios.
- Ficha de modelo accesible, limpieza de filtros, cinco pasos progresivos y retorno a la vista previa en móvil. Se conserva el modelo de origen y el trabajo al volver al catálogo.
- Complementos con escala y posición libres, proporción propia y caja compartida con el plano; tallado con iluminación interior y aplique con canto/sombra independientes.
- Detalles, evidencia y límites: `docs/FUNERARIO_PR72_CONTINUACION.md`. La nueva prueba completa se añade a CI y genera comparación autónoma de técnicas y capturas 320/390/768/1440.
- Las cotas históricas frecuentes, la fidelidad individual de todos los trabajos, los anclajes y la fabricación permanecen sin certificar. PR de revisión: no fusionar/publicar sin aprobación expresa.
- Validación local de esta continuidad: build y allowlist, integridad de 131 recursos, sintaxis JS, vista autónoma y cinco páginas responsive: PASS. Prueba nueva: 9 presets, 10 complementos, 1.260 composiciones y anchos 320/390/768/1440, sin errores. Fase 3: 72 composiciones y 18 cruces en cada ancho 390/768/1440; comparación de píxeles PNG inferior a 1 nivel RGB medio en la región de figura. WebKit 390: preset, complemento, tallado, PNG/SVG, sin errores ni desbordamiento. Carga diferida y recuperación ante fallo del complemento: PASS.
- Revisión de privacidad del diff: sin rutas/fuentes privadas añadidas; todos los recursos originales del catálogo permanecen sin cambios. La CI del nuevo commit debe verificarse en la PR; no equivale a aceptación comercial ni a una publicación.
- Revisión visual posterior: corregido el tamaño intrínseco de miniaturas verticales que invadía el rótulo del complemento. Añadida comprobación geométrica de separación imagen/rótulo.


## 20/10/2026 — Publicación solicitada de PR #72
- El propietario solicita que el avance ya esté disponible en la web pública; se procede a publicar la PR #72 tras comprobar la cabeza y su CI.
- Detectada una expectativa obsoleta en la comprobación de despliegue: todavía exigía la versión anterior de CSS/JS. Se obtienen ahora las cinco URL de recursos del HTML que se está publicando; además se verifica el hash exacto del HTML y del CSS, junto con los cuatro módulos y los 131 recursos funerarios.
- La publicación solo se considerará verificada cuando termine Pages y se pruebe la URL pública en escritorio y móvil. El estado definitivo y su ejecución quedan registrados en la PR #72.

## 20/10/2026 — Acceso directo al catálogo y floreros
- El propietario pide retirar la portada conceptual y publicar cada avance validado. Se elimina el bloque «La memoria toma forma» de la página funeraria y se conserva un único encabezado principal.
- Acceso visible «Ver floreros y complementos» desde el inicio del configurador: muestra las diez imágenes originales con elección directa y carga sobre la composición conservada. Se mantienen los ajustes de posición y tamaño.
- Auditoría estática/privacidad y prueba de navegación a 390/1440 px: catálogo de complementos, imágenes cargadas, selección y carga del florero, sin errores ni desbordamiento. Los originales privados permanecen fuera de Git y de Pages.
- La revisión del archivo y de la referencia externa continúa en un avance posterior; no se presenta esta mejora de acceso como investigación terminada.

## 20/10/2026 — Proporciones de composición anonimizadas (revisión)
- Se examinó, únicamente en Drive privado, una fotografía de obra funeraria y su ficha de taller asociada. **No se trasladó ninguna fotografía, inscripción, nombre, fecha, enlace privado ni identificador del trabajo al repositorio público.**
- Se añadió un décimo ejemplo comercial enteramente genérico: nicho de piedra blanca, cruz incisa vertical de doble filete a la izquierda, letras más contenidas a la derecha y florero metálico mural abajo. Texto y fechas de ejemplo ficticios. Las cotas son orientativas: no significan estándar del taller ni disponibilidad acreditada.
- Corrección de causa raíz: `presetState` solo copiaba atributos escalares, por lo que perdía el tamaño/posición particular de los motivos, del florero y las cotas al pulsar «Personalizar este modelo». Ahora copia y acota los controles de colocación, dimensiones y visibilidad de los campos ficticios.
- Una silueta larga no debe renderizarse siempre dentro de un contenedor cuadrado. El perfil `doblefilete` incorpora un aspecto vertical validado en metadatos y se representa sin el anterior encajado cuadrado.
- Pruebas de regresión: conteo de 10 modelos y comprobación del ejemplo con controles restaurados, cruz vertical, florero y captura de la escena. Ejecutar CI del HEAD de la PR; no certificar producción antes de su resultado.
- Toda ficha privada y los originales permanecen privados. Los modelos son **recreaciones**, no fotografías ni expedientes públicos de encargos particulares.

## 20/10/2026 — Galería de complementos con familias comerciales
- La galería independiente de floreros ahora permite filtrar entre todos, floreros, búcaros y jarrones, jardineras, faroles y luz, y repisas/soportes. Los filtros se generan únicamente desde los diez artículos genéricos originales ya existentes; no se añaden fotos ni diseños ajenos.
- Seleccionar un accesorio desde su tarjeta conserva el configurador y permite editar posición/tamaño. Se resalta el producto seleccionado y se comunica el número visible por categoría.
- Revisada la web de referencia del sector: su página pública de accesorios presenta una categoría comercial, **no un inventario con referencias y medidas contrastables**. Otras fuentes sectoriales sí listan variantes y dimensiones, pero esos datos son de terceros, no de LITOS; no se incluyen como especificaciones comerciales del taller sin su validación.
- QA de filtros, retorno al configurador, respuesta visual y ausencia de errores. Cambios solo en la rama aislada; actualizar e invalidar caché de recursos estáticos.

## 20/10/2026 — Cabecera global de LITOS en Arte Funerario
- Tras suprimir el hero de Arte Funerario, quedó una cabecera absoluta de texto claro sobre un fondo claro, sin navegación principal evidente. Se corrige **solo** la página funeraria: cabecera de fondo oscuro, con contraste suficiente, posición `sticky` y enlaces directos «Inicio», «Arte funerario» y «Mobiliario y objetos», más acceso al catálogo.
- Incluida navegación equivalente en el menú móvil y en `noscript`; se marca la especialidad actual mediante `aria-current="page"`. Se conservan los controladores del menú de `script.js`; no se introduce ningún proveedor, recurso remoto ni dato privado.
- Prueba Playwright añadida: enlaces de ambas especialidades, marca actual, menú móvil y cabecera fijada al desplazar 720px en 390/820/1440px. La cabecera está acotada a `.litos-funerary-page` para no alterar las otras secciones.
- Publicar únicamente después de comprobar la CI de la rama y, tras fusionar, verificar GitHub Pages. Los trabajos históricos privados no se incluyen en esta mejora.

## 20/10/2026 — Tres familias funerarias reconstruidas desde evidencia privada
- Inspección visual puntual de **fotografías privadas de producto**, sin publicar ninguna imagen original ni su contexto identificativo, y contrastada con el índice de clasificación privada. Las referencias analizadas muestran: una portada alta de pilastras estriadas y medallón integrado, una placa de dos arcos rebajados con símbolo y escritura en campos distintos, y placas horizontales modulares con anillas y fijaciones.
- Tres geometrías SVG **nuevas y originales**: `arcos-gemelos` (dos vanos fresados), `pilastras-altas` (formato vertical con molduras) y `losa-anillas` (placa horizontal con dos anillas esquemáticas). Se distinguen por su estructura en el motor, no por recoloración.
- Tres modelos de escaparate totalmente ficticios: «Portada de arcos gemelos», «Portada alta de pilastras y medallón» y «Placa modular con anillas». **No replican fotos ni nombres, fechas o dedicatorias reales.** El medallón y los complementos son recursos conceptuales propios ya presentes en el proyecto.
- Catálogo esperado: 10 geometrías seleccionables, 13 presets comerciales, 10 complementos. Se conserva la selección de piedra, tamaños y posiciones en cada preset.
- Faltan por acreditar medidas de fabricación, tipografías exactas, profundidad real del tallado, anclajes y disponibilidad. No son planos ejecutivos.
- La revisión total del archivo histórico privado sigue pendiente: estos tres modelos **no** equivalen a una auditoría exhaustiva de todas las fotografías.
- Pruebas actualizadas en `check-funerario.py`, `qa-funerario.py`, `qa-funerario-redesign.py` y `visual-qa.py`; validar GitHub Actions del HEAD antes de cualquier publicación. No modificar repositorios ajenos ni copiar fuentes privadas a GitHub.
