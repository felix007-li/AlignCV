import { State, Selector, Action, StateContext } from '@ngxs/store';

export interface Section {
  title: string;
  content: string;
  suggestions: string[];
  // Education-specific fields
  education?: string;
  school?: string;
  city?: string;
  // Experience-specific fields
  position?: string;
  employer?: string;
  // Common date fields
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isPresent?: boolean;
  // Personal Details fields
  photo?: string;
  givenName?: string;
  familyName?: string;
  desiredJobPosition?: string;
  useAsHeadline?: boolean;
  emailAddress?: string;
  phoneNumber?: string;
  address?: string;
  postCode?: string;
  // Skills fields
  skillName?: string;
  skillLevel?: string;
  // Languages fields
  languageName?: string;
  languageLevel?: string;
  // Courses fields
  courseName?: string;
  // Certificates fields
  certificateTitle?: string;
  summary?: string;
}

export interface ResumeModel {
  sections: Section[];
  selectedIndex: number;
}

export class UpdateSection {
  static readonly type = '[Resume] UpdateSection';
  constructor(public index: number, public content: string) {}
}

export class ApplySuggestion {
  static readonly type = '[Resume] ApplySuggestion';
  constructor(public index: number, public text: string) {}
}

export class UpdateSectionFields {
  static readonly type = '[Resume] Update Section Fields';
  constructor(public index: number, public fields: Partial<Section>) {}
}

export class SelectSection {
  static readonly type = '[Resume] SelectSection';
  constructor(public index: number) {}
}

const defaults: ResumeModel = {
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

@State<ResumeModel>({ name: 'resume', defaults })
export class ResumeState {
  @Selector()
  static sections(state: ResumeModel) {
    return state.sections;
  }

  @Action(UpdateSection)
  update(
    { getState, patchState }: StateContext<ResumeModel>,
    { index, content }: UpdateSection
  ) {
    const state = getState();
    const sections = state.sections.slice();
    if (sections[index]) {
      sections[index] = { ...sections[index], content };
    }
    patchState({ sections });
  }

  @Action(UpdateSectionFields)
  updateFields(
    { getState, patchState }: StateContext<ResumeModel>,
    { index, fields }: UpdateSectionFields
  ) {
    const state = getState();
    const sections = state.sections.slice();
    if (sections[index]) {
      sections[index] = { ...sections[index], ...fields };
    }
    patchState({ sections });
  }

  @Action(ApplySuggestion)
  apply(
    { getState, patchState }: StateContext<ResumeModel>,
    { index, text }: ApplySuggestion
  ) {
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

  @Action(SelectSection)
  select(ctx: StateContext<ResumeModel>, { index }: SelectSection) {
    ctx.patchState({ selectedIndex: index });
  }
}
