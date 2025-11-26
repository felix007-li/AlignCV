import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ResumeState } from '../core/state/resume.state';
import { NgIf } from '@angular/common';
@Component({ selector:'resume-editor', standalone:true, imports:[NgIf], template:`
<div class="space-y-4" *ngIf="resume$ | async as r">
  <h2 class="font-semibold">Resume JSON (demo)</h2>
  <pre class="text-xs bg-gray-50 p-3 rounded">{{ r | json }}</pre>
</div>` })
export class ResumeEditorComponent { resume$=this.store.select(ResumeState.entity); constructor(private store:Store){} }