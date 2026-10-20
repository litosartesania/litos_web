# PR #72 · Continuación del rediseño (20/10/2026)

## Punto de partida y límites

Se continúa desde `2169c6260be854658ac6253f07e386903bf3d808`, en un worktree independiente. El checkout recuperado queda conservado. La CI de esa cabeza terminó correctamente: [ejecución 39428069603](https://github.com/litosartesania/litos_web/actions/runs/39428069603).

Se descargó el configurador autónomo del artefacto `litos-offline-preview` de la ejecución 39426913345 indicada en el relevo y se comparó visualmente con la continuidad. La aprobación de esa ejecución no se reutiliza como aprobación de los cambios posteriores.

No se han regenerado imágenes, añadido fotografías privadas ni consultado repositorios internos. Se conservan los diez renders, sus miniaturas y los motivos existentes. Los modelos siguen siendo recreaciones de familias y propuestas: no equivalen a nueve reproducciones verificadas de encargos individuales.

## Cambios para revisión

- La ficha elegida aparece antes de la galería; recibe foco y devuelve el foco a la tarjeta al cerrarse. Se añade «Quitar filtros» y un estado vacío recuperable.
- El recorrido activo se señala también al personalizar un modelo. Al regresar se conserva la composición y su modelo de origen; restablecer vuelve a diseño propio.
- Los controles de movimiento y escala se despliegan bajo demanda dentro de los cinco apartados existentes. Cada apartado ofrece avanzar al siguiente sin duplicar campos. En móvil hay un acceso persistente a la vista de la lápida.
- Los diez complementos conservan su proporción de imagen, admiten tamaño 25–250 % y desplazamiento horizontal y vertical. Las posiciones izquierda, centro y derecha son atajos editables. El límite de escala se ajusta al espacio de la escena; no se atribuyen centímetros reales a productos sin ficha validada.
- Vista, descarga y plano utilizan la misma caja de colocación. Los elementos que sobresalen lateralmente quedan incluidos en el papel del plano. Esas cajas incluyen el margen transparente del recurso y no sustituyen cotas de fabricación.
- El tallado incorpora la textura de la piedra en las mismas coordenadas e iluminación interior de la silueta, sin sombra exterior flotante. El aplique blanco añade un canto visible y sombra de contacto; conserva su material al cambiar piedra o letras. El grabado mantiene integración superficial y el metal conserva reflejos/sombra independientes.
- Se corrige el contraste de notas del configurador. Se actualizan las referencias de caché y se sincroniza el manifiesto con el modelo recuperado: el manifiesto anterior aún describía la versión con busto en vez de medallón.

## Pruebas y artefactos reproducibles

Además de las comprobaciones heredadas, `scripts/qa-funerario-redesign.py` prueba los nueve presets, conservación y restablecimiento de estado, filtros sin resultado, los diez complementos, extremos de escala y posición, proporciones métricas y navegación 320/390/768/1440 px. También ejecuta los escenarios heredados de fuentes, motivos, texto y zonas seguras. La CI ejecuta esta prueba y adjunta:

- `LITOS_CONFIGURADOR_FUNERARIO.html`: configurador autónomo.
- `LITOS_TECNICAS_PR72.html`: misma figura con tres técnicas sobre tres piedras, sin recursos externos.
- `LITOS_PR72_320.png`, `390.png`, `768.png`, `1440.png`: capturas de comprobación.

La comparación de técnicas usa imágenes SVG aisladas para evitar que sus filtros compartan identificadores. El PNG final se comprueba aparte contra la representación del navegador en la prueba de fase 3.

## Pendientes de evidencia y aprobación

- No hay base verificada para presentar tres medidas predominantes: se mantienen ancho y alto manuales. La geometría responde a esas cotas.
- Sin fichas físicas validadas de los complementos no se certifican dimensiones, peso, disponibilidad, anclajes ni compatibilidad. Su colocación es una simulación.
- La apariencia de tallado es una aproximación de iluminación 2D, no una malla de mecanizado. El plano SVG es de colocación orientativa; quedan pendientes importación y comprobación real en CorelDRAW, aprobación técnica del taller y dispositivo iPhone físico.
- La reconstrucción individual del archivo completo y la validación de piedras/técnicas requieren una revisión de fuentes con mayor detalle. No se afirma que este avance complete ese catálogo histórico.
- La PR permanece en borrador. No se ha fusionado ni desplegado en producción.
