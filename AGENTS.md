# LITOS Comercial — reglas para ChatGPT y Codex

Único repositorio de este proyecto: `litosartesania/litos_web`.

## Principios innegociables

1. No editar, desplegar, consultar ni copiar datos de los repositorios de control interno ni de otros proyectos personales.
2. No introducir servicios de pago, infraestructura, suscripciones, analítica, rastreadores, publicidad o recolección de datos sin aprobación explícita y evaluación de privacidad.
3. No publicar datos de familiares, clientes, pedidos, proveedores, márgenes, credenciales, documentos operativos ni materiales del sistema interno.
4. No afirmar que fotografías conceptuales son encargos reales; distinguir servicios probados de líneas en estudio.
5. Trabajar en una rama aislada. No sustituir `main` ni su publicación sin revisión visual y aprobación del usuario.
6. Antes de cada cambio: leer `docs/HANDOFF.md`, comprobar la rama, usar git status y evitar sobrescribir cambios ajenos.
7. Después: ejecutar `sh scripts/build-site.sh`, `python3 scripts/check-site.py _site`, `node --check script.js` y documentar resultados y bloqueos en `docs/HANDOFF.md`.
8. La publicación GitHub Pages debe utilizar **solo** `_site`, creado con un allowlist explícito. Los documentos en el repo público siguen siendo públicos aunque no aparezcan en Pages: nunca subir notas confidenciales.
9. Mantener reversibilidad mediante commits identificables; no realizar push forzado ni borrar ramas.
10. No enviar datos reales en pruebas de formulario ni dar por confirmado un envío por la carga de un iframe.

## Arquitectura

Landing estática sin backend ni paquetes npm. Solo HTML, CSS, JS y WebP/SVG locales. GitHub Pages gratuito. Contacto mediante borrador de correo generado en el navegador: la persona debe enviarlo explícitamente desde su programa de correo.

`PROJECT_CONTEXT.md` y `PRODUCT.md` heredados contienen investigación y descripciones de negocio. Revisar y sanear su contenido antes de llevarlos a un repositorio público. Mantener notas de trabajo más sensibles fuera del repositorio.
