var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
export class UpdateSection {
    static { this.type = '[Resume] UpdateSection'; }
    constructor(index, content) {
        this.index = index;
        this.content = content;
    }
}
export class ApplySuggestion {
    static { this.type = '[Resume] ApplySuggestion'; }
    constructor(index, text) {
        this.index = index;
        this.text = text;
    }
}
export class UpdateSectionFields {
    static { this.type = '[Resume] Update Section Fields'; }
    constructor(index, fields) {
        this.index = index;
        this.fields = fields;
    }
}
export class SelectSection {
    static { this.type = '[Resume] SelectSection'; }
    constructor(index) {
        this.index = index;
    }
}
const defaults = {
    sections: [
        { title: 'Personal Details', content: '', suggestions: [] },
        {
            title: 'Profile',
            content: '',
            suggestions: [
                'Experienced professional with strong background...',
                'Detail-oriented individual with expertise...',
                'Motivated professional seeking to...'
            ]
        },
        {
            title: 'Experience',
            content: '',
            suggestions: [
                'Led a team of 4 to...',
                'Improved KPI by 23%...',
                'Automated process reducing...'
            ]
        },
        {
            title: 'Education',
            content: '',
            suggestions: [
                'B.Sc. in Computer Science',
                'Top 10% of class',
                'Relevant coursework included...'
            ]
        },
        { title: 'Skills', content: '', suggestions: [] },
        { title: 'Languages', content: '', suggestions: [] },
        { title: 'Courses', content: '', suggestions: [] },
        { title: 'Certificates', content: '', suggestions: [] }
    ],
    selectedIndex: 0
};
console.log('=== RESUME STATE DEFAULTS ===');
console.log('Default sections count:', defaults.sections.length);
console.log('Default section titles:', defaults.sections.map(s => s.title));
console.log('============================');
let ResumeState = class ResumeState {
    static sections(state) {
        return state.sections;
    }
    update({ getState, patchState }, { index, content }) {
        const state = getState();
        const sections = state.sections.slice();
        if (sections[index]) {
            sections[index] = { ...sections[index], content };
        }
        patchState({ sections });
    }
    updateFields({ getState, patchState }, { index, fields }) {
        const state = getState();
        const sections = state.sections.slice();
        if (sections[index]) {
            sections[index] = { ...sections[index], ...fields };
        }
        patchState({ sections });
    }
    apply({ getState, patchState }, { index, text }) {
        const state = getState();
        const sections = state.sections.slice();
        if (sections[index]) {
            sections[index] = {
                ...sections[index],
                content: (sections[index].content + '\n' + text).trim()
            };
        }
        patchState({ sections });
    }
    select(ctx, { index }) {
        ctx.patchState({ selectedIndex: index });
    }
};
__decorate([
    Action(UpdateSection)
], ResumeState.prototype, "update", null);
__decorate([
    Action(UpdateSectionFields)
], ResumeState.prototype, "updateFields", null);
__decorate([
    Action(ApplySuggestion)
], ResumeState.prototype, "apply", null);
__decorate([
    Action(SelectSection)
], ResumeState.prototype, "select", null);
__decorate([
    Selector()
], ResumeState, "sections", null);
ResumeState = __decorate([
    State({ name: 'resume', defaults })
], ResumeState);
export { ResumeState };
//# sourceMappingURL=resume.state.js.map