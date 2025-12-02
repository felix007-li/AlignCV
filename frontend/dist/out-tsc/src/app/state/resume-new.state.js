var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { State, Selector, Action } from '@ngxs/store';
// Actions
export class UpdatePersonalDetails {
    static { this.type = '[Resume] Update Personal Details'; }
    constructor(personalDetails) {
        this.personalDetails = personalDetails;
    }
}
export class UpdateProfile {
    static { this.type = '[Resume] Update Profile'; }
    constructor(profile) {
        this.profile = profile;
    }
}
export class AddExperience {
    static { this.type = '[Resume] Add Experience'; }
    constructor(experience) {
        this.experience = experience;
    }
}
export class UpdateExperience {
    static { this.type = '[Resume] Update Experience'; }
    constructor(id, experience) {
        this.id = id;
        this.experience = experience;
    }
}
export class DeleteExperience {
    static { this.type = '[Resume] Delete Experience'; }
    constructor(id) {
        this.id = id;
    }
}
export class ToggleExperienceExpanded {
    static { this.type = '[Resume] Toggle Experience Expanded'; }
    constructor(id) {
        this.id = id;
    }
}
export class AddEducation {
    static { this.type = '[Resume] Add Education'; }
    constructor(education) {
        this.education = education;
    }
}
export class UpdateEducation {
    static { this.type = '[Resume] Update Education'; }
    constructor(id, education) {
        this.id = id;
        this.education = education;
    }
}
export class DeleteEducation {
    static { this.type = '[Resume] Delete Education'; }
    constructor(id) {
        this.id = id;
    }
}
export class ToggleEducationExpanded {
    static { this.type = '[Resume] Toggle Education Expanded'; }
    constructor(id) {
        this.id = id;
    }
}
export class AddSkill {
    static { this.type = '[Resume] Add Skill'; }
    constructor(skill) {
        this.skill = skill;
    }
}
export class UpdateSkill {
    static { this.type = '[Resume] Update Skill'; }
    constructor(id, skill) {
        this.id = id;
        this.skill = skill;
    }
}
export class DeleteSkill {
    static { this.type = '[Resume] Delete Skill'; }
    constructor(id) {
        this.id = id;
    }
}
export class AddLanguage {
    static { this.type = '[Resume] Add Language'; }
    constructor(language) {
        this.language = language;
    }
}
export class UpdateLanguage {
    static { this.type = '[Resume] Update Language'; }
    constructor(id, language) {
        this.id = id;
        this.language = language;
    }
}
export class DeleteLanguage {
    static { this.type = '[Resume] Delete Language'; }
    constructor(id) {
        this.id = id;
    }
}
export class AddCourse {
    static { this.type = '[Resume] Add Course'; }
    constructor(course) {
        this.course = course;
    }
}
export class UpdateCourse {
    static { this.type = '[Resume] Update Course'; }
    constructor(id, course) {
        this.id = id;
        this.course = course;
    }
}
export class DeleteCourse {
    static { this.type = '[Resume] Delete Course'; }
    constructor(id) {
        this.id = id;
    }
}
export class AddCertificate {
    static { this.type = '[Resume] Add Certificate'; }
    constructor(certificate) {
        this.certificate = certificate;
    }
}
export class UpdateCertificate {
    static { this.type = '[Resume] Update Certificate'; }
    constructor(id, certificate) {
        this.id = id;
        this.certificate = certificate;
    }
}
export class DeleteCertificate {
    static { this.type = '[Resume] Delete Certificate'; }
    constructor(id) {
        this.id = id;
    }
}
export class ToggleSectionCollapsed {
    static { this.type = '[Resume] Toggle Section Collapsed'; }
    constructor(section) {
        this.section = section;
    }
}
// Default state
const defaults = {
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
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
let ResumeNewState = class ResumeNewState {
    static personalDetails(state) {
        return state.personalDetails;
    }
    static profile(state) {
        return state.profile;
    }
    static experiences(state) {
        return state.experiences;
    }
    static educations(state) {
        return state.educations;
    }
    static skills(state) {
        return state.skills;
    }
    static languages(state) {
        return state.languages;
    }
    static courses(state) {
        return state.courses;
    }
    static certificates(state) {
        return state.certificates;
    }
    static sectionsCollapsed(state) {
        return state.sectionsCollapsed;
    }
    updatePersonalDetails(ctx, { personalDetails }) {
        const state = ctx.getState();
        ctx.patchState({
            personalDetails: { ...state.personalDetails, ...personalDetails }
        });
    }
    updateProfile(ctx, { profile }) {
        const state = ctx.getState();
        ctx.patchState({
            profile: { ...state.profile, ...profile }
        });
    }
    addExperience(ctx, { experience }) {
        const state = ctx.getState();
        const newExperience = {
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
    updateExperience(ctx, { id, experience }) {
        const state = ctx.getState();
        ctx.patchState({
            experiences: state.experiences.map(exp => exp.id === id ? { ...exp, ...experience } : exp)
        });
    }
    deleteExperience(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            experiences: state.experiences.filter(exp => exp.id !== id)
        });
    }
    toggleExperienceExpanded(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            experiences: state.experiences.map(exp => exp.id === id ? { ...exp, expanded: !exp.expanded } : exp)
        });
    }
    addEducation(ctx, { education }) {
        const state = ctx.getState();
        const newEducation = {
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
    updateEducation(ctx, { id, education }) {
        const state = ctx.getState();
        ctx.patchState({
            educations: state.educations.map(edu => edu.id === id ? { ...edu, ...education } : edu)
        });
    }
    deleteEducation(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            educations: state.educations.filter(edu => edu.id !== id)
        });
    }
    toggleEducationExpanded(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            educations: state.educations.map(edu => edu.id === id ? { ...edu, expanded: !edu.expanded } : edu)
        });
    }
    addSkill(ctx, { skill }) {
        const state = ctx.getState();
        const newSkill = {
            id: generateId(),
            expanded: false,
            skillName: '',
            ...skill
        };
        ctx.patchState({
            skills: [...state.skills, newSkill]
        });
    }
    updateSkill(ctx, { id, skill }) {
        const state = ctx.getState();
        ctx.patchState({
            skills: state.skills.map(s => s.id === id ? { ...s, ...skill } : s)
        });
    }
    deleteSkill(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            skills: state.skills.filter(s => s.id !== id)
        });
    }
    addLanguage(ctx, { language }) {
        const state = ctx.getState();
        const newLanguage = {
            id: generateId(),
            expanded: false,
            languageName: '',
            ...language
        };
        ctx.patchState({
            languages: [...state.languages, newLanguage]
        });
    }
    updateLanguage(ctx, { id, language }) {
        const state = ctx.getState();
        ctx.patchState({
            languages: state.languages.map(l => l.id === id ? { ...l, ...language } : l)
        });
    }
    deleteLanguage(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            languages: state.languages.filter(l => l.id !== id)
        });
    }
    addCourse(ctx, { course }) {
        const state = ctx.getState();
        const newCourse = {
            id: generateId(),
            expanded: true,
            courseName: '',
            ...course
        };
        ctx.patchState({
            courses: [...state.courses, newCourse]
        });
    }
    updateCourse(ctx, { id, course }) {
        const state = ctx.getState();
        ctx.patchState({
            courses: state.courses.map(c => c.id === id ? { ...c, ...course } : c)
        });
    }
    deleteCourse(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            courses: state.courses.filter(c => c.id !== id)
        });
    }
    addCertificate(ctx, { certificate }) {
        const state = ctx.getState();
        const newCertificate = {
            id: generateId(),
            expanded: true,
            certificateTitle: '',
            ...certificate
        };
        ctx.patchState({
            certificates: [...state.certificates, newCertificate]
        });
    }
    updateCertificate(ctx, { id, certificate }) {
        const state = ctx.getState();
        ctx.patchState({
            certificates: state.certificates.map(c => c.id === id ? { ...c, ...certificate } : c)
        });
    }
    deleteCertificate(ctx, { id }) {
        const state = ctx.getState();
        ctx.patchState({
            certificates: state.certificates.filter(c => c.id !== id)
        });
    }
    toggleSectionCollapsed(ctx, { section }) {
        const state = ctx.getState();
        ctx.patchState({
            sectionsCollapsed: {
                ...state.sectionsCollapsed,
                [section]: !state.sectionsCollapsed[section]
            }
        });
    }
};
__decorate([
    Action(UpdatePersonalDetails)
], ResumeNewState.prototype, "updatePersonalDetails", null);
__decorate([
    Action(UpdateProfile)
], ResumeNewState.prototype, "updateProfile", null);
__decorate([
    Action(AddExperience)
], ResumeNewState.prototype, "addExperience", null);
__decorate([
    Action(UpdateExperience)
], ResumeNewState.prototype, "updateExperience", null);
__decorate([
    Action(DeleteExperience)
], ResumeNewState.prototype, "deleteExperience", null);
__decorate([
    Action(ToggleExperienceExpanded)
], ResumeNewState.prototype, "toggleExperienceExpanded", null);
__decorate([
    Action(AddEducation)
], ResumeNewState.prototype, "addEducation", null);
__decorate([
    Action(UpdateEducation)
], ResumeNewState.prototype, "updateEducation", null);
__decorate([
    Action(DeleteEducation)
], ResumeNewState.prototype, "deleteEducation", null);
__decorate([
    Action(ToggleEducationExpanded)
], ResumeNewState.prototype, "toggleEducationExpanded", null);
__decorate([
    Action(AddSkill)
], ResumeNewState.prototype, "addSkill", null);
__decorate([
    Action(UpdateSkill)
], ResumeNewState.prototype, "updateSkill", null);
__decorate([
    Action(DeleteSkill)
], ResumeNewState.prototype, "deleteSkill", null);
__decorate([
    Action(AddLanguage)
], ResumeNewState.prototype, "addLanguage", null);
__decorate([
    Action(UpdateLanguage)
], ResumeNewState.prototype, "updateLanguage", null);
__decorate([
    Action(DeleteLanguage)
], ResumeNewState.prototype, "deleteLanguage", null);
__decorate([
    Action(AddCourse)
], ResumeNewState.prototype, "addCourse", null);
__decorate([
    Action(UpdateCourse)
], ResumeNewState.prototype, "updateCourse", null);
__decorate([
    Action(DeleteCourse)
], ResumeNewState.prototype, "deleteCourse", null);
__decorate([
    Action(AddCertificate)
], ResumeNewState.prototype, "addCertificate", null);
__decorate([
    Action(UpdateCertificate)
], ResumeNewState.prototype, "updateCertificate", null);
__decorate([
    Action(DeleteCertificate)
], ResumeNewState.prototype, "deleteCertificate", null);
__decorate([
    Action(ToggleSectionCollapsed)
], ResumeNewState.prototype, "toggleSectionCollapsed", null);
__decorate([
    Selector()
], ResumeNewState, "personalDetails", null);
__decorate([
    Selector()
], ResumeNewState, "profile", null);
__decorate([
    Selector()
], ResumeNewState, "experiences", null);
__decorate([
    Selector()
], ResumeNewState, "educations", null);
__decorate([
    Selector()
], ResumeNewState, "skills", null);
__decorate([
    Selector()
], ResumeNewState, "languages", null);
__decorate([
    Selector()
], ResumeNewState, "courses", null);
__decorate([
    Selector()
], ResumeNewState, "certificates", null);
__decorate([
    Selector()
], ResumeNewState, "sectionsCollapsed", null);
ResumeNewState = __decorate([
    State({ name: 'resumeNew', defaults })
], ResumeNewState);
export { ResumeNewState };
//# sourceMappingURL=resume-new.state.js.map