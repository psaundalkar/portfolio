#!/bin/bash
# Run this to stop tracking large folders and push a small repo to GitHub.
# Fixes: HTTP 408 / 4.99 GiB push (node_modules, dist were committed by mistake)

set -e
cd "$(dirname "$0")"

echo "Removing large folders from Git tracking (files stay on disk)..."
git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached server/node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true

echo "Staging .gitignore and cleanup..."
git add .gitignore
git status

echo ""
echo "Commit the cleanup, then push:"
echo "  git commit -m 'Stop tracking node_modules and dist'"
echo "  git push -u origin main"
echo ""
echo "If you already pushed the huge commit, you may need to force-push after this:"
echo "  git push -u origin main --force"
