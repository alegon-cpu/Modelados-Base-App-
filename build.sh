#!/usr/bin/env bash
# Construye "Modelado-Bases-<versión>-Windows.zip" a partir del código (se usa aquí y en GitHub Actions).
set -euo pipefail
cd "$(dirname "$0")"
VER=$(node -p "require('./package.json').version")
# La versión que enseña la app (editor.js) tiene que ser la misma que la de package.json
grep -q "const VERSION='$VER'" editor.js || { echo "editor.js no tiene const VERSION='$VER'" >&2; exit 1; }
cat editor.js extras.js mas.js sqltools.js pruebas.js teoria.js inicio.js preguntas.js juegos.js warp.js juegos2.js juegos3.js juegos4.js bdquiz.js cbg.js examen.js i18n.js app.js > renderer.js
node --check renderer.js
rm -rf dist "Modelado-Bases-$VER-Windows.zip"
npx --no-install electron-packager . "Modelado Bases" --platform=win32 --arch=x64 --electron-version="$(node -p "require('electron/package.json').version")" \
  --app-version="$VER" --out=dist --overwrite --asar --app-copyright="Modelado Bases" \
  --ignore='^[/\\]dist' --ignore='^[/\\]\.github' --ignore='^[/\\]build\.sh$' --ignore='^[/\\]release-notes\.sh$' --ignore='^[/\\]README\.md$' \
  --ignore='^[/\\]\.gitignore$' --ignore='^[/\\]test-storage\.js$' --ignore='^[/\\]editor\.js$' --ignore='^[/\\]app\.js$' --ignore='^[/\\]extras\.js$' --ignore='^[/\\]cbg\.js$' --ignore='^[/\\]examen\.js$' --ignore='^[/\\]juegos4\.js$' --ignore='^[/\\]teoria\.js$' --ignore='^[/\\]sqltools\.js$' --ignore='^[/\\]pruebas\.js$' --ignore='^[/\\]i18n\.js$' --ignore='^[/\\]mas\.js$' --ignore='^[/\\]inicio\.js$' --ignore='^[/\\]warp\.js$' --ignore='^[/\\]juegos2\.js$' --ignore='^[/\\]juegos3\.js$' --ignore='^[/\\]preguntas\.js$' --ignore='^[/\\]juegos\.js$' --ignore='^[/\\]bdquiz\.js$' \
  --ignore='^[/\\]LEEME\.txt$' --ignore='^[/\\]CHANGELOG\.txt$' --ignore='\.zip$' --ignore='^[/\\]notes\.md$'
cp LEEME.txt CHANGELOG.txt "dist/Modelado Bases-win32-x64/"
mv "dist/Modelado Bases-win32-x64" "dist/Modelado Bases"
(cd dist && zip -qr9 "../Modelado-Bases-$VER-Windows.zip" "Modelado Bases")
echo "Modelado-Bases-$VER-Windows.zip"
