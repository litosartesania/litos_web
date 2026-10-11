# LITOS COMERCIAL — Relevo técnico: 18 variantes (11/10/2026)

**Publicación: PENDIENTE DE APROBACIÓN.** La versión pública permanece con 10 combinaciones. No publicar ni fusionar PR #10 automáticamente.

- Repositorio único: `litosartesania/litos_web`; cuenta `litosartesania`.
- Rama aislada: `work/catalogo-consola-banco-18png-20261011`. PR [#10](https://github.com/litosartesania/litos_web/pull/10) en borrador.
- Usuario adjuntó `LITOS_LOTE_8_VARIANTES_20261011(1).zip` y luego subió el ZIP original a `transfer/` en esta rama. [Workflow de importación](https://github.com/litosartesania/litos_web/actions/runs/38156846436): **SUCCESS**. Verificó los 8 SHA-256 contra manifiesto independiente, preservó los bytes, confirmó los 18 PNG totales y eliminó el ZIP temporal de la rama.
- Lote nuevo: `consola-esc` y `banco-esc` en `caliza`, `carrara`, `cuarcita`, `calacatta`. Además de sus 5 variantes previas, ambos pasan a 9/9 **en vista previa**, no en la web pública.
- [Workflow de QA y vista previa real](https://github.com/litosartesania/litos_web/actions/runs/38156971000): **SUCCESS**. 18/18 originales íntegros, cinco páginas, controles de privacidad y publicación, selector funcional en Playwright/Chromium a 390, 820 y 1440 px. Artefacto: `litos-18-originales-vista-previa` (GitHub Actions).
- [Auditoría anterior paralela](https://github.com/litosartesania/litos_web/actions/runs/38156968477): **SUCCESS**.
- Documentación: `PROJECT_CONTEXT.md` y `docs/HANDOFF.md` contenían el plan de transferencia previo; **este documento prevalece** respecto a su estado de transferencia. `docs/LOTE_8_IMAGENES_20261011.json` identifica el nuevo lote y sus hashes.
- Riesgos: imágenes conceptuales creadas con IA, no obra ejecutada ni caracterización física certificada; peso elevado de los 18 PNG sin recomprimir conforme a instrucción del usuario. No existen encargos, pagos o formularios.
- **Siguiente paso:** esperar la revisión visual y autorización expresa del usuario. Antes de desplegar comprobar rama, PR y diferencias; tras autorización fusionar solo PR #10 y validar GitHub Pages con HTTP 200 y SHA-256 de cada una de las 18 imágenes.
- **Normas invariables:** solo este repositorio, coste operativo adicional 0 €, privacidad estricta, no interferencia con otras ramas, automatizaciones ni proyectos.
