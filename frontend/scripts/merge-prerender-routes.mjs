#!/usr/bin/env node
import fs from "fs/promises";
import process from "process";

const args = process.argv.slice(2);
function arg(name, def){ const i=args.indexOf(name); return i===-1?def:(args[i+1]??def); }
const ROUTES_FILE = arg("--routes", "dist-mdx/prerender/routes.txt");
const ANGULAR_JSON = arg("--angular", "angular.json");
const PROJECT = arg("--project", "");
const DRY = args.includes("--dry");

function uniq(arr){ return Array.from(new Set(arr)); }

const text = await fs.readFile(ROUTES_FILE, "utf8");
const routes = text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
if (!routes.length) { console.error("no routes"); process.exit(1); }

const raw = JSON.parse(await fs.readFile(ANGULAR_JSON, "utf8"));
let project = PROJECT || raw.defaultProject || Object.keys(raw.projects||{})[0];
if (!project || !raw.projects[project]) { console.error("no project found"); process.exit(1); }

const proj = raw.projects[project];
const architect = proj.architect || proj.targets || {};
const prerender = architect.prerender;
if (!prerender) { console.error("no prerender target"); process.exit(1); }
const options = prerender.options || (prerender.options = {});
const existing = Array.isArray(options.routes) ? options.routes : [];
options.routes = uniq(existing.concat(routes)).sort();

if (DRY){ console.log("[dry] would write", options.routes.length, "routes"); }
else { await fs.writeFile(ANGULAR_JSON, JSON.stringify(raw, null, 2), "utf8"); console.log("updated", ANGULAR_JSON, "routes:", options.routes.length); }
