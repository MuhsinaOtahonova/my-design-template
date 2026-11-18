#!/usr/bin/env bash
# Builds the public demo site into ./site:
#   /            showcase (web + mobile previews, every component)
#   /web/        apps/web-starter
#   /mobile/     apps/mobile-starter exported for the web (Expo)
#   /storybook/  apps/docs
# BASE_PATH is the path the site is served from, e.g. /my-design-template
set -euo pipefail
BASE_PATH="${BASE_PATH:-}"

pnpm build
(cd apps/mobile-starter && EXPO_BASE_URL="$BASE_PATH/mobile" npx expo export --platform web --output-dir dist)

rm -rf site
cp -r apps/showcase/dist site
cp -r apps/web-starter/dist site/web
cp -r apps/mobile-starter/dist site/mobile
cp -r apps/docs/storybook-static site/storybook
touch site/.nojekyll
echo "Demo site ready in ./site"
