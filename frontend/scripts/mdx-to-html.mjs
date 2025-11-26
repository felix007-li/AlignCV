#!/usr/bin/env node
/* ... (see README for usage) ... */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import fg from "fast-glob";

const args = process.argv.slice(2);
function arg(name, def) { const i = args.indexOf(name); return i === -1 ? def : (args[i+1] ?? def); }
const IN = arg("--in", "content");
const OUT = arg("--out", "dist-mdx");
const MANIFEST = arg("--manifest", "");

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
async function ensureDir(p){ await fs.mkdir(p, { recursive: true }); }
async function renderOne(src, outRoot){
  const raw = await fs.readFile(src, "utf8");
  const { content, data } = matter(raw);
  const html = md.render(content);
  const rel = path.relative(IN, src).replace(/\.mdx$/i, ".html");
  const dest = path.join(outRoot, rel);
  await ensureDir(path.dirname(dest));
  await fs.writeFile(dest, `<!--frontmatter:${JSON.stringify(data)}-->\n${html}`, "utf8");
  return { src, dest, frontmatter: data };
}
async function main(){
  const files = await fg([`${IN}/**/*.mdx`], { dot: false });
  await ensureDir(OUT);
  const outManifest = [];
  for (const f of files){ outManifest.push(await renderOne(f, OUT)); }
  await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify(outManifest, null, 2), "utf8");
  if (MANIFEST){
    try {
      const m = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
      const routes = Array.from(new Set(m.map(x=>x.seo_route).filter(Boolean).sort()));
      if (routes.length){
        await ensureDir(path.join(OUT, "prerender"));
        await fs.writeFile(path.join(OUT, "prerender", "routes.txt"), routes.join("\n"), "utf8");
        await fs.writeFile(path.join(OUT, "prerender", "routes.json"), JSON.stringify(routes, null, 2), "utf8");
      }
    } catch(e){ console.warn("[mdx] manifest parse failed:", e.message); }
  }
  console.log("[mdx] done:", OUT);
}
main().catch(e=>{ console.error(e); process.exit(1); });
