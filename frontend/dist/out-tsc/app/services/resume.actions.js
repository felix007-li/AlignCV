export class LoadResume {
    static { this.type = '[Resume] Load'; }
    constructor(id) {
        this.id = id;
    }
}
export class ReplaceResume {
    static { this.type = '[Resume] Replace'; }
    constructor(value) {
        this.value = value;
    }
}
export class UpdateExperienceText {
    static { this.type = '[Resume] Update Experience Text'; }
    constructor(text) {
        this.text = text;
    }
}
//# sourceMappingURL=resume.actions.js.map