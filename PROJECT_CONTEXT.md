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
