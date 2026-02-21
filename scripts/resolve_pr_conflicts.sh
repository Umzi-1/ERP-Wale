#!/usr/bin/env bash
set -euo pipefail

# Resolves known PR conflicts by keeping this branch's Phase-1 MVP versions.
# Run this only when git reports merge conflicts.

FILES=(app.js index.html styles.css README.md)

if ! git diff --name-only --diff-filter=U | grep -q .; then
  echo "No merge conflicts detected. Nothing to resolve."
  exit 0
fi

for file in "${FILES[@]}"; do
  if git diff --name-only --diff-filter=U | grep -qx "$file"; then
    git checkout --ours -- "$file"
    git add "$file"
    echo "Resolved with current branch version: $file"
  fi
done

remaining=$(git diff --name-only --diff-filter=U || true)
if [[ -n "$remaining" ]]; then
  echo "Remaining unresolved files:" >&2
  echo "$remaining" >&2
  exit 1
fi

echo "Conflicts resolved for target files."
echo "Next: run tests, then commit:"
echo "  git commit -m 'Resolve merge conflicts in Phase-1 files'"
