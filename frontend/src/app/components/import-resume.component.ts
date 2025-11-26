import { Component } from '@angular/core';
import { ImportApi } from '../core/services/import.api';
import { Store } from '@ngxs/store';
import { ReplaceResume } from '../core/state/resume.actions';
import { ReplaceProfile } from '../core/state/profile.actions';
@Component({ selector:'import-resume', standalone:true, template:`
<div class="border rounded-xl p-4 space-y-2">
  <div class="font-semibold">Import your resume / LinkedIn</div>
  <div class="text-sm text-gray-600">PDF / DOCX / LinkedIn JSON. We’ll auto‑fill your profile (left).</div>
  <div class="flex items-center gap-2 flex-wrap">
    <label class="cursor-pointer px-3 py-2 border rounded">
      <input type="file" class="hidden" (change)="onFile($event, 'pdf')" accept="application/pdf" /> Import PDF
    </label>
    <label class="cursor-pointer px-3 py-2 border rounded">
      <input type="file" class="hidden" (change)="onFile($event, 'docx')" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /> Import DOCX
    </label>
    <label class="cursor-pointer px-3 py-2 border rounded">
      <input type="file" class="hidden" (change)="onFile($event, 'linkedin')" accept="application/json" /> Import LinkedIn JSON
    </label>
  </div>
</div>` })
export class ImportResumeComponent {
  constructor(private api: ImportApi, private store: Store) {}
  async onFile(ev:any, kind:'pdf'|'docx'|'linkedin'){ const file=ev?.target?.files?.[0]; if(!file) return;
    try{ const data = kind==='pdf'? await this.api.fromPdf(file): kind==='docx'? await this.api.fromDocx(file): await this.api.fromLinkedInJson(file);
      if(data?.profile) this.store.dispatch(new ReplaceProfile(data.profile)); if(data?.resume) this.store.dispatch(new ReplaceResume(data.resume));
    }catch(e){ console.error(e); } ev.target.value=''; }
}