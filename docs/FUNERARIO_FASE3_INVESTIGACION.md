# Fase 3 · Lectura visual y criterios de diseño · 18/10/2026

## Cobertura y límites

Se abrió la base privada consolidada del taller y se inspeccionaron sus **33 recortes incorporados**: 16 vistas figurativas y 17 de cruces/crucifijos. La tabla de correspondencias contiene 33 filas. La base agrupa **30 trabajos distintos** según su índice, pero esta lectura cuenta vistas, no obras vendidas ni toda la producción del taller. La auditoría anterior cubrió 202 JPEG de 62 carpetas; no se repitió ni se amplió ese recorrido en esta fase. Los recortes, correspondencias, identificadores y archivos originales permanecen fuera de GitHub.

La confianza de la base es orientativa. A través de una fotografía puede apreciarse volumen, contraste y emplazamiento, pero no siempre distinguir fresado de pintura, fijaciones, material exacto, espesor o proceso de fabricación.

## Familias observadas en la base consolidada

| Grupo | Vistas | Observación visual útil | Límite |
| --- | ---: | --- | --- |
| Figuras religiosas | 16 | San José con Niño (2), Cristo crucificado (2), y una vista por cada una de otras doce descripciones figurativas; hay bajorrelieves claros, medallones, dibujo claro sobre granito oscuro y piezas policromadas | No reproducir una pieza singular ni inferir técnica donde la foto no la demuestra |
| Cruces y crucifijos | 17 | 6 vistas de cruces talladas/relieve, 4 perfiladas o de contorno, 2 ornamentales, 2 crucifijos, 1 Santiago/aplicación de color, 1 aplique metálico y 1 cruz lisa oscura | Agrupaciones orientativas; algunas categorías pueden solaparse conceptualmente |

En las figuras se reconocen rostros, dedos, pliegues y sombras de volumen. Los dibujos lineales religiosos existentes (`madre`, `corona`, `ala`, `orantes`, `palomamedallon`) pierden esos rasgos y fueron rechazados por el propietario; continúan `publicSelectable:false`. Las fotos no autorizan transformar un relieve escultórico en un SVG de pocas curvas ni llamar «grabado» a cualquier figura.

## Prioridades técnicas

1. Crear **interpretaciones genéricas originales** de familias realmente presentes, con detalle anatómico y transparencia, y probarlas en la escena grande y a tamaño de miniatura. Deben iniciar `commercialReady:false` y `publicSelectable:false`.
2. Conservar la distinción entre grabado, bajorrelieve y aplique. La vista previa debe etiquetar el acabado como **simulado**; la técnica y fabricación necesitan validación del taller.
3. Utilizar zonas amplias y proporciones correctas para figuras verticales, aves horizontales y medallones, sin invadir texto. Las nuevas composiciones quedan en revisión aislada hasta aprobación.
4. Revisar las seis cruces ya públicas como prototipos. Su publicación visual fue autorizada; no implica aprobación de tallabilidad ni fijaciones.

Las imágenes nuevas se generarán a partir de descripciones genéricas de estas categorías; **ningún recorte privado se envía al generador**. Los candidatos se compararán con los bocetos rechazados solo por cualidades generales, sin colocar originales del taller en la biblioteca comercial.
