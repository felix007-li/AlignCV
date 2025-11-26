export interface ProfileLink { type:'website'|'linkedin'|'github'|'portfolio'|'other'; url:string; }
export interface ProfileLocation { city?:string; region?:string; country?:string; }
export interface Profile { name?:string; headline?:string; email?:string; phone?:string; location?:ProfileLocation; links?:ProfileLink[]; summary?:string; }