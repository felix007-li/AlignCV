export class ReplaceProfile {
    static { this.type = '[Profile] Replace'; }
    constructor(payload) {
        this.payload = payload;
    }
}
export class PatchProfile {
    static { this.type = '[Profile] Patch'; }
    constructor(payload) {
        this.payload = payload;
    }
}
//# sourceMappingURL=profile.actions.js.map