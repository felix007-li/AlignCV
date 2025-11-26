export interface Block { id:string; type:string; data:any; }
export interface Resume { id:string; title:string; locale:string; blocks:Block[]; atsScore?:number; updatedAt?:string; }
