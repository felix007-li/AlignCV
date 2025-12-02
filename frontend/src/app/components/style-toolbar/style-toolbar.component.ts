import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-style-toolbar',
  imports: [CommonModule],
  template: `<div class="border rounded p-3 text-sm text-gray-500">Style toolbar placeholder <button class="ml-2 px-2 py-1 border" (click)="notify()">Update</button></div>`
})
export class StyleToolbarComponent {
  @Output() styleChange = new EventEmitter<any>();
  notify() { this.styleChange.emit({}); }
}
