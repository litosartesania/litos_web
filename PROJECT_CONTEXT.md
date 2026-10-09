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
