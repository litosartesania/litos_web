# LITOS COMERCIAL — PROJECT_CONTEXT
Actualizado: 2026-10-09 · Repositorio exclusivo: `litosartesania/litos_web`
**Estado: RECUPERACIÓN PARCIAL. NO APTO PARA PUBLICAR.**

## Normas de trabajo
- Usar exclusivamente la cuenta GitHub `litosartesania` y este repositorio. Nunca modificar los repositorios ni procesos de LITOS interno u otros proyectos.
- Desarrollar en rama aislada; `main` y la web de producción permanecen intactos hasta validación formal de diseño, funcionalidad, contenido y privacidad.
- GitHub Pages y GitHub Actions públicos sin nuevos servicios de pago. No subir secretos, presupuestos, clientes, documentos privados, órdenes de trabajo, datos familiares o fotos no autorizadas.
- **Este repositorio es público: las ramas, commits y artefactos públicos NO son entornos confidenciales.** `.gitignore` no borra archivos ya publicados en Git.
- Diferenciar siempre fotografías de trabajos auténticos, material de referencia y conceptos o renders; no atribuir realizaciones, materiales, plazos, tallas o servicios sin evidencia.

## Recuperación de Codex — evidencias, no suposiciones
- La sesión de Codex de 2026-09-22 desarrolló una sustitución visual de la home bajo el concepto **«Luz rasante»**: portada editorial/cinematográfica, dos rutas comerciales (arte funerario y piezas para espacios), proceso, contacto y revisión responsive en iPhone/iPad/escritorio.
- El relevo histórico indicó rama **local** `codex/commercial-prototype`, commit inicial local `bfd40e1`, documentación local `PRODUCT.md` y `PROJECT_CONTEXT.md`. El diseño continuó después de ese commit; **no suponer que `bfd40e1` contiene la última versión**.
- Codex no pudo publicar la rama al remoto por un conflicto de identidades Git. Al recuperar esta sesión, el remoto tenía únicamente `main` y ningún PR. Su último commit conocido era `c4490124c8ee07666ea5daa228776c8d9d037446` (2026-08-16).
- Se mencionó `LITOS_LUZ_RASANTE.zip` en otra conversación, pero **no estaba accesible desde esta sesión**, ni en los archivos de conversación disponibles ni en la búsqueda de Library. No se ha recuperado todavía el código ni los recursos visuales de Codex.
- Fuente de recuperación preferente: copia local del directorio Codex, rama local o un archivo .zip/.bundle creado a partir de su estado final. Inspeccionar y comparar su contenido en un entorno aislado antes de integrar. **No reconstruir «Luz rasante» a partir de descripciones.**
- Rama remota de relevo: `work/luz-rasante-handoff-20261009`. Es una rama de salvaguardas y documentación derivada del `main` antiguo, **no representa el diseño recuperado de Codex**.

## Auditoría del `main` heredado
1. `index.html` presenta principalmente mobiliario escultórico y denomina «Archivo de Obras» a imágenes cuya procedencia/ejecución no está verificada. El negocio real se centra en arte funerario, grabado y personalización, sin excluir futuros encargos de decoración.
2. Afirmaciones pendientes de justificar: «un único bloque», una cantera concreta, «entrega e instalación», respuesta en menos de 48 horas, «edición numerada», y exclusividad B2B. Retirar o acreditar antes de lanzamiento.
3. El formulario utiliza POST a Google Forms con iframe oculto y evento `onload` que muestra «recibido». Esto **no acredita** que el servidor haya aceptado el envío. No probar con datos personales reales en la previsualización.
4. `script.js` conserva lógica Formspree y referencia `#form-error` ausente del HTML; exige consolidar el sistema de contacto y verificarlo con pruebas funcionales.
5. `.github/workflows/static.yml` en `main` publica todo el repositorio (`path: '.'`). Hay nueve originales grandes en `IMÁGENES/Editar/`, además de ocho imágenes utilizadas en `assets/`. El despliegue debe limitarse a archivos autorizados, sin dar por hecho que eso revoca copias públicas anteriores.
6. La web carga Google Fonts de terceros; verificar implicaciones RGPD, textos legales, información al usuario y eventuales transferencias de datos antes de publicar.
7. Falta asegurar que animaciones no oculten contenido si falla JavaScript; revisar navegación por teclado, foco, menú móvil, contraste, imágenes y diseño responsive.

## Trabajo realizado en esta rama
- Identidad y permisos confirmados: `litosartesania` administrador de `litosartesania/litos_web`.
- Rama separada de producción creada.
- `tools/build-preview.mjs` prepara un paquete estático con lista permitida de archivos, verifica enlaces a recursos internos y deshabilita envíos de formularios **solo en el modo vista previa**.
- `.github/workflows/branch-preview.yml` añade revisión de sintaxis y artefacto ZIP revisable desde Actions; **no despliega GitHub Pages**.
- La configuración de Pages en esta rama se endurece para publicar solo la salida filtrada de `tools/build-preview.mjs --production` si se llegara a fusionar tras todas las validaciones. `main` sigue sin cambios.
- `.gitignore` protege futuros archivos locales, aunque no deja de versionar contenidos ya rastreados.

## Próximos pasos / criterios de aceptación
1. Recuperar el último estado REAL de Codex (ZIP / copia local / bundle): confirmar SHA, estructura, dependencias, licencias y que no haya secretos ni datos privados.
2. Comparar contra el remoto sin sobreescribir archivos a ciegas; integrar en esta rama de trabajo preservando el diseño, anotando conflictos e historial.
3. Actualizar la lista permitida de recursos del builder si la nueva web precisa más ficheros; no copiar carpetas de trabajo, originales ni archivos de proyecto internos.
4. Validar en 390, 768, 1024 y 1440 px; menú, anclas, formularios con entorno de prueba, ausencia de overflow, keyboard/focus, reduce-motion, carga sin JS, contraste y accesibilidad básica.
5. Confirmar evidencia y derechos de fotografías, copy comercial, identidad y política de privacidad.
6. Ofrecer una previsualización navegable que no comparta datos con terceros ni acepte solicitudes reales. El ZIP generado por Actions puede abrirse localmente; **no equivale a una URL de staging alojada**.
7. Concluir revisión explícita antes de cualquier merge o despliegue. Sin auto-merge, sin editar `main` ni lanzar `workflow_dispatch` de producción.

## Para ChatGPT/Codex
Empezar leyendo este fichero y el repositorio. No dar por recuperado «Luz rasante» hasta inspeccionar sus archivos originales. Registrar cambios, pruebas, capturas revisadas y riesgos concretos aquí. Si falta el paquete fuente, limitarse a cambios de infraestructura/documentación reversibles.
