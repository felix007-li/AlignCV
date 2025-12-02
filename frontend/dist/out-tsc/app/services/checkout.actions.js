export class PurchaseOneTime {
    static { this.type = '[Checkout] OneTime'; }
    constructor(priceId, lang) {
        this.priceId = priceId;
        this.lang = lang;
    }
}
export class Subscribe {
    static { this.type = '[Checkout] Subscribe'; }
    constructor(planId, lang) {
        this.planId = planId;
        this.lang = lang;
    }
}
export class SetCurrency {
    static { this.type = '[Checkout] Currency'; }
    constructor(currency) {
        this.currency = currency;
    }
}
//# sourceMappingURL=checkout.actions.js.map