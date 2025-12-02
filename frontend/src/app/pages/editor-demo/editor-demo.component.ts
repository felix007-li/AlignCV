import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { ResumeEditorState, LoadResume, UpdateSection, ApplySuggestion, UpdatePersonalForm } from '../../state/resume-editor.state';
import { UiState, SetTemplate, SetEditorStyleGlobal } from '../../state/ui.state';
import { SectionEditorComponent } from '../../components/section-editor/section-editor.component';
import { PreviewRendererComponent } from '../../components/preview/preview-renderer.component';
import { StyleToolbarComponent } from '../../components/style-toolbar/style-toolbar.component';
import { PersonalDetailsFormComponent } from '../../components/personal-details-form/personal-details-form.component';
import { PaywallModalComponent } from '../../components/paywall-modal/paywall-modal.component';

@Component({
  standalone: true,
  selector: 'aligncv-editor-demo',
  imports: [CommonModule, SectionEditorComponent, PreviewRendererComponent, StyleToolbarComponent, PersonalDetailsFormComponent, PaywallModalComponent],
  templateUrl: './editor-demo.component.html',
  styleUrls: ['./editor-demo.component.scss']
})
export class EditorDemoComponent implements OnInit {
  private store = inject(Store);
  sections$ = this.store.select(ResumeEditorState.sections);
  personal$ = this.store.select(ResumeEditorState.personalForm);
  style$ = this.store.select(UiState.editorStyle);
  showPaywall = false;

  ngOnInit(){ this.store.dispatch(new LoadResume('demo')); }

  // Upload & LinkedIn (stubs)
  fileInput?: HTMLInputElement;
  clickUpload(){ if(!this.fileInput){ this.fileInput = document.createElement('input'); this.fileInput.type='file'; this.fileInput.onchange = (e:any)=> this.onFilePicked(e); } this.fileInput.click(); }
  async onFilePicked(e: any){ const file = e.target.files?.[0]; if (file) { const mod = await import('../../services/resume-import.service'); const svc = new (mod as any).ResumeImportService(this.store); await svc.importFromFile(file); } e.target.value=''; }
  clickLinkedIn(){ if(!this.fileInput){ this.fileInput = document.createElement('input'); this.fileInput.type='file'; this.fileInput.onchange = (e:any)=> this.onLinkedInPicked(e); } this.fileInput.click(); }
  async onLinkedInPicked(e: any){ const file = e.target.files?.[0]; if (file) { const mod = await import('../../services/linkedin-import.service'); const svc = new (mod as any).LinkedinImportService(this.store); await svc.importFromPdf(file); } e.target.value=''; }

  updatePersonal(patch: any){ this.store.dispatch(new UpdatePersonalForm(patch)); }
  updateContent(sectionId: string, v: string) { this.store.dispatch(new UpdateSection(sectionId, { content: v })); }
  applySuggestion(sectionId: string, text: string) { this.store.dispatch(new ApplySuggestion(sectionId, text)); }

  onSelectTemplate(id: string){ this.store.dispatch(new SetTemplate(id as any)); }
  onStyleChange(patch: any){ this.store.dispatch(new SetEditorStyleGlobal(patch)); }

  exportPdf(){ this.showPaywall = true; }
  closePaywall(){ this.showPaywall = false; }

  toPreview(sections: any[]) {
    return (sections || []).map(s => ({
      id: s.id, title: s.title, kind: s.kind,
      items: (s.content || '').split('\n').map((x: string) => x.trim()).filter((x: string) => !!x)
    }));
  }
}
