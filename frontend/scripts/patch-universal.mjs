#!/usr/bin/env node
import fs from 'fs/promises';
const args = process.argv.slice(2);
function arg(n,d){ const i=args.indexOf(n); return i===-1?d:(args[i+1]??d); }
const ANGULAR = arg('--angular','angular.json'); let PROJECT = arg('--project','');
const raw = JSON.parse(await fs.readFile(ANGULAR,'utf8'));
if(!PROJECT) PROJECT = raw.defaultProject || Object.keys(raw.projects||{})[0];
if(!PROJECT || !raw.projects[PROJECT]){ console.error('Project not found'); process.exit(1); }
const proj = raw.projects[PROJECT]; const architect = proj.architect || (proj.architect = {});
architect.server = architect.server || { "builder": "@angular-devkit/build-angular:server", "options": { "outputPath": "dist/server", "main": "src/main.server.ts", "tsConfig": "tsconfig.server.json" }, "configurations": { "production": { "optimization": true, "sourceMap": false } } };
architect.prerender = architect.prerender || { "builder": "@angular-devkit/build-angular:prerender", "options": { "browserTarget": `${PROJECT}:build:production`, "serverTarget": `${PROJECT}:server:production`, "routes": ["/"] } };
await fs.writeFile(ANGULAR, JSON.stringify(raw,null,2), 'utf8'); console.log('Patched', ANGULAR, 'for', PROJECT);
