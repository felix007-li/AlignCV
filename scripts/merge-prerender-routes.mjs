#!/usr/bin/env node
import fs from 'fs';
const args=process.argv.slice(2); const opt=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;}
const routesFile=opt('--routes','dist-mdx/prerender/routes.txt'); const angularJson=opt('--angular','frontend/angular.json');
if(!fs.existsSync(routesFile)) { console.error('routes file not found'); process.exit(2); }
if(!fs.existsSync(angularJson)) { console.error('angular.json not found'); process.exit(2); }
const add=fs.readFileSync(routesFile,'utf8').split(/\n/).filter(Boolean);
const js=JSON.parse(fs.readFileSync(angularJson,'utf8'));
const proj=js.projects[Object.keys(js.projects)[0]];
proj.architect = proj.architect || {}; proj.architect.prerender = proj.architect.prerender || { builder: '@angular-devkit/build-angular:prerender', options: {} };
const opts = proj.architect.prerender.options = proj.architect.prerender.options || {};
opts.routes = Array.from(new Set([...(opts.routes||[]), ...add]));
fs.writeFileSync(angularJson, JSON.stringify(js,null,2),'utf8');
console.log('[merge routes]', add.length);
