#!/usr/bin/env bash
# Construye el paquete de la app a partir del código (se usa aquí y en GitHub Actions).
#   bash build.sh          -> Modelado-Bases-<versión>-Windows.zip
#   bash build.sh linux    -> Modelado-Bases-<versión>-Linux.tar.gz
#   bash build.sh mac      -> Modelado-Bases-<versión>-Mac.zip (hay que hacerlo en un Mac: firma ad hoc)
set -euo pipefail
cd "$(dirname "$0")"
VER=$(node -p "require('./package.json').version")
# La versión que enseña la app (editor.js) tiene que ser la misma que la de package.json
grep -q "const VERSION='$VER'" editor.js || { echo "editor.js no tiene const VERSION='$VER'" >&2; exit 1; }
cat editor.js extras.js mas.js sqltools.js pruebas.js teoria.js inicio.js preguntas.js juegos.js warp.js juegos2.js juegos3.js juegos4.js bdquiz.js cbg.js examen.js i18n.js app.js > renderer.js
node --check renderer.js
PLAT=${1:-win}
case "$PLAT" in
  win) EP="--platform=win32 --arch=x64"; OUT="Modelado Bases-win32-x64";;
  linux) EP="--platform=linux --arch=x64"; OUT="Modelado Bases-linux-x64";;
  mac) # icono .icns a partir de icon.png (sips e iconutil vienen con macOS)
    rm -rf mb.iconset && mkdir mb.iconset
    for x in "16 16x16" "32 16x16@2x" "32 32x32" "64 32x32@2x" "128 128x128" "256 128x128@2x" "256 256x256"; do set -- $x; sips -z $1 $1 icon.png --out "mb.iconset/icon_$2.png" >/dev/null; done
    IC=""; if iconutil -c icns mb.iconset -o mb.icns; then IC="--icon=mb.icns"; fi; rm -rf mb.iconset
    EP="--platform=darwin --arch=universal $IC --app-bundle-id=io.github.alegon-cpu.modelado-bases --app-category-type=public.app-category.education"; OUT="Modelado Bases-darwin-universal";;
  *) echo "Plataforma desconocida: $PLAT (win, linux o mac)" >&2; exit 1;;
esac
rm -rf dist
npx --no-install electron-packager . "Modelado Bases" $EP --electron-version="$(node -p "require('electron/package.json').version")" \
  --app-version="$VER" --out=dist --overwrite --asar --app-copyright="Modelado Bases" \
  --ignore='^[/\\]dist' --ignore='^[/\\]\.github' --ignore='^[/\\]build\.sh$' --ignore='^[/\\]release-notes\.sh$' --ignore='^[/\\]README\.md$' \
  --ignore='^[/\\]\.gitignore$' --ignore='^[/\\]test-storage\.js$' --ignore='^[/\\]editor\.js$' --ignore='^[/\\]app\.js$' --ignore='^[/\\]extras\.js$' --ignore='^[/\\]cbg\.js$' --ignore='^[/\\]examen\.js$' --ignore='^[/\\]juegos4\.js$' --ignore='^[/\\]teoria\.js$' --ignore='^[/\\]sqltools\.js$' --ignore='^[/\\]pruebas\.js$' --ignore='^[/\\]i18n\.js$' --ignore='^[/\\]mas\.js$' --ignore='^[/\\]inicio\.js$' --ignore='^[/\\]warp\.js$' --ignore='^[/\\]juegos2\.js$' --ignore='^[/\\]juegos3\.js$' --ignore='^[/\\]preguntas\.js$' --ignore='^[/\\]juegos\.js$' --ignore='^[/\\]bdquiz\.js$' \
  --ignore='^[/\\]LEEME\.txt$' --ignore='^[/\\]CHANGELOG\.txt$' --ignore='\.zip$' --ignore='\.tar\.gz$' --ignore='\.icns$' --ignore='^[/\\]notes\.md$'
cp LEEME.txt CHANGELOG.txt "dist/$OUT/"
mv "dist/$OUT" "dist/Modelado Bases"
case "$PLAT" in
  win) F="Modelado-Bases-$VER-Windows.zip"; rm -f "$F"; (cd dist && zip -qr9 "../$F" "Modelado Bases");;
  linux) F="Modelado-Bases-$VER-Linux.tar.gz"; rm -f "$F"
    cat > "dist/Modelado Bases/modelado-bases.sh" <<'SH'
#!/bin/sh
# Abre Modelado Bases (doble clic o desde la terminal)
cd "$(dirname "$(readlink -f "$0")")" || exit 1
# si chrome-sandbox no tiene permisos de root (lo normal al descomprimir), se abre sin ese sandbox
if [ -u ./chrome-sandbox ] && [ "$(stat -c %u ./chrome-sandbox)" = 0 ]; then exec "./Modelado Bases" "$@"; fi
exec "./Modelado Bases" --no-sandbox "$@"
SH
    chmod +x "dist/Modelado Bases/modelado-bases.sh" "dist/Modelado Bases/Modelado Bases"
    tar -C dist -czf "$F" "Modelado Bases";;
  mac) F="Modelado-Bases-$VER-Mac.zip"; rm -f "$F"
    # firma ad hoc: sin ella macOS no abre la app en los Mac con chip Apple
    codesign --force --deep --sign - "dist/Modelado Bases/Modelado Bases.app"
    (cd dist && ditto -c -k --sequesterRsrc --keepParent "Modelado Bases" "../$F"); rm -f mb.icns;;
esac
echo "$F"
