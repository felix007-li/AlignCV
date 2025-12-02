export class OpenPaywall {
    static { this.type = '[UI] Open Paywall'; }
}
export class ClosePaywall {
    static { this.type = '[UI] Close Paywall'; }
}
export class SetABVariant {
    static { this.type = '[UI] Set AB Variant'; }
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
export class DisableOnboarding {
    static { this.type = '[UI] Disable Onboarding'; }
}
export class SetNoNags {
    static { this.type = '[UI] No Nags'; }
    constructor(on) {
        this.on = on;
    }
}
//# sourceMappingURL=ui.actions.js.map