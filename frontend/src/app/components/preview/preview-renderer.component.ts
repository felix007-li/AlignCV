import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-preview-renderer',
  imports: [CommonModule],
  template: `<div class="border rounded p-3 text-sm text-gray-500">Preview renderer placeholder ({{ items?.length || 0 }} items)</div>`
})
export class PreviewRendererComponent {
  @Input() items: any[] = [];
}
