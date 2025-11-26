#!/usr/bin/env node
/**
 * Flatten Content Structure
 * Removes city layer from content files
 * Before: content/{kind}/{locale}/{city}/{role}.json
 * After:  content/{kind}/{locale}/{role}.json
 */

const fs = require('fs');
const path = require('path');

const CONTENT_BASE = path.join(__dirname, '../src/assets/content');
const KINDS = ['templates', 'examples'];

/**
 * Get the first city directory (alphabetically) for a locale
 */
function getFirstCity(kindPath, locale) {
  const localePath = path.join(kindPath, locale);
  if (!fs.existsSync(localePath)) return null;

  const items = fs.readdirSync(localePath, { withFileTypes: true });
  const cities = items.filter(item => item.isDirectory()).map(item => item.name);

  return cities.length > 0 ? cities[0] : null;
}

/**
 * Move files from first city to locale level
 */
function flattenLocale(kindPath, locale) {
  const localePath = path.join(kindPath, locale);
  const firstCity = getFirstCity(kindPath, locale);

  if (!firstCity) {
    console.log(`  ⚠️  No cities found for ${locale}, skipping`);
    return;
  }

  const cityPath = path.join(localePath, firstCity);
  const files = fs.readdirSync(cityPath).filter(f => f.endsWith('.json'));

  console.log(`  📂 Moving ${files.length} files from ${firstCity}/`);

  // Move files to locale level
  files.forEach(file => {
    const srcPath = path.join(cityPath, file);
    const destPath = path.join(localePath, file);

    // Update the JSON file to remove city reference
    const content = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));
    delete content.city; // Remove city field if present

    fs.writeFileSync(destPath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
    console.log(`    ✓ ${file}`);
  });

  // Remove all city directories
  const cityDirs = fs.readdirSync(localePath, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

  cityDirs.forEach(city => {
    const cityDirPath = path.join(localePath, city);
    fs.rmSync(cityDirPath, { recursive: true, force: true });
    console.log(`  🗑️  Removed ${locale}/${city}/`);
  });
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Flattening content structure (removing city layer)\n');

  KINDS.forEach(kind => {
    const kindPath = path.join(CONTENT_BASE, kind);
    if (!fs.existsSync(kindPath)) {
      console.log(`⚠️  ${kind}/ not found, skipping`);
      return;
    }

    console.log(`\n📁 Processing ${kind}/`);

    const locales = fs.readdirSync(kindPath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .map(item => item.name);

    locales.forEach(locale => {
      console.log(`\n  🌍 ${locale}`);
      flattenLocale(kindPath, locale);
    });
  });

  console.log('\n✅ Content structure flattened successfully!');
  console.log('\nNew structure:');
  console.log('  templates/{locale}/{role}.json');
  console.log('  examples/{locale}/{role}.json\n');
}

main();
