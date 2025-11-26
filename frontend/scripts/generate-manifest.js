#!/usr/bin/env node
/**
 * Generate Content Manifest
 * Scans content directory and generates manifest.json
 * Structure: {kind}/{locale}/{role}.json
 * Output: manifest.json with routes and metadata
 */

const fs = require('fs');
const path = require('path');

const CONTENT_BASE = path.join(__dirname, '../src/assets/content');
const OUTPUT_PATH = path.join(CONTENT_BASE, 'manifest.json');
const KINDS = ['templates', 'examples'];

/**
 * Scan content directory and build manifest
 */
function buildManifest() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    total: 0,
    items: []
  };

  KINDS.forEach(kind => {
    const kindPath = path.join(CONTENT_BASE, kind);
    if (!fs.existsSync(kindPath)) {
      console.log(`⚠️  ${kind}/ not found, skipping`);
      return;
    }

    console.log(`\n📁 Scanning ${kind}/`);

    const locales = fs.readdirSync(kindPath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => item.name);

    locales.forEach(locale => {
      const localePath = path.join(kindPath, locale);
      const files = fs.readdirSync(localePath)
        .filter(f => f.endsWith('.json'));

      console.log(`  🌍 ${locale}: ${files.length} files`);

      files.forEach(file => {
        const role = file.replace('.json', '');
        const relativePath = `${kind}/${locale}/${file}`;

        manifest.items.push({
          kind,
          locale,
          role,
          path: relativePath,
          url: `/l/${locale}/${kind}/${role}`
        });

        manifest.total++;
      });
    });
  });

  return manifest;
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Generating content manifest\n');

  const manifest = buildManifest();

  // Sort items by kind, locale, role
  manifest.items.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.locale !== b.locale) return a.locale.localeCompare(b.locale);
    return a.role.localeCompare(b.role);
  });

  // Write manifest
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

  console.log(`\n✅ Generated manifest with ${manifest.total} items`);
  console.log(`📄 Written to: ${OUTPUT_PATH}\n`);

  // Show breakdown by kind
  const byKind = manifest.items.reduce((acc, item) => {
    acc[item.kind] = (acc[item.kind] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 Breakdown by kind:');
  Object.entries(byKind).forEach(([kind, count]) => {
    console.log(`  ${kind}: ${count}`);
  });
}

main();
