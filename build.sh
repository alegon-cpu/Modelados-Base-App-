#!/usr/bin/env bash
# Construye "Modelado-Bases-<versión>-Windows.zip" a partir del código (se usa aquí y en GitHub Actions).
set -euo pipefail
cd "$(dirname "$0")"
VER=$(node -p "require('./package.json').version")
cat editor.js app.js > renderer.js
node --check renderer.js
rm -rf dist "Modelado-Bases-$VER-Windows.zip"
npx --no-install electron-packager . "Modelado Bases" --platform=win32 --arch=x64 --electron-version=33.2.1 \
  --app-version="$VER" --out=dist --overwrite --asar --app-copyright="Modelado Bases" \
  --ignore='^/dist' --ignore='^/\.github' --ignore='^/build\.sh$' --ignore='^/release-notes\.sh$' --ignore='^/README\.md$' \
  --ignore='^/\.gitignore$' --ignore='^/test-storage\.js$' --ignore='^/editor\.js$' --ignore='^/app\.js$' \
  --ignore='^/LEEME\.txt$' --ignore='^/CHANGELOG\.txt$' --ignore='\.zip$' --ignore='^/notes\.md$'
cp LEEME.txt CHANGELOG.txt "dist/Modelado Bases-win32-x64/"
mv "dist/Modelado Bases-win32-x64" "dist/Modelado Bases"
(cd dist && zip -qr9 "../Modelado-Bases-$VER-Windows.zip" "Modelado Bases")
echo "Modelado-Bases-$VER-Windows.zip"
