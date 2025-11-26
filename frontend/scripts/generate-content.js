// Usage:
//   node scripts/generate-content.js ./frontend/src/assets/content --count=200
// Generates template/example JSON files per locale/city/role.
const fs = require('fs');
const path = require('path');

const arg = (k, d=null) => {
  const m = process.argv.find(x => x.startsWith(k+'='));
  return m ? m.split('=').slice(1).join('=') : d;
};

const outDir = process.argv[2] || './frontend/src/assets/content';
const COUNT = parseInt(arg('--count', '120'), 10);

const locales = ['en-CA','en-US','fr-CA','es-MX','es-AR','es-CL','pt-BR'];
const cities = {
  'en-CA':['toronto','vancouver','montreal'],
  'en-US':['new-york','seattle','austin','sf'],
  'fr-CA':['montreal','quebec'],
  'es-MX':['cdmx','guadalajara','monterrey'],
  'es-AR':['buenos-aires','cordoba'],
  'es-CL':['santiago','valparaiso'],
  'pt-BR':['sao-paulo','rio-de-janeiro']
};
const roles = ['software-engineer','data-analyst','qa-engineer','ux-designer','customer-support','sales-rep','project-manager'];

function titleize(s){ return s.replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase()); }
function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function html(kind, locale, city, role){
  const h1 = `${titleize(kind)} — ${titleize(role)} in ${titleize(city)} (${locale})`;
  return `
<h1>${h1}</h1>
<p>This ${kind} is ATS‑friendly and localized for ${locale}. Tailor to the job posting and keep bullets concise.</p>
<h2>Highlights</h2>
<ul>
  <li>Action verbs + metrics</li>
  <li>Industry keywords for ${titleize(role)}</li>
  <li>City focus: ${titleize(city)}</li>
</ul>
<h2>Example Bullets</h2>
<ul>
  <li>Led feature launch improving conversion by 18%.</li>
  <li>Automated regression suite cutting release time by 35%.</li>
  <li>Partnered with cross‑functional teams to deliver on time.</li>
</ul>
`;
}

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function writeJson(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8'); }

// Clear output
fs.rmSync(outDir, { recursive: true, force: true });
ensureDir(outDir);

const manifest = [];
let produced = 0;
outer: for (const locale of locales){
  for (const city of (cities[locale]||['global'])){
    for (const role of roles){
      for (const kind of ['templates','examples']){
        const slug = `${locale}/${city}/${role}`;
        const file = path.join(outDir, kind, locale, city, `${role}.json`);
        writeJson(file, { title: `${titleize(kind.slice(0,-1))}: ${titleize(role)} — ${titleize(city)} (${locale})`, locale, city, role, kind: kind.slice(0,-1), html: html(kind.slice(0,-1), locale, city, role) });
        manifest.push({ kind, locale, city, role, path: file.replace(/^.*?\/assets\/content\//, '') });
        produced++;
        if (produced >= COUNT) break outer;
      }
    }
  }
}

writeJson(path.join(outDir, 'manifest.json'), { generatedAt: new Date().toISOString(), total: produced, items: manifest });
console.log(`[ok] generated ${produced} items at ${outDir}`);
