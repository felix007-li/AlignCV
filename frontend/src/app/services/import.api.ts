import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ImportApi {
  async fromPdf(file: File){ const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/pdf', { method: 'POST', body: fd }); return r.json(); }
  async fromDocx(file: File){ const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/docx', { method: 'POST', body: fd }); return r.json(); }
  async fromLinkedInJson(file: File){ const fd = new FormData(); fd.append('file', file); const r = await fetch('/api/import/linkedin', { method: 'POST', body: fd }); return r.json(); }
}