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

Si ya tienes Modelado Bases 1.6.1 o posterior, la propia app te avisa y se actualiza sola con «Actualizar ahora».

Si es la primera vez:
1. Descarga el zip de abajo (Assets).
2. Descomprímelo (clic derecho > Extraer todo) y abre «Modelado Bases.exe».
3. Si Windows muestra «Windows protegió su PC»: «Más información» y luego «Ejecutar de todas formas».

Tus proyectos están en la carpeta Modelados BDD y no se tocan al actualizar.
TXT
