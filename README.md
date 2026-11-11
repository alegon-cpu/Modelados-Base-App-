# Modelado Bases

Programa para Windows para hacer el E-R, el relacional, el DED y el SQL de ejercicios de bases de datos.

**Descarga:** última versión en [Releases](../../releases/latest). Descomprime el zip y abre `Modelado Bases.exe`.
Desde la 1.6.1 la app se actualiza sola («Actualizar ahora»).

## Cómo se publica una versión

1. Cambiar `version` en `package.json` y añadir sus novedades al principio del historial de `CHANGELOG.txt` (`vX.Y.Z  (fecha)`).
2. Subir los cambios a `main`.
3. GitHub Actions (`.github/workflows/release.yml`) ve que la versión ha cambiado, construye el zip de Windows y publica la Release `vX.Y.Z`.
   La app de todos avisa de la versión nueva al abrirse y se actualiza con «Actualizar ahora».

Para construirlo a mano: `npm ci` y `bash build.sh`.
