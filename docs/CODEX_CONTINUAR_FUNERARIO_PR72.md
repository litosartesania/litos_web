# CODEX — Relevo de LITOS Comercial: arte funerario (20/10/2026)

## Instrucción de continuidad

Continuar la implementación **desde el trabajo recuperado y verificado en PR #72**, **sin reconstruir, repetir imágenes, comenzar una rama desde un `main` anticuado ni perder cambios sin confirmar**. Este archivo es un handoff operativo, no autorización para publicar.

**Repositorio ÚNICO de escritura:** `litosartesania/litos_web` (cuenta `litosartesania`).

**PR en borrador:** https://github.com/litosartesania/litos_web/pull/72

**Rama remota canónica:** `work/funerario-redesign-recuperado-20261020`

**Commit de recuperación:** `9d6b0715caff7b8f65ba750bdd3298f9fff31e32`

**Commit posterior de documentación/handoff:** `f1f486b2031d505984699c89a959c0486f6ed111`

**Base `main` al iniciar el relevo:** `554917242d51f0dc42ce9e00c7891678bf605d6f`

**CI confirmada para `f1f486b`:** https://github.com/litosartesania/litos_web/actions/runs/39426913345 — **SUCCESS**, audit estática, privacidad, navegador responsive, composición, figuras, carga diferida y exportación. Verificar de nuevo CI para todo nuevo HEAD; no asumir que la del commit anterior cubre cambios posteriores.

> ATENCIÓN: el antiguo directorio de Codex puede contener cambios locales SIN confirmar en una rama distinta `work/funerario-redesign-historico-20261019`, que fue el origen del rescate. NO usar `git reset --hard`, `git clean`, `checkout -f`, rebase forzado ni descartar trabajo. Preferir **nuevo worktree/clon aislado** desde la rama remota recuperada, verificar `git status` y registrar el SHA. No duplicar los 53 archivos locales sobre la rama ya importada: la PR #72 contiene ese rescate.

## Entregado por Codex y preservado

- **53 archivos originales recuperados** mediante respaldo verificado SHA-256; 21 modificados y 32 nuevos.
- **9 configuraciones genéricas de muestra** para el escaparate; no está demostrado que sean reconstrucciones fieles individuales del archivo histórico completo.
- **10 accesorios visualmente distintos**: búcaro, florero, florero gota, vaso cónico, vaso estriado, jardinera, jardinera copa, farol, portavelas y repisa metálica.
- **30 recursos de accesorios:** `assets/funerario/accesorios/*.svg` (10), `renders/*.webp` (10), `miniaturas/*.webp` (10).
- Metadatos de modelos en `assets/funerario/configuracion/modelos-comerciales.json`; más configuración en `catalogo.json`.
- Cambios en `funerario-compositor.js`, `funerario-personalizador.js`, `funerario-exportar.js`, `funerario-recursos.js`, HTML y CSS para modelos, composición, acabados y descargas.
- Dos recorridos en la UX: **«Explorar modelos» y «Crear desde cero»**; se conserva personalización por cinco apartados.
- Exportación PNG/SVG orientativa, no archivo de fabricación. El flujo funcional fue ensayado en navegador local y CI.
- `docs/HANDOFF.md` contiene detalles del trabajo anterior y las limitaciones de la evidencia histórica.

## Próxima ejecución de Codex: prioridades, en orden

1. **Recuperar sin sobrescribir:** abrir PR #72 y leer `AGENTS.md`, `docs/HANDOFF.md`, este relevo, `PROJECT_CONTEXT.md`, los manifests, constructores y tests. Confirmar `origin`, rama, `git status`, commit HEAD y build. Si el workspace anterior está sucio, preservar y utilizar un worktree separado.
2. **Validar visualmente la PR, no solo CI:** navegar el artefacto offline de GitHub Actions #39426913345; inspeccionar escritorio (1440), tableta (768/820), móvil (390 y 320). Seleccionar cada uno de los 9 modelos; verificar filtros, estado al volver, selección de piedra, cambios de composición y controles. El diseño debe ser intuitivo y con imágenes de calidad.
3. **Mejorar UX comercial:** portada con dos recorridos claros, catálogo realmente explorable (tarjetas grandes, filtros, detalles) y configuración paso a paso, conservando las características técnicas avanzadas sin saturar la pantalla. En móvil, el visor de la lápida y los controles deben ser cómodos sin scroll/solapamientos. Evitar paneles redundantes. Mantener el estilo propio de LITOS.
4. **Fidelidad de técnicas:** auditar explícitamente la diferencia visible y geométrica entre (a) grabado superficial, (b) bajo relieve tallado en la propia piedra y (c) figura física 3D aplicada/superpuesta. Material, profundidad, bordes, sombra de contacto, iluminación, escala, fijaciones y exportación deben corresponder a la técnica; **no simular técnicas distintas solo mediante un cambio de color SVG**. Motivos religiosos blancos aplicados mantienen acabado propio al cambiar piedra/letras. Testear sobre piedras blanca, gris y negra.
5. **Completar galería de complementos:** los 10 renders y sus miniaturas deben verse, seleccionarse, posicionarse y exportarse correctamente sin inventar disponibilidad, dimensiones ni anclajes. Miniaturas en galería; render grande bajo demanda; tamaño y posición técnicamente coherentes. Revisar incompatibilidades y accesorios sobresalientes en vista y plano.
6. **Histórico privado, sin filtraciones:** estudiar tipologías, técnicas, cotas y accesorios **solo con fuentes privadas a las que se tenga autorización y acceso legítimo**, respetando la regla `AGENTS.md` de **no consultar/reposicionar repositorios internos ni otros proyectos**. No copiar originales al workspace público, a ramas ni artefactos de Actions. No transcribir inscripciones reales. Si no hay acceso legítimo a una fuente, registrar el bloqueo y avanzar con modelos genéricos; no presentar una inferencia como inspección visual efectuada.
7. **Cotas:** no afirmar que existen tres medidas históricas predominantes. La muestra revisada es parcial y contiene dimensiones poco fiables. Mantener dimensiones manuales y las sugerencias claramente etiquetadas como orientativas; pasar a «más frecuentes» solo tras análisis de una población histórica representativa, deduplicada y validada por el taller.
8. **Calidad y privacidad:** auditar todo cambio y recursos contra PII, fotografías originales y licencias de terceros; los repositorios y **las ramas son públicos**. Ejecutar build allowlist, JS/Python checks, QA de móviles/desktop, pruebas de elementos desbordantes, carga diferida, PNG/SVG y cero solicitudes externas no autorizadas.
9. **Entrega:** commits pequeños y reversibles sobre la misma rama de PR #72; actualización de `docs/HANDOFF.md` con datos comprobables (sin privados), enlaces CI y capturas/vista previa descargable; PR actualizada y en **borrador**. **No fusionar ni desplegar sin aceptación visual y permiso explícito del propietario.**

## Condiciones de aceptación para próximos cambios

- Los recorridos «Explorar modelos» / «Crear desde cero» realmente funcionan y tienen una presentación profesional.
- Cada tarjeta carga un modelo editable, sin confundir imágenes orientativas con trabajos fabricados.
- Se distingue inmediatamente por volumen/material la técnica del elemento religioso o decorativo.
- Los diez accesorios tienen recurso original correspondiente (SVG, render, thumbnail), sin imágenes rotas; escala, z-index y exportación coherentes.
- Mantener la información técnica sin simular presupuestos, montajes homologados o planos aptos para CNC.
- CI válida para el HEAD final, artefacto autónomo navegable y revisión de privacidad antes de solicitar merge.
- Se trabaja solo en `litosartesania/litos_web`, sin tocar `main`, otros repositorios o infraestructura de pago.

## Primera respuesta esperada de Codex

Empezar **ejecutando y comprobando** el estado real de la rama, la PR y los tests; después **continuar programando** con prioridad UX/técnicas/render sin pedir al propietario que vuelva a subir lo ya recuperado. Indicar cualquier bloqueo real con pruebas, no proclamar una implementación completa antes de validar.
