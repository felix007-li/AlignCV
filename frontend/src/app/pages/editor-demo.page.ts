import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftEditorV2Component } from '../ui/left-editor-v2/left-editor-v2.component';

@Component({
  standalone: true,
  selector: 'app-editor-demo',
  imports: [CommonModule, LeftEditorV2Component],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <h1 class="text-2xl font-bold text-gray-900">CVWizard-Style Resume Editor (Demo)</h1>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Panel: Editor -->
          <div class="" style="max-height: calc(100vh - 150px)">
            <app-left-editor-v2></app-left-editor-v2>
          </div>

          <!-- Right Panel: Preview Placeholder -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sticky top-8" style="height: fit-content">
            <div class="text-center text-gray-500">
              <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-lg font-medium">Resume Preview</p>
              <p class="text-sm mt-2">Preview will appear here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class EditorDemoPage {}
