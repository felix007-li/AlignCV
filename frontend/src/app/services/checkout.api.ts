import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' }) export class CheckoutApi { createSession(params:{ type:'one_time'|'subscription'; priceId:string; lang?:string }):Promise<{url:string,id:string}>{ return fetch('/api/checkout/session',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(params) }).then(r=>r.json()); } }
