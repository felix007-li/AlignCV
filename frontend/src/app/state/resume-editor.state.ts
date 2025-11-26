import { State, Action, StateContext, Selector } from '@ngxs/store';

export type SectionKind = 'personal'|'profile'|'education'|'employment'|'skills'|'projects';
export interface Section { id: string; kind: SectionKind; title: string; content: string; }
export interface PersonalForm { name: string; email: string; phone: string; city: string; }
export interface ResumeEditorModel {
  resumeId: string | null;
  locale: string;
  sections: Section[];
  selectedSectionId: string | null;
  personalForm: PersonalForm;
}

export class LoadResume { static readonly type = '[ResumeEditor] Load'; constructor(public resumeId: string) {} }
export class SelectSection { static readonly type = '[ResumeEditor] Select Section'; constructor(public sectionId: string) {} }
export class UpdateSection { static readonly type = '[ResumeEditor] Update Section'; constructor(public sectionId: string, public patch: Partial<Section>) {} }
export class ApplySuggestion { static readonly type = '[ResumeEditor] Apply Suggestion'; constructor(public sectionId: string, public text: string) {} }
export class UpdatePersonalForm { static readonly type = '[ResumeEditor] Update PersonalForm'; constructor(public patch: Partial<PersonalForm>) {} }

export type LinkedInProfile = { name?: string; email?: string; phone?: string; city?: string; headline?: string;
  experiences?: { title: string; company: string; city?: string; start?: string; end?: string; bullets?: string[] }[];
  education?: { school: string; degree?: string; end?: string }[] };
export class ImportLinkedIn { static readonly type = '[ResumeEditor] Import LinkedIn'; constructor(public profile: LinkedInProfile) {} }

export type ResumePayload = { personal?: { name?: string; email?: string; phone?: string; city?: string }, profile?: string, education?: string[], employment?: string[] };
export class ImportResumePayload { static readonly type = '[ResumeEditor] Import Resume Payload'; constructor(public payload: ResumePayload) {} }

@State<ResumeEditorModel>({
  name: 'resumeEditor',
  defaults: {
    resumeId: null,
    locale: 'en',
    sections: [
      { id: 'sec-personal',   kind: 'personal',   title: 'Personal details', content: '' },
      { id: 'sec-profile',    kind: 'profile',    title: 'Profile',          content: '' },
      { id: 'sec-education',  kind: 'education',  title: 'Education',        content: '' },
      { id: 'sec-employment', kind: 'employment', title: 'Employment',       content: '' }
    ],
    selectedSectionId: 'sec-employment',
    personalForm: { name: '', email: '', phone: '', city: '' }
  }
})
export class ResumeEditorState {
  @Selector() static sections(s: ResumeEditorModel) { return s.sections; }
  @Selector() static personalForm(s: ResumeEditorModel) { return s.personalForm; }
  @Selector() static current(s: ResumeEditorModel) { return s.sections.find(x => x.id === s.selectedSectionId) || null; }

  @Action(LoadResume) load(ctx: StateContext<ResumeEditorModel>, { resumeId }: LoadResume) {
    ctx.patchState({ resumeId });
  }
  @Action(SelectSection) select(ctx: StateContext<ResumeEditorModel>, { sectionId }: SelectSection) {
    ctx.patchState({ selectedSectionId: sectionId });
  }
  @Action(UpdateSection) update(ctx: StateContext<ResumeEditorModel>, { sectionId, patch }: UpdateSection) {
    const s = ctx.getState();
    ctx.patchState({ sections: s.sections.map(sec => sec.id === sectionId ? { ...sec, ...patch } : sec) });
  }
  @Action(ApplySuggestion) apply(ctx: StateContext<ResumeEditorModel>, { sectionId, text }: ApplySuggestion) {
    const s = ctx.getState();
    const sec = s.sections.find(x => x.id === sectionId);
    if (!sec) return;
    const merged = (sec.content ? sec.content + '\n' : '') + text;
    ctx.patchState({ sections: s.sections.map(x => x.id === sectionId ? { ...x, content: merged } : x) });
  }
  @Action(UpdatePersonalForm) updatePersonal(ctx: StateContext<ResumeEditorModel>, { patch }: UpdatePersonalForm) {
    const s = ctx.getState();
    const pf = { ...s.personalForm, ...patch };
    const personalLines = [pf.name && `Name: ${pf.name}`, pf.email && `Email: ${pf.email}`, pf.phone && `Phone: ${pf.phone}`, pf.city && `City: ${pf.city}`].filter(Boolean).join('\n');
    ctx.patchState({
      personalForm: pf,
      sections: s.sections.map(sec => sec.kind === 'personal' ? { ...sec, content: personalLines } : sec)
    });
  }
  @Action(ImportLinkedIn) importLinkedIn(ctx: StateContext<ResumeEditorModel>, { profile }: ImportLinkedIn) {
    const s = ctx.getState();
    const pf = { name: profile.name || s.personalForm.name, email: profile.email || s.personalForm.email, phone: profile.phone || s.personalForm.phone, city: profile.city || s.personalForm.city };
    const eduLines = (profile.education || []).map(e => `**${e.degree || ''}**, ${e.school}${e.end ? ' — ' + e.end : ''}`.trim());
    const empLines: string[] = [];
    (profile.experiences || []).forEach(exp => {
      empLines.push(`${exp.start || ''} — ${exp.end || 'Present'} | **${exp.title}**, ${exp.company}${exp.city ? ' — ' + exp.city : ''}`.trim());
      (exp.bullets || []).forEach(b => empLines.push('• ' + b));
    });
    const next = s.sections.map(sec => {
      if (sec.kind === 'personal')   return { ...sec, content: [pf.name && 'Name: '+pf.name, pf.email && 'Email: '+pf.email, pf.phone && 'Phone: '+pf.phone, pf.city && 'City: '+pf.city].filter(Boolean).join('\n') };
      if (sec.kind === 'profile')    return { ...sec, content: profile.headline || sec.content };
      if (sec.kind === 'education')  return { ...sec, content: eduLines.join('\n') };
      if (sec.kind === 'employment') return { ...sec, content: empLines.join('\n') };
      return sec;
    });
    ctx.patchState({ personalForm: pf, sections: next });
  }
  @Action(ImportResumePayload) importResume(ctx: StateContext<ResumeEditorModel>, { payload }: ImportResumePayload) {
    const s = ctx.getState();
    const pf = { ...s.personalForm, ...(payload.personal || {}) };
    const next = s.sections.map(sec => {
      if (sec.kind === 'personal') {
        const lines = [pf.name && 'Name: ' + pf.name, pf.email && 'Email: ' + pf.email, pf.phone && 'Phone: ' + pf.phone, pf.city && 'City: ' + pf.city].filter(Boolean).join('\n');
        return { ...sec, content: lines };
      }
      if (sec.kind === 'profile' && payload.profile) return { ...sec, content: payload.profile };
      if (sec.kind === 'education' && payload.education) return { ...sec, content: payload.education.join('\n') };
      if (sec.kind === 'employment' && payload.employment) return { ...sec, content: payload.employment.join('\n') };
      return sec;
    });
    ctx.patchState({ personalForm: pf, sections: next });
  }
}
