# Transferencia controlada del segundo lote de ocho imágenes

Esta carpeta existe para facilitar una única subida manual desde GitHub, siempre en la rama aislada `work/catalogo-consola-banco-18png-20261011`.

Sube exclusivamente el ZIP **original** `LITOS_LOTE_8_VARIANTES_20261011.zip` con las 8 imágenes y su manifiesto. No descomprimas, renombres ni modifiques imágenes. La automatización `materialize-litos-8-zip.yml` valida 8/8 originales SHA-256 contra la copia independiente del manifiesto, coloca los PNG en `assets/catalogo/variantes/` y elimina el ZIP. Si el contenido es diferente, se aborta sin importar ni publicar.

No fusionar ni desplegar hasta CI completo y nueva autorización del propietario.
