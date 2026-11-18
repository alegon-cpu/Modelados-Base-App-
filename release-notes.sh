#!/usr/bin/env bash
# Saca del CHANGELOG las novedades de la versión actual y añade cómo instalarla.
set -euo pipefail
cd "$(dirname "$0")"
VER=$(node -p "require('./package.json').version")
SHORT=$(echo "$VER" | sed -E 's/\.0$//')
echo "Novedades de la $SHORT:"
awk -v a="v$VER" -v b="v$SHORT" '
  /^v[0-9]/ { if (on) exit; if ($1==a || $1==b) { on=1; getline; next } }
  on { print }' CHANGELOG.txt | sed -e '/^[[:space:]]*$/d'
cat <<'TXT'

Desde la 1.7.4 no tienes que hacer nada: la app se actualiza sola al cerrarla (o con «Reiniciar y actualizar»).
Si tienes una versión anterior a la 1.7.4 y no se actualiza, instala esta a mano una vez: cierra la app, descarga el zip de abajo y extráelo encima de la carpeta del programa.

Si es la primera vez (descarga el archivo de tu sistema en Assets, abajo):
- Windows: «…-Windows.zip». Descomprímelo (clic derecho > Extraer todo) y abre «Modelado Bases.exe». Si sale «Windows protegió su PC»: «Más información» > «Ejecutar de todas formas».
- macOS: «…-Mac.zip», solo en algunas versiones (si no está aquí, búscalo en una versión anterior). Para Mac con chip Apple o Intel. Descomprímelo y arrastra «Modelado Bases» a Aplicaciones. La primera vez: clic derecho sobre la app > Abrir > Abrir. Si macOS dice que no se puede abrir: Ajustes del Sistema > Privacidad y seguridad > «Abrir igualmente».
- Linux: «…-Linux.tar.gz». Descomprímelo y abre «modelado-bases.sh» (o en la terminal: ./modelado-bases.sh).
En macOS y Linux la app avisa cuando hay versión nueva, pero se instala a mano (descargando la nueva).

Tus proyectos están en la carpeta Modelados BDD y no se tocan al actualizar.
TXT
