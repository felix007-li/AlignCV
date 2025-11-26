import { Injectable } from '@angular/core'; import { Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' }) export class AuthApi { loginEmail(email:string):Observable<{ok:boolean}>{ return of({ ok:true }); } me():Observable<any>{ return of({ id:'u_1', email:'user@example.com' }); } }
