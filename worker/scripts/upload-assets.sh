#!/usr/bin/env bash
# Uploads everything in private-assets/ to the private R2 bucket, preserving paths.
#
#   private-assets/artifex/uiux/01.webp  ->  R2 key  artifex/uiux/01.webp
#
# private-assets/ is gitignored, so the originals never enter the repo.
#
#   cd worker && npm run upload

set -euo pipefail

BUCKET="traychen-private"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$ROOT/private-assets"

if [ ! -d "$SRC" ]; then
  echo "No $SRC directory. Create it and put the protected images inside, e.g."
  echo "  $SRC/artifex/uiux/01.webp"
  exit 1
fi

cd "$ROOT/worker"

find "$SRC" -type f ! -name '.DS_Store' -print0 | while IFS= read -r -d '' file; do
  key="${file#"$SRC"/}"
  echo "-> $key"
  npx wrangler r2 object put "$BUCKET/$key" --file "$file" --remote
done

echo "Done. Keys must match PROTECTED_PROJECTS in src/index.js."
