import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-section-editor',
  imports: [CommonModule],
  template: `<div class="border rounded p-3 text-sm text-gray-500">Section editor placeholder ({{ title }})</div>`
})
export class SectionEditorComponent {
  @Input() title = '';
}
