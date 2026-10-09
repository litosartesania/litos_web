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
