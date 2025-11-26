#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const baseDir = 'frontend/src/assets/content';

// Additional roles to add
const additionalRoles = ['marketing-manager', 'product-manager', 'devops-engineer', 'data-scientist', 'ui-designer', 'backend-developer'];

// Locale configurations with cities
const localeConfig = {
  'es-AR': { cities: ['buenos-aires', 'cordoba'], needed: 12 },
  'es-CL': { cities: ['santiago', 'valparaiso'], needed: 12 },
  'es-MX': { cities: ['cdmx', 'guadalajara', 'monterrey'], needed: 4 },
  'fr-CA': { cities: ['montreal', 'quebec', 'ottawa'], needed: 4 },
  'pt-BR': { cities: ['sao-paulo', 'rio-de-janeiro', 'brasilia'], needed: 4 },
  'en': { cities: ['new-york', 'san-francisco'], needed: 18 }
};

const manifest = JSON.parse(fs.readFileSync(path.join(baseDir, 'manifest.json'), 'utf8'));
let itemsAdded = 0;
const newItems = [];

// Generate additional content for each locale
Object.entries(localeConfig).forEach(([locale, config]) => {
  let added = 0;
  const { cities, needed } = config;

  for (const city of cities) {
    for (const role of additionalRoles) {
      if (added >= needed) break;

      // Create template
      const templatePath = `templates/${locale}/${city}/${role}.json`;
      const templateFullPath = path.join(baseDir, templatePath);

      if (!fs.existsSync(templateFullPath)) {
        fs.mkdirSync(path.dirname(templateFullPath), { recursive: true });

        const roleTitle = role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const cityTitle = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const templateContent = {
          title: `Template: ${roleTitle} — ${cityTitle} (${locale})`,
          locale,
          city,
          role,
          kind: 'template',
          html: `<h1>Template — ${roleTitle} in ${cityTitle} (${locale})</h1>
<p>ATS‑ready template localized for ${locale}. Use action verbs and quantify impact.</p>
<ul>
<li>Optimized core processes; improved efficiency by 25%.</li>
<li>Led cross-functional teams to deliver key initiatives.</li>
<li>Collaborated with stakeholders to achieve strategic goals.</li>
</ul>`
        };

        fs.writeFileSync(templateFullPath, JSON.stringify(templateContent, null, 2), 'utf8');

        newItems.push({
          kind: 'templates',
          locale,
          city,
          role,
          path: templatePath
        });

        added++;
        itemsAdded++;
      }

      if (added >= needed) break;

      // Create example
      const examplePath = `examples/${locale}/${city}/${role}.json`;
      const exampleFullPath = path.join(baseDir, examplePath);

      if (!fs.existsSync(exampleFullPath) && added < needed) {
        fs.mkdirSync(path.dirname(exampleFullPath), { recursive: true });

        const roleTitle = role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const cityTitle = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const exampleContent = {
          title: `Example: ${roleTitle} — ${cityTitle} (${locale})`,
          locale,
          city,
          role,
          kind: 'example',
          html: `<h1>Example — ${roleTitle} in ${cityTitle} (${locale})</h1>
<p>Sample resume demonstrating best practices for ${locale} market.</p>
<ul>
<li>Achieved 30% growth in key performance metrics.</li>
<li>Managed complex projects with international teams.</li>
<li>Implemented innovative solutions that reduced costs.</li>
</ul>`
        };

        fs.writeFileSync(exampleFullPath, JSON.stringify(exampleContent, null, 2), 'utf8');

        newItems.push({
          kind: 'examples',
          locale,
          city,
          role,
          path: examplePath
        });

        added++;
        itemsAdded++;
      }
    }

    if (added >= needed) break;
  }

  console.log(`${locale}: added ${added} items`);
});

// Update manifest
manifest.items = [...manifest.items, ...newItems];
manifest.total = manifest.items.length;
manifest.generatedAt = new Date().toISOString();

fs.writeFileSync(
  path.join(baseDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log(`\nTotal items added: ${itemsAdded}`);
console.log(`New manifest total: ${manifest.total}`);
