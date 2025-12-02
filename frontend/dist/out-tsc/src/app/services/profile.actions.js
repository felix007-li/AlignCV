export class ReplaceProfile {
    static { this.type = '[Profile] Replace'; }
    constructor(value) {
        this.value = value;
    }
}
export class PatchProfile {
    static { this.type = '[Profile] Patch'; }
    constructor(changes) {
        this.changes = changes;
    }
}
//# sourceMappingURL=profile.actions.js.map