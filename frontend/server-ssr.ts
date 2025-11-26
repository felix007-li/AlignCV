// server-ssr.ts (Angular >=17 via @angular/ssr CommonEngine)
import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './src/main.server'; // TODO

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser'); // TODO
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const commonEngine = new CommonEngine();
  server.get('*.*', express.static(distFolder, { maxAge: '1y' }));
  server.get('*', async (req, res, next) => {
    try {
      const html = await commonEngine.render({ bootstrap, documentFilePath: join(distFolder, indexHtml + '.html'), url: `${req.protocol}://${req.get('host')}${req.originalUrl}` });
      res.status(200).send(html);
    } catch (e){ next(e); }
  });
  return server;
}
function run(){ const port = process.env['PORT'] || 4000; app().listen(port, () => console.log(`SSR on http://localhost:${port}`)); }
run();
