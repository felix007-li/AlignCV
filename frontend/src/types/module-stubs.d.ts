// Ambient module stubs to satisfy typechecking for legacy/optional deps

declare module '@nguniversal/express-engine' {
  export const ngExpressEngine: any;
}

declare module '@angular/ssr' {
  export const renderApplication: any;
}

declare module '@angular/platform-server' {
  export const provideServerRendering: any;
}

declare module '@ngxs/storage-plugin' {
  export class NgxsStoragePluginModule {
    static forRoot(...args: any[]): any;
  }
}

declare module '@ngneat/transloco' {
  export const translocoConfig: any;
  export const TRANSLOCO_CONFIG: any;
  export const TRANSLOCO_LOADER: any;
  export type TranslocoConfig = any;
  export function provideTransloco(...args: any[]): any;
}

declare module '../core/services/import.api' {
  export class ImportApi {
    fromPdf(file: any): Promise<any>;
    fromDocx(file: any): Promise<any>;
    fromLinkedInJson(file: any): Promise<any>;
  }
}

declare module '../core/state/resume.actions' {
  export class ReplaceResume { constructor(public payload: any); }
  export class UpdateExperienceText { constructor(public payload: any); }
}

declare module '../core/state/profile.actions' {
  export class ReplaceProfile { constructor(public payload: any); }
  export class PatchProfile { constructor(public payload: any); }
}

declare module '../core/state/resume.state' {
  export class ResumeState { static entity: any; }
}

declare module '../core/state/profile.state' {
  export class ProfileState { static entity: any; }
}

declare module '../core/state/jd.state' {
  export class JDState { static result: any; }
}

declare module '../core/state/jd.actions' {
  export class AnalyzeJD { constructor(public payload: any); }
}

declare module '../core/services/ai-suggest.service' {
  export interface SuggestFilters { [key: string]: any; }
  export class AiSuggestService { suggest(options: any): Promise<any[]>; }
}

declare module '../core/services/jd.api' {
  export class JdApi { analyze(text: any): Promise<any>; }
}

declare module '../core/state/ui.actions' {
  export class ClosePaywall { constructor(); static readonly type: string; }
}

declare module '../core/services/price.client' {
  export class PriceClient { get(locale: any): Promise<any>; }
}

declare module '../core/services/checkout.api' {
  export class CheckoutApi { createSession(payload: any): Promise<{ url?: string }>; }
}

declare module '../services/auth.service' {
  export class AuthService { isLoggedIn(): boolean; }
}

declare module '../../components/section-editor/section-editor.component' {
  export class SectionEditorComponent {}
}

declare module '../../components/preview/preview-renderer.component' {
  export class PreviewRendererComponent {}
}

declare module '../../components/style-toolbar/style-toolbar.component' {
  export class StyleToolbarComponent {}
}
