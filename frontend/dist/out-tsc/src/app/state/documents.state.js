var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Action, Selector } from '@ngxs/store';
export class LoadResumes {
    static { this.type = '[Documents] Load Resumes'; }
    constructor(payload) {
        this.payload = payload;
    }
}
export class LoadCovers {
    static { this.type = '[Documents] Load Covers'; }
    constructor(payload) {
        this.payload = payload;
    }
}
export class AddResume {
    static { this.type = '[Documents] Add Resume'; }
    constructor(payload) {
        this.payload = payload;
    }
}
export class AddCover {
    static { this.type = '[Documents] Add Cover'; }
    constructor(payload) {
        this.payload = payload;
    }
}
export class TouchRecent {
    static { this.type = '[Documents] Touch Recent'; }
    constructor(id) {
        this.id = id;
    }
}
let DocumentsState = class DocumentsState {
    static resumes(s) { return s.resumes; }
    static covers(s) { return s.covers; }
    static recents(s) {
        const ids = s.recentIds.slice(0, 10);
        const map = {};
        s.resumes.forEach(r => map['r:' + r.id] = { kind: 'resume', title: r.title });
        s.covers.forEach(c => map['c:' + c.id] = { kind: 'cover', title: c.title });
        return ids.map(id => ({ id, ...map[id] })).filter(Boolean);
    }
    loadResumes(ctx, { payload }) {
        ctx.patchState({ resumes: payload });
    }
    loadCovers(ctx, { payload }) {
        ctx.patchState({ covers: payload });
    }
    addResume(ctx, { payload }) {
        const state = ctx.getState();
        ctx.patchState({ resumes: [payload, ...state.resumes] });
        ctx.dispatch(new TouchRecent('r:' + payload.id));
    }
    addCover(ctx, { payload }) {
        const state = ctx.getState();
        ctx.patchState({ covers: [payload, ...state.covers] });
        ctx.dispatch(new TouchRecent('c:' + payload.id));
    }
    touchRecent(ctx, { id }) {
        const s = ctx.getState();
        const arr = [id, ...s.recentIds.filter(x => x !== id)];
        ctx.patchState({ recentIds: arr });
    }
};
__decorate([
    Action(LoadResumes)
], DocumentsState.prototype, "loadResumes", null);
__decorate([
    Action(LoadCovers)
], DocumentsState.prototype, "loadCovers", null);
__decorate([
    Action(AddResume)
], DocumentsState.prototype, "addResume", null);
__decorate([
    Action(AddCover)
], DocumentsState.prototype, "addCover", null);
__decorate([
    Action(TouchRecent)
], DocumentsState.prototype, "touchRecent", null);
__decorate([
    Selector()
], DocumentsState, "resumes", null);
__decorate([
    Selector()
], DocumentsState, "covers", null);
__decorate([
    Selector()
], DocumentsState, "recents", null);
DocumentsState = __decorate([
    State({
        name: 'documents',
        defaults: { resumes: [], covers: [], recentIds: [] }
    })
], DocumentsState);
export { DocumentsState };
//# sourceMappingURL=documents.state.js.map