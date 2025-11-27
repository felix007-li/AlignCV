import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LeftEditorComponent } from '../ui/left-editor/left-editor.component';
import { PreviewPaneComponent } from '../ui/preview-pane/preview-pane.component';
import { StylePanelComponent } from '../ui/style-panel/style-panel.component';

@Component({
  standalone: true,
  imports: [CommonModule, LeftEditorComponent, PreviewPaneComponent, StylePanelComponent],
  selector: 'editor-page',
  template: `
    <div class="flex flex-col h-screen bg-gray-50 w-full">
      <!-- Header / Navigation Bar -->
      <header class="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-6 py-3">
          <div class="flex items-center gap-4">
            <button class="text-gray-600 hover:text-gray-900" (click)="goBack()">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">{{ documentType === 'cover-letter' ? 'Cover Letter' : 'Resume' }} Editor</h1>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Resume
            </button>
            <select class="border border-gray-300 rounded px-3 py-1.5 text-sm">
              <option>English</option>
              <option>Español (MX)</option>
              <option>Français (CA)</option>
            </select>
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <!-- Main Editor Layout (Full Height) -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Editor Panel -->
        <aside class="w-6/12 flex-shrink-0 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <app-left-editor></app-left-editor>
        </aside>

        <!-- Right Preview Panel -->
        <section class="flex-1 flex flex-col bg-gray-100 border-r border-gray-200">
          <!-- Preview Pane - scrollable area -->
          <div class="flex-1 overflow-y-auto pt-6 px-6 pb-6">
            <div class="flex items-start justify-center min-h-full">
              <app-preview-pane></app-preview-pane>
            </div>
          </div>

          <!-- Style Panel at bottom - Sticky, Always Visible -->
          <div class="sticky bottom-0 px-4 py-3 bg-white border-t border-gray-200 z-10">
            <app-style-panel></app-style-panel>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `]
})
export class EditorPage implements OnInit {
  documentType: string = 'resume';
  documentId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get document type and ID from route
    this.route.url.subscribe(segments => {
      if (segments.length > 0) {
        this.documentType = segments[0].path; // 'resume' or 'cover-letter'
      }
    });

    this.route.params.subscribe(params => {
      this.documentId = params['id'];
    });
  }

  goBack() {
    window.history.back();
  }
}