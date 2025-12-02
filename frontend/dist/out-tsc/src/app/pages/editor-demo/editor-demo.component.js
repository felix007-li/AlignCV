var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { ResumeEditorState, LoadResume, UpdateSection, ApplySuggestion, UpdatePersonalForm } from '../../state/resume-editor.state';
import { UiState, SetTemplate, SetEditorStyleGlobal } from '../../state/ui.state';
import { SectionEditorComponent } from '../../components/section-editor/section-editor.component';
import { PreviewRendererComponent } from '../../components/preview/preview-renderer.component';
import { StyleToolbarComponent } from '../../components/style-toolbar/style-toolbar.component';
import { PersonalDetailsFormComponent } from '../../components/personal-details-form/personal-details-form.component';
import { PaywallModalComponent } from '../../components/paywall-modal/paywall-modal.component';
let EditorDemoComponent = class EditorDemoComponent {
    constructor() {
        this.store = inject(Store);
        this.sections$ = this.store.select(ResumeEditorState.sections);
        this.personal$ = this.store.select(ResumeEditorState.personalForm);
        this.style$ = this.store.select(UiState.editorStyle);
        this.showPaywall = false;
    }
    ngOnInit() { this.store.dispatch(new LoadResume('demo')); }
    clickUpload() { if (!this.fileInput) {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.onchange = (e) => this.onFilePicked(e);
    } this.fileInput.click(); }
    async onFilePicked(e) { const file = e.target.files?.[0]; if (file) {
        const mod = await import('../../services/resume-import.service');
        const svc = new mod.ResumeImportService(this.store);
        await svc.importFromFile(file);
    } e.target.value = ''; }
    clickLinkedIn() { if (!this.fileInput) {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.onchange = (e) => this.onLinkedInPicked(e);
    } this.fileInput.click(); }
    async onLinkedInPicked(e) { const file = e.target.files?.[0]; if (file) {
        const mod = await import('../../services/linkedin-import.service');
        const svc = new mod.LinkedinImportService(this.store);
        await svc.importFromPdf(file);
    } e.target.value = ''; }
    updatePersonal(patch) { this.store.dispatch(new UpdatePersonalForm(patch)); }
    updateContent(sectionId, v) { this.store.dispatch(new UpdateSection(sectionId, { content: v })); }
    applySuggestion(sectionId, text) { this.store.dispatch(new ApplySuggestion(sectionId, text)); }
    onSelectTemplate(id) { this.store.dispatch(new SetTemplate(id)); }
    onStyleChange(patch) { this.store.dispatch(new SetEditorStyleGlobal(patch)); }
    exportPdf() { this.showPaywall = true; }
    closePaywall() { this.showPaywall = false; }
    toPreview(sections) {
        return (sections || []).map(s => ({
            id: s.id, title: s.title, kind: s.kind,
            items: (s.content || '').split('\n').map((x) => x.trim()).filter((x) => !!x)
        }));
    }
};
EditorDemoComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-editor-demo',
        imports: [CommonModule, SectionEditorComponent, PreviewRendererComponent, StyleToolbarComponent, PersonalDetailsFormComponent, PaywallModalComponent],
        templateUrl: './editor-demo.component.html',
        styleUrls: ['./editor-demo.component.scss']
    })
], EditorDemoComponent);
export { EditorDemoComponent };
//# sourceMappingURL=editor-demo.component.js.map