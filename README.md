# LITOS — Escaparate informativo

Presentación de LITOS Artesanía: por ahora no se aceptan encargos, ventas ni solicitudes de presupuesto y LITOS todavía no emite facturas propias (según el usuario).

## Arquitectura expositiva (separación obligatoria)
- `index.html`: portada neutral. El visitante elige una especialidad; **no hay catálogos ni precios en esta página**.
- `funerario.html`: vista independiente de arte funerario, con sus tres familias de trabajo, referencias de precios funerarios sin formularios de captación comercial.
- `mobiliario.html`: vista independiente de mobiliario y objetos, cuatro familias con precios de mercado de mobiliario sin formularios de captación comercial.
- Ninguna subpágina mezcla el contenido o la navegación con la otra. El visitante puede volver al inicio y elegir.
- `scripts/build-site.sh` genera tres páginas de presentación, dos documentos legales provisionales y los recursos permitidos. Un único JS y CSS compartidos.
- El PR #1 es la entrega aprobada por el usuario para revisión de producción; la fusión solo debe realizarse cuando la auditoría estática, de privacidad y de navegador sea satisfactoria.


## Aviso legal y privacidad
- `aviso-legal.html`: aviso de muestra no comercial y futura revisión legal si la web promueve servicios económicos.
- `privacidad.html`: explica la ausencia de formularios, ingresos publicitarios, correos de contacto y el tratamiento técnico de IP por GitHub Pages.
- Los avisos describen la fase expositiva no comercial y no divulgan datos fiscales inventados ni información familiar.
- Fuente LSSI: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- Fuente AEPD: https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion
- Fuente alojamiento: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Antes de admitir pedidos, anunciar una actividad económica o generar ingresos, se debe revisar la aplicación de la LSSI y publicar la identificación del prestador que corresponda.
- `python3 scripts/check-site.py _site --production` exige ausencia de formularios y correo comercial, no monetización, aviso legal no provisional y transparencia del tratamiento técnico de IP. No eliminar esta comprobación.

## Desarrollo local

El sitio es estático y no requiere instalación:

```sh
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Publicación

GitHub Pages publica únicamente el directorio `_site/` generado mediante `scripts/build-site.sh`, desde `main` y solo tras pasar las verificaciones de publicación. No mezclar documentos internos con la web.

El contexto del producto, el benchmark, las decisiones de diseño y el estado del proyecto viven en `PROJECT_CONTEXT.md`. La web comercial pertenece exclusivamente a `litosartesania/litos_web`; no debe mezclarse con el sistema interno de LITOS.

## Seguridad, privacidad y handoff

Consultar [`AGENTS.md`](AGENTS.md) y [`docs/HANDOFF.md`](docs/HANDOFF.md). La publicación produce `_site/` mediante `scripts/build-site.sh` y verifica la lista de archivos públicos con `scripts/check-site.py`.

La web no necesita servidor privado ni servicios de pago. No hay formularios comerciales, pedidos ni presupuesto: las dos áreas son escaparates conceptuales. No se publica un buzón para recibir consultas o pedidos. La información publicada es únicamente para el supuesto de web sin actividad económica; revisar obligaciones si cambia el uso.

## Precio orientativo y pruebas de liberación
Los rangos publicados son **comparables externos, no precios ni presupuestos de LITOS**. Investigación y fuentes: `docs/MARKET_STUDY_2026-10.md`. Para validar el contenido público ejecutar `sh scripts/build-site.sh && python3 scripts/check-site.py _site` y `python3 scripts/visual-qa.py`.

**Límite de la versión pública:** escaparate personal sin monetización ni encargos. Si se promociona un negocio con actividad económica (aunque no permita contratar en línea), puede exigirse identificar al prestador conforme al art. 10 LSSI. No reutilizar estas páginas legales para ventas sin esa revisión.
