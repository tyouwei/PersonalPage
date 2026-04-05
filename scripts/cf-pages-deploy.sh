#!/bin/sh
# Uploads ./out to Cloudflare Pages (run from app root; script cd's there if needed).
#
# Project: CF_PAGES_PROJECT_NAME or PAGES_PROJECT_NAME, else wrangler.toml `name`.
set -e
ROOT="$(CDPATH= cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NAME="${CF_PAGES_PROJECT_NAME:-${PAGES_PROJECT_NAME:-}}"
if [ -n "$NAME" ]; then
  exec wrangler pages deploy out --project-name="$NAME"
fi
exec wrangler pages deploy out
