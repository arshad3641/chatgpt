#!/usr/bin/env bash
set -euo pipefail

ARTIFACT="artifacts/enterprise-spark-mcp-blueprint.tar.gz"
mkdir -p artifacts

tar \
  --exclude='./.git' \
  --exclude='./artifacts/*.tar.gz' \
  --exclude='./node_modules' \
  -czf "$ARTIFACT" \
  .

echo "Created $ARTIFACT"
