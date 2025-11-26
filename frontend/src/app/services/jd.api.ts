import { Injectable } from '@angular/core'; import { JdResult } from '../models/jd';
@Injectable({ providedIn: 'root' }) export class JdApi { analyze(jd:string, lang?:string):Promise<JdResult>{ const q=lang?`?lang=${lang}`:''; return fetch('/api/jd/analyze'+q,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ jd }) }).then(r=>r.json()); } }
