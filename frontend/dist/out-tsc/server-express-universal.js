// server-express-universal.ts (Angular <=16 via @nguniversal/express-engine)
import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/app/app.server.module'; // TODO: adjust
import { APP_BASE_HREF } from '@angular/common';
export function app() {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/browser'); // TODO: adjust
    const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
    server.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
    server.set('view engine', 'html');
    server.set('views', distFolder);
    server.get('*.*', express.static(distFolder, { maxAge: '1y' }));
    server.get('*', (req, res) => {
        res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
    });
    return server;
}
function run() { const port = process.env['PORT'] || 4000; app().listen(port, () => console.log(`SSR on http://localhost:${port}`)); }
run();
//# sourceMappingURL=server-express-universal.js.map