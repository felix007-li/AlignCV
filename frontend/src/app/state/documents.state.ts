import { State, Action, Selector, StateContext } from '@ngxs/store';

export interface ResumeDoc { id: string; title: string; updatedAt: string; template?: string; }
export interface CoverDoc  { id: string; title: string; updatedAt: string; resumeId?: string; }

export interface DocumentsStateModel {
  resumes: ResumeDoc[];
  covers: CoverDoc[];
  recentIds: string[]; // resume or cover IDs with prefix (e.g., 'r:123', 'c:456')
}

export class LoadResumes { static readonly type = '[Documents] Load Resumes'; constructor(public payload: ResumeDoc[]){} }
export class LoadCovers  { static readonly type = '[Documents] Load Covers';  constructor(public payload: CoverDoc[]){} }
export class AddResume   { static readonly type = '[Documents] Add Resume';   constructor(public payload: ResumeDoc){} }
export class AddCover    { static readonly type = '[Documents] Add Cover';    constructor(public payload: CoverDoc){} }
export class TouchRecent { static readonly type = '[Documents] Touch Recent'; constructor(public id: string){} }

@State<DocumentsStateModel>({
  name: 'documents',
  defaults: { resumes: [], covers: [], recentIds: [] }
})
export class DocumentsState {
  @Selector() static resumes(s: DocumentsStateModel) { return s.resumes; }
  @Selector() static covers(s: DocumentsStateModel) { return s.covers; }
  @Selector() static recents(s: DocumentsStateModel) {
    const ids = s.recentIds.slice(0, 10);
    const map: any = {};
    s.resumes.forEach(r => map['r:'+r.id] = { kind: 'resume', title: r.title });
    s.covers.forEach(c => map['c:'+c.id]  = { kind: 'cover', title: c.title  });
    return ids.map(id => ({ id, ...map[id] })).filter(Boolean);
  }

  @Action(LoadResumes) loadResumes(ctx: StateContext<DocumentsStateModel>, { payload }: LoadResumes) {
    ctx.patchState({ resumes: payload });
  }
  @Action(LoadCovers) loadCovers(ctx: StateContext<DocumentsStateModel>, { payload }: LoadCovers) {
    ctx.patchState({ covers: payload });
  }
  @Action(AddResume) addResume(ctx: StateContext<DocumentsStateModel>, { payload }: AddResume) {
    const state = ctx.getState();
    ctx.patchState({ resumes: [payload, ...state.resumes] });
    ctx.dispatch(new TouchRecent('r:'+payload.id));
  }
  @Action(AddCover) addCover(ctx: StateContext<DocumentsStateModel>, { payload }: AddCover) {
    const state = ctx.getState();
    ctx.patchState({ covers: [payload, ...state.covers] });
    ctx.dispatch(new TouchRecent('c:'+payload.id));
  }
  @Action(TouchRecent) touchRecent(ctx: StateContext<DocumentsStateModel>, { id }: TouchRecent) {
    const s = ctx.getState();
    const arr = [id, *s.recentIds.filter(x => x != id)];
    ctx.patchState({ recentIds: arr });
  }
}
