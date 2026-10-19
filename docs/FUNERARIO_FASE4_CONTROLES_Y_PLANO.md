# Fase 4 · Controles, catálogo genérico y plano de colocación

19/10/2026. Rama `work/funerario-libertad-plano-20261019`. Solo repositorio público `litosartesania/litos_web`; sin originales, datos ni servicios del control interno.

## Diagnóstico y solución

- La cruz no respondía apreciablemente al movimiento vertical: su altura ocupaba casi toda la zona asignada, así que `zona.alto − motivo.alto` era prácticamente cero. La posición del 0 al 100 ahora se proyecta sobre **toda la cara vista** de cada modelo. El 50 conserva la composición de origen; 0 y 100 alinean el motivo con los bordes. Escala del 25 al 250 % del tamaño base, limitada a la cara vista para evitar que desaparezca fuera de la piedra. El arco recorta visualmente la parte que salga de su silueta.
- Un único acabado gobierna la inscripción, las cruces, los motivos, separadores, marcos y la tonalidad de los relieves raster. El selector duplicado de ornamentos se retiró. Los resultados cromáticos son simulaciones, no compromisos de técnica o material.
- Se incorporaron diez SVG originales: lirio, lavanda, espiga, camelia, laurel, libro, pergamino, medallón cerámico, jarrón y vela. No contienen retratos ni epígrafes. Estas piezas son *motivos digitales conceptuales*, no fichas de fabricación de accesorios.
- Se añadieron cuatro tipografías libres locales: Marcellus, Lora, Cormorant Garamond y Montserrat. Sus WOFF2 y licencias OFL proceden de los canales oficiales de Google Fonts. Hay diez opciones visuales en total; ninguna se presenta como la matriz Corel/plotter histórica de LITOS.

## Contraste de familias públicas

La [web de referencia](https://lapidasmadrid.es/) enumera lápidas de nicho, columbario, inscripciones, fotocerámicas, libros/pergaminos y accesorios. LITOS ya disponía de simulación de nichos, columbarios, panteón, inscripción y varios ornamentos. Esta fase añade representaciones **originales y genéricas** de libro, pergamino, medallón cerámico, jarrón y vela. No se copiaron fotografías, nombres de personas, modelos particulares, precios, textos, código ni nombres comerciales ajenos. Algunas páginas de accesorios/libros devuelven bloqueo de acceso, por lo que no se afirma haber contrastado todos sus artículos. El catálogo de LITOS conserva su alcance conceptual y no ofrece todavía esas piezas como producto contratado.

## Plano para taller

El operador introduce ancho y alto **reales de la cara vista en mm** (50–3000). Sin ambas medidas el plano no se genera. Cada cambio de composición recalcula una vista de colocación y una lista legible de cotas X/Y/ancho/alto para inscripción, cruz, imagen, motivos, separadores y marco. La descarga SVG declara ancho/alto de página en mm, dibuja la cara vista a tamaño 1:1 dentro de la página, mantiene elementos en grupos separados y enumera cada caja con posición respecto a la esquina superior izquierda. Incluye textos introducidos, fuente aproximada, acabado y avisos de superposición.

El SVG se puede importar en CorelDRAW con escala métrica según la [ayuda oficial de CorelDRAW para SVG](https://product.corel.com/help/CorelDRAW/540111186/Documentation-Windows/CorelDRAW-en/CorelDRAW-Scalable-Vector-Graphics-SVG.html). Es un **plano de colocación orientativo**, no un `.cdr` ni una plantilla de corte: las cajas representan posiciones, no trayectorias de máquina ni perfiles de herramientas. La documentación pública de LITOS no asigna medidas definitivas por modelo ni aporta matrices de tipografía, especificaciones de canto, anclajes o tolerancias. El taller debe medir la obra y aprobar esos datos antes de convertir el plano en plantilla de producción. El texto permanece local y solo viaja dentro del archivo que el usuario descarga voluntariamente.

## Verificación

- 100 recursos públicos mediante allowlist y SHA-256; 14 texturas, 10 fuentes con licencias, 57 motivos del catálogo (cinco dibujos religiosos rechazados siguen ocultos), ocho relieves bajo demanda.
- Comprobación estática, sintaxis y construcción del sitio: PASS.
- Chromium 390/768/1440 px: 900 composiciones por tamaño, sin errores JS, peticiones externas ni desbordamientos. Se comprobó recorrido vertical de la cruz entre ambos bordes, ampliación al 250 %, color común, nuevas fuentes cargadas y descarga real del plano SVG 970 × 800 mm y PNG 2000 px.
- Fase 3 y carga pública de relieves: PASS local. WebKit a 390 px: recorrido vertical, descarga SVG y ausencia de desbordamiento/errores, PASS. La integración real en CorelDRAW, las medidas del taller, el material físico y el iPhone físico siguen pendientes de prueba externa.
