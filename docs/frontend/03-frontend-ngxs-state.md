
# 03 — NGXS State Slices (Skeleton)

```ts
// auth.state.ts
@State<AuthModel>({ name: 'auth', defaults: INIT })
export class AuthState {
  @Selector() static user(s: AuthModel) { return s.user; }
  @Action(Login) login(ctx, {email,pw}){ /* ... */ }
}

// resume.state.ts
export interface Section { id:string; type:string; text:string; bullets:string[]; }
export interface ResumeDoc { id:string; locale:string; sections:Section[]; templateId:string; updatedAt:number; }
@State<ResumeDoc>({ name:'resume', defaults: INIT_RESUME })
export class ResumeEditorState {
  @Action(UpdateSectionText) update(...){ /* merge */ }
  @Action(ApplySuggestion) apply(...){ /* insert suggestion content */ }
}

// jd.state.ts
export interface JdModel { lang:'en'|'es'|'pt'|'fr'; keywords:string[]; matchScore:number; }
@State<JdModel>({ name:'jd', defaults: INIT_JD })
export class JdState {
  @Action(DetectLang) detect(...){ /* call /api/jd/detect */ }
  @Action(ExtractKeywords) extract(...){ /* call /api/jd/keywords */ }
}

// checkout.state.ts
export interface Plan { kind:'pass14'|'monthly'; price:number; currency:'USD'|'CAD'|'MXN'|'BRL'|'CLP'|'ARS'; }
@State<CheckoutModel>({ name:'checkout', defaults: INIT_CHECKOUT })
export class CheckoutState {
  @Action(StartCheckout) start(...){ /* open Stripe Checkout */ }
  @Action(HandleWebhookSignal) sync(...){ /* set active plan */ }
}

// ui.state.ts
export interface UiModel { templateId:string; fontFamily:string; fontSize:number; lineHeight:number; palette: string; }
@State<UiModel>({ name:'ui', defaults: INIT_UI })
export class UiState {
  @Action(SetTemplate) setT(...){ /* tokensToCssVars */ }
  @Action(SetTypography) setTy(...){ /* update */ }
}
```
> 完整代码生成请用 `prompts/50-prompts-frontend.md` 的指令。
