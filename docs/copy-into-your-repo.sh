#!/usr/bin/env bash
set -e
TARGET=${1:-"../your-repo"}
mkdir -p "$TARGET/docs"
cp -R docs/* "$TARGET/docs/"
mkdir -p "$TARGET/docusaurus"
cp -R docusaurus/* "$TARGET/docusaurus/"
mkdir -p "$TARGET/.github/workflows"
cp -R .github/workflows/deploy-docs-vercel.yml "$TARGET/.github/workflows/"
echo "Copied docs and docusaurus site into $TARGET"
