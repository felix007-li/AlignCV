var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Action, Selector } from '@ngxs/store';
export class LoadResume {
    static { this.type = '[ResumeEditor] Load'; }
    constructor(resumeId) {
        this.resumeId = resumeId;
    }
}
export class SelectSection {
    static { this.type = '[ResumeEditor] Select Section'; }
    constructor(sectionId) {
        this.sectionId = sectionId;
    }
}
export class UpdateSection {
    static { this.type = '[ResumeEditor] Update Section'; }
    constructor(sectionId, patch) {
        this.sectionId = sectionId;
        this.patch = patch;
    }
}
export class ApplySuggestion {
    static { this.type = '[ResumeEditor] Apply Suggestion'; }
    constructor(sectionId, text) {
        this.sectionId = sectionId;
        this.text = text;
    }
}
export class UpdatePersonalForm {
    static { this.type = '[ResumeEditor] Update PersonalForm'; }
    constructor(patch) {
        this.patch = patch;
    }
}
export class ImportLinkedIn {
    static { this.type = '[ResumeEditor] Import LinkedIn'; }
    constructor(profile) {
        this.profile = profile;
    }
}
export class ImportResumePayload {
    static { this.type = '[ResumeEditor] Import Resume Payload'; }
    constructor(payload) {
        this.payload = payload;
    }
}
let ResumeEditorState = class ResumeEditorState {
    static sections(s) { return s.sections; }
    static personalForm(s) { return s.personalForm; }
    static current(s) { return s.sections.find(x => x.id === s.selectedSectionId) || null; }
    load(ctx, { resumeId }) {
        ctx.patchState({ resumeId });
    }
    select(ctx, { sectionId }) {
        ctx.patchState({ selectedSectionId: sectionId });
    }
    update(ctx, { sectionId, patch }) {
        const s = ctx.getState();
        ctx.patchState({ sections: s.sections.map(sec => sec.id === sectionId ? { ...sec, ...patch } : sec) });
    }
    apply(ctx, { sectionId, text }) {
        const s = ctx.getState();
        const sec = s.sections.find(x => x.id === sectionId);
        if (!sec)
            return;
        const merged = (sec.content ? sec.content + '\n' : '') + text;
        ctx.patchState({ sections: s.sections.map(x => x.id === sectionId ? { ...x, content: merged } : x) });
    }
    updatePersonal(ctx, { patch }) {
        const s = ctx.getState();
        const pf = { ...s.personalForm, ...patch };
        const personalLines = [pf.name && `Name: ${pf.name}`, pf.email && `Email: ${pf.email}`, pf.phone && `Phone: ${pf.phone}`, pf.city && `City: ${pf.city}`].filter(Boolean).join('\n');
        ctx.patchState({
            personalForm: pf,
            sections: s.sections.map(sec => sec.kind === 'personal' ? { ...sec, content: personalLines } : sec)
        });
    }
    importLinkedIn(ctx, { profile }) {
        const s = ctx.getState();
        const pf = { name: profile.name || s.personalForm.name, email: profile.email || s.personalForm.email, phone: profile.phone || s.personalForm.phone, city: profile.city || s.personalForm.city };
        const eduLines = (profile.education || []).map(e => `**${e.degree || ''}**, ${e.school}${e.end ? ' — ' + e.end : ''}`.trim());
        const empLines = [];
        (profile.experiences || []).forEach(exp => {
            empLines.push(`${exp.start || ''} — ${exp.end || 'Present'} | **${exp.title}**, ${exp.company}${exp.city ? ' — ' + exp.city : ''}`.trim());
            (exp.bullets || []).forEach(b => empLines.push('• ' + b));
        });
        const next = s.sections.map(sec => {
            if (sec.kind === 'personal')
                return { ...sec, content: [pf.name && 'Name: ' + pf.name, pf.email && 'Email: ' + pf.email, pf.phone && 'Phone: ' + pf.phone, pf.city && 'City: ' + pf.city].filter(Boolean).join('\n') };
            if (sec.kind === 'profile')
                return { ...sec, content: profile.headline || sec.content };
            if (sec.kind === 'education')
                return { ...sec, content: eduLines.join('\n') };
            if (sec.kind === 'employment')
                return { ...sec, content: empLines.join('\n') };
            return sec;
        });
        ctx.patchState({ personalForm: pf, sections: next });
    }
    importResume(ctx, { payload }) {
        const s = ctx.getState();
        const pf = { ...s.personalForm, ...(payload.personal || {}) };
        const next = s.sections.map(sec => {
            if (sec.kind === 'personal') {
                const lines = [pf.name && 'Name: ' + pf.name, pf.email && 'Email: ' + pf.email, pf.phone && 'Phone: ' + pf.phone, pf.city && 'City: ' + pf.city].filter(Boolean).join('\n');
                return { ...sec, content: lines };
            }
            if (sec.kind === 'profile' && payload.profile)
                return { ...sec, content: payload.profile };
            if (sec.kind === 'education' && payload.education)
                return { ...sec, content: payload.education.join('\n') };
            if (sec.kind === 'employment' && payload.employment)
                return { ...sec, content: payload.employment.join('\n') };
            return sec;
        });
        ctx.patchState({ personalForm: pf, sections: next });
    }
};
__decorate([
    Action(LoadResume)
], ResumeEditorState.prototype, "load", null);
__decorate([
    Action(SelectSection)
], ResumeEditorState.prototype, "select", null);
__decorate([
    Action(UpdateSection)
], ResumeEditorState.prototype, "update", null);
__decorate([
    Action(ApplySuggestion)
], ResumeEditorState.prototype, "apply", null);
__decorate([
    Action(UpdatePersonalForm)
], ResumeEditorState.prototype, "updatePersonal", null);
__decorate([
    Action(ImportLinkedIn)
], ResumeEditorState.prototype, "importLinkedIn", null);
__decorate([
    Action(ImportResumePayload)
], ResumeEditorState.prototype, "importResume", null);
__decorate([
    Selector()
], ResumeEditorState, "sections", null);
__decorate([
    Selector()
], ResumeEditorState, "personalForm", null);
__decorate([
    Selector()
], ResumeEditorState, "current", null);
ResumeEditorState = __decorate([
    State({
        name: 'resumeEditor',
        defaults: {
            resumeId: null,
            locale: 'en',
            sections: [
                { id: 'sec-personal', kind: 'personal', title: 'Personal details', content: '' },
                { id: 'sec-profile', kind: 'profile', title: 'Profile', content: '' },
                { id: 'sec-education', kind: 'education', title: 'Education', content: '' },
                { id: 'sec-employment', kind: 'employment', title: 'Employment', content: '' }
            ],
            selectedSectionId: 'sec-employment',
            personalForm: { name: '', email: '', phone: '', city: '' }
        }
    })
], ResumeEditorState);
export { ResumeEditorState };
//# sourceMappingURL=resume-editor.state.js.map