#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};

const manifestPath = opt('--manifest', 'frontend/src/assets/content/manifest.json');
const outputPath = opt('--out', 'dist-mdx/prerender/routes-from-manifest.txt');

if (!fs.existsSync(manifestPath)) {
  console.error('manifest.json not found at:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const routes = new Set();

// Generate routes from manifest items
manifest.items.forEach(item => {
  // Based on CLAUDE.md: /templates/:locale/:city/:role/:industry/:level
  const industry = item.industry || 'technology';
  const level = item.level || 'all';

  if (item.kind === 'templates') {
    routes.add(`/templates/${item.locale}/${item.city}/${item.role}/${industry}/${level}`);
  } else if (item.kind === 'examples') {
    routes.add(`/examples/${item.locale}/${item.city}/${item.role}/${industry}/${level}`);
  }
});

// Create output directory
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Write routes to file
fs.writeFileSync(outputPath, Array.from(routes).sort().join('\n'), 'utf8');

console.log(`[generate-routes-from-manifest] Generated ${routes.size} routes`);
console.log(`Output: ${outputPath}`);
