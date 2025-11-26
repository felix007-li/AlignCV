import { State, Selector, Action, StateContext } from '@ngxs/store';

// Base entry interface
export interface BaseEntry {
  id: string;
  expanded: boolean;
}

// Personal Details (single entry, no array)
export interface PersonalDetails {
  photo?: string;
  givenName?: string;
  familyName?: string;
  desiredJobPosition?: string;
  useAsHeadline?: boolean;
  emailAddress?: string;
  phoneNumber?: string;
  address?: string;
  postCode?: string;
  city?: string;
}

// Profile/Summary (single entry, no array)
export interface ProfileSummary {
  content: string;
  suggestions?: string[];
}

// Experience Entry
export interface ExperienceEntry extends BaseEntry {
  position: string;
  employer: string;
  city?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isPresent?: boolean;
  description: string;
  suggestions?: string[];
}

// Education Entry
export interface EducationEntry extends BaseEntry {
  degree: string;
  school: string;
  city?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isPresent?: boolean;
  description: string;
}

// Skill Entry
export interface SkillEntry extends BaseEntry {
  skillName: string;
  skillLevel?: string;
}

// Language Entry
export interface LanguageEntry extends BaseEntry {
  languageName: string;
  languageLevel?: string;
}

// Course Entry
export interface CourseEntry extends BaseEntry {
  courseName: string;
  institution?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isPresent?: boolean;
}

// Certificate Entry
export interface CertificateEntry extends BaseEntry {
  certificateTitle: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
}

// Main Resume Model
export interface ResumeModelNew {
  personalDetails: PersonalDetails;
  profile: ProfileSummary;
  experiences: ExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  languages: LanguageEntry[];
  courses: CourseEntry[];
  certificates: CertificateEntry[];

  // UI State
  sectionsCollapsed: {
    experiences: boolean;
    educations: boolean;
    skills: boolean;
    languages: boolean;
    courses: boolean;
    certificates: boolean;
  };
}

// Actions
export class UpdatePersonalDetails {
  static readonly type = '[Resume] Update Personal Details';
  constructor(public personalDetails: Partial<PersonalDetails>) {}
}

export class UpdateProfile {
  static readonly type = '[Resume] Update Profile';
  constructor(public profile: Partial<ProfileSummary>) {}
}

export class AddExperience {
  static readonly type = '[Resume] Add Experience';
  constructor(public experience?: Partial<ExperienceEntry>) {}
}

export class UpdateExperience {
  static readonly type = '[Resume] Update Experience';
  constructor(public id: string, public experience: Partial<ExperienceEntry>) {}
}

export class DeleteExperience {
  static readonly type = '[Resume] Delete Experience';
  constructor(public id: string) {}
}

export class ToggleExperienceExpanded {
  static readonly type = '[Resume] Toggle Experience Expanded';
  constructor(public id: string) {}
}

export class AddEducation {
  static readonly type = '[Resume] Add Education';
  constructor(public education?: Partial<EducationEntry>) {}
}

export class UpdateEducation {
  static readonly type = '[Resume] Update Education';
  constructor(public id: string, public education: Partial<EducationEntry>) {}
}

export class DeleteEducation {
  static readonly type = '[Resume] Delete Education';
  constructor(public id: string) {}
}

export class ToggleEducationExpanded {
  static readonly type = '[Resume] Toggle Education Expanded';
  constructor(public id: string) {}
}

export class AddSkill {
  static readonly type = '[Resume] Add Skill';
  constructor(public skill?: Partial<SkillEntry>) {}
}

export class UpdateSkill {
  static readonly type = '[Resume] Update Skill';
  constructor(public id: string, public skill: Partial<SkillEntry>) {}
}

export class DeleteSkill {
  static readonly type = '[Resume] Delete Skill';
  constructor(public id: string) {}
}

export class AddLanguage {
  static readonly type = '[Resume] Add Language';
  constructor(public language?: Partial<LanguageEntry>) {}
}

export class UpdateLanguage {
  static readonly type = '[Resume] Update Language';
  constructor(public id: string, public language: Partial<LanguageEntry>) {}
}

export class DeleteLanguage {
  static readonly type = '[Resume] Delete Language';
  constructor(public id: string) {}
}

export class AddCourse {
  static readonly type = '[Resume] Add Course';
  constructor(public course?: Partial<CourseEntry>) {}
}

export class UpdateCourse {
  static readonly type = '[Resume] Update Course';
  constructor(public id: string, public course: Partial<CourseEntry>) {}
}

export class DeleteCourse {
  static readonly type = '[Resume] Delete Course';
  constructor(public id: string) {}
}

export class AddCertificate {
  static readonly type = '[Resume] Add Certificate';
  constructor(public certificate?: Partial<CertificateEntry>) {}
}

export class UpdateCertificate {
  static readonly type = '[Resume] Update Certificate';
  constructor(public id: string, public certificate: Partial<CertificateEntry>) {}
}

export class DeleteCertificate {
  static readonly type = '[Resume] Delete Certificate';
  constructor(public id: string) {}
}

export class ToggleSectionCollapsed {
  static readonly type = '[Resume] Toggle Section Collapsed';
  constructor(public section: keyof ResumeModelNew['sectionsCollapsed']) {}
}

// Default state
const defaults: ResumeModelNew = {
  personalDetails: {},
  profile: {
    content: '',
    suggestions: []
  },
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  courses: [],
  certificates: [],
  sectionsCollapsed: {
    experiences: false,
    educations: false,
    skills: false,
    languages: false,
    courses: false,
    certificates: false
  }
};

// Helper to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

@State<ResumeModelNew>({ name: 'resumeNew', defaults })
export class ResumeNewState {
  @Selector()
  static personalDetails(state: ResumeModelNew) {
    return state.personalDetails;
  }

  @Selector()
  static profile(state: ResumeModelNew) {
    return state.profile;
  }

  @Selector()
  static experiences(state: ResumeModelNew) {
    return state.experiences;
  }

  @Selector()
  static educations(state: ResumeModelNew) {
    return state.educations;
  }

  @Selector()
  static skills(state: ResumeModelNew) {
    return state.skills;
  }

  @Selector()
  static languages(state: ResumeModelNew) {
    return state.languages;
  }

  @Selector()
  static courses(state: ResumeModelNew) {
    return state.courses;
  }

  @Selector()
  static certificates(state: ResumeModelNew) {
    return state.certificates;
  }

  @Selector()
  static sectionsCollapsed(state: ResumeModelNew) {
    return state.sectionsCollapsed;
  }

  @Action(UpdatePersonalDetails)
  updatePersonalDetails(ctx: StateContext<ResumeModelNew>, { personalDetails }: UpdatePersonalDetails) {
    const state = ctx.getState();
    ctx.patchState({
      personalDetails: { ...state.personalDetails, ...personalDetails }
    });
  }

  @Action(UpdateProfile)
  updateProfile(ctx: StateContext<ResumeModelNew>, { profile }: UpdateProfile) {
    const state = ctx.getState();
    ctx.patchState({
      profile: { ...state.profile, ...profile }
    });
  }

  @Action(AddExperience)
  addExperience(ctx: StateContext<ResumeModelNew>, { experience }: AddExperience) {
    const state = ctx.getState();
    const newExperience: ExperienceEntry = {
      id: generateId(),
      expanded: true,
      position: '',
      employer: '',
      description: '',
      ...experience
    };
    ctx.patchState({
      experiences: [...state.experiences, newExperience]
    });
  }

  @Action(UpdateExperience)
  updateExperience(ctx: StateContext<ResumeModelNew>, { id, experience }: UpdateExperience) {
    const state = ctx.getState();
    ctx.patchState({
      experiences: state.experiences.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    });
  }

  @Action(DeleteExperience)
  deleteExperience(ctx: StateContext<ResumeModelNew>, { id }: DeleteExperience) {
    const state = ctx.getState();
    ctx.patchState({
      experiences: state.experiences.filter(exp => exp.id !== id)
    });
  }

  @Action(ToggleExperienceExpanded)
  toggleExperienceExpanded(ctx: StateContext<ResumeModelNew>, { id }: ToggleExperienceExpanded) {
    const state = ctx.getState();
    ctx.patchState({
      experiences: state.experiences.map(exp =>
        exp.id === id ? { ...exp, expanded: !exp.expanded } : exp
      )
    });
  }

  @Action(AddEducation)
  addEducation(ctx: StateContext<ResumeModelNew>, { education }: AddEducation) {
    const state = ctx.getState();
    const newEducation: EducationEntry = {
      id: generateId(),
      expanded: true,
      degree: '',
      school: '',
      description: '',
      ...education
    };
    ctx.patchState({
      educations: [...state.educations, newEducation]
    });
  }

  @Action(UpdateEducation)
  updateEducation(ctx: StateContext<ResumeModelNew>, { id, education }: UpdateEducation) {
    const state = ctx.getState();
    ctx.patchState({
      educations: state.educations.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    });
  }

  @Action(DeleteEducation)
  deleteEducation(ctx: StateContext<ResumeModelNew>, { id }: DeleteEducation) {
    const state = ctx.getState();
    ctx.patchState({
      educations: state.educations.filter(edu => edu.id !== id)
    });
  }

  @Action(ToggleEducationExpanded)
  toggleEducationExpanded(ctx: StateContext<ResumeModelNew>, { id }: ToggleEducationExpanded) {
    const state = ctx.getState();
    ctx.patchState({
      educations: state.educations.map(edu =>
        edu.id === id ? { ...edu, expanded: !edu.expanded } : edu
      )
    });
  }

  @Action(AddSkill)
  addSkill(ctx: StateContext<ResumeModelNew>, { skill }: AddSkill) {
    const state = ctx.getState();
    const newSkill: SkillEntry = {
      id: generateId(),
      expanded: false,
      skillName: '',
      ...skill
    };
    ctx.patchState({
      skills: [...state.skills, newSkill]
    });
  }

  @Action(UpdateSkill)
  updateSkill(ctx: StateContext<ResumeModelNew>, { id, skill }: UpdateSkill) {
    const state = ctx.getState();
    ctx.patchState({
      skills: state.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      )
    });
  }

  @Action(DeleteSkill)
  deleteSkill(ctx: StateContext<ResumeModelNew>, { id }: DeleteSkill) {
    const state = ctx.getState();
    ctx.patchState({
      skills: state.skills.filter(s => s.id !== id)
    });
  }

  @Action(AddLanguage)
  addLanguage(ctx: StateContext<ResumeModelNew>, { language }: AddLanguage) {
    const state = ctx.getState();
    const newLanguage: LanguageEntry = {
      id: generateId(),
      expanded: false,
      languageName: '',
      ...language
    };
    ctx.patchState({
      languages: [...state.languages, newLanguage]
    });
  }

  @Action(UpdateLanguage)
  updateLanguage(ctx: StateContext<ResumeModelNew>, { id, language }: UpdateLanguage) {
    const state = ctx.getState();
    ctx.patchState({
      languages: state.languages.map(l =>
        l.id === id ? { ...l, ...language } : l
      )
    });
  }

  @Action(DeleteLanguage)
  deleteLanguage(ctx: StateContext<ResumeModelNew>, { id }: DeleteLanguage) {
    const state = ctx.getState();
    ctx.patchState({
      languages: state.languages.filter(l => l.id !== id)
    });
  }

  @Action(AddCourse)
  addCourse(ctx: StateContext<ResumeModelNew>, { course }: AddCourse) {
    const state = ctx.getState();
    const newCourse: CourseEntry = {
      id: generateId(),
      expanded: true,
      courseName: '',
      ...course
    };
    ctx.patchState({
      courses: [...state.courses, newCourse]
    });
  }

  @Action(UpdateCourse)
  updateCourse(ctx: StateContext<ResumeModelNew>, { id, course }: UpdateCourse) {
    const state = ctx.getState();
    ctx.patchState({
      courses: state.courses.map(c =>
        c.id === id ? { ...c, ...course } : c
      )
    });
  }

  @Action(DeleteCourse)
  deleteCourse(ctx: StateContext<ResumeModelNew>, { id }: DeleteCourse) {
    const state = ctx.getState();
    ctx.patchState({
      courses: state.courses.filter(c => c.id !== id)
    });
  }

  @Action(AddCertificate)
  addCertificate(ctx: StateContext<ResumeModelNew>, { certificate }: AddCertificate) {
    const state = ctx.getState();
    const newCertificate: CertificateEntry = {
      id: generateId(),
      expanded: true,
      certificateTitle: '',
      ...certificate
    };
    ctx.patchState({
      certificates: [...state.certificates, newCertificate]
    });
  }

  @Action(UpdateCertificate)
  updateCertificate(ctx: StateContext<ResumeModelNew>, { id, certificate }: UpdateCertificate) {
    const state = ctx.getState();
    ctx.patchState({
      certificates: state.certificates.map(c =>
        c.id === id ? { ...c, ...certificate } : c
      )
    });
  }

  @Action(DeleteCertificate)
  deleteCertificate(ctx: StateContext<ResumeModelNew>, { id }: DeleteCertificate) {
    const state = ctx.getState();
    ctx.patchState({
      certificates: state.certificates.filter(c => c.id !== id)
    });
  }

  @Action(ToggleSectionCollapsed)
  toggleSectionCollapsed(ctx: StateContext<ResumeModelNew>, { section }: ToggleSectionCollapsed) {
    const state = ctx.getState();
    ctx.patchState({
      sectionsCollapsed: {
        ...state.sectionsCollapsed,
        [section]: !state.sectionsCollapsed[section]
      }
    });
  }
}
