import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  SetTemplate,
  SetFont,
  SetFontSize,
  SetLineHeight,
  SetPalette,
  UiModel,
  TemplateKey,
  PaletteKey
} from '../../state/ui.state';
import { TemplateSelectorComponent } from '../../components/template-selector/template-selector.component';
import { ColorPickerComponent } from '../../components/color-picker/color-picker.component';
import { Template } from '../../models/template.model';
import { tokensToCssVars } from '../../models/template.model';

@Component({
  standalone: true,
  selector: 'app-style-panel',
  imports: [CommonModule, FormsModule, TemplateSelectorComponent, ColorPickerComponent],
  template: `
    <div class="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="flex items-center gap-2 px-4 py-2.5">
        <!-- Templates Button -->
        <div class="flex items-center gap-1.5 relative">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            (click)="toggleTemplateSelector()"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
            <span>Templates</span>
            <svg *ngIf="selectedTemplateName" class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Template Selector Dropdown (positioned above button) -->
          <div
            *ngIf="showTemplateSelector"
            class="absolute bottom-full left-0 mb-2 z-50 w-[700px]"
            (click)="$event.stopPropagation()"
          >
            <app-template-selector
              [selectedTemplateId]="selectedTemplateId"
              (templateSelected)="onTemplateSelected($event)"
            ></app-template-selector>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-5 w-px bg-gray-300"></div>

        <!-- Font Family -->
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
          <select
            class="text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer"
            [ngModel]="(uiState$ | async)?.font"
            (ngModelChange)="onFontChange($event)"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Menlo">Menlo</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <!-- Font Size -->
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
          <div class="flex items-center gap-1">
            <input
              type="number"
              class="text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 w-14 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
              min="8"
              max="24"
              step="1"
              [ngModel]="(uiState$ | async)?.fontSize"
              (ngModelChange)="onFontSizeChange($event)"
            />
            <span class="text-xs text-gray-500">pt</span>
          </div>
        </div>

        <!-- Line Height -->
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <div class="flex items-center gap-1">
            <input
              type="number"
              class="text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 w-14 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
              min="1.0"
              max="2.5"
              step="0.1"
              [ngModel]="(uiState$ | async)?.lineHeight"
              (ngModelChange)="onLineHeightChange($event)"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="h-5 w-px bg-gray-300"></div>

        <!-- Color Palette -->
        <div class="flex items-center gap-1.5 relative">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            (click)="toggleColorPicker()"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
            <div
              class="w-5 h-5 rounded border border-gray-300"
              [style.backgroundColor]="currentColor"
            ></div>
          </button>

          <!-- Color Picker Dropdown (positioned above button) -->
          <div
            *ngIf="showColorPicker"
            class="absolute bottom-full right-0 mb-2 z-50"
            (click)="$event.stopPropagation()"
          >
            <app-color-picker
              [currentColor]="currentColor"
              (colorSelected)="onColorSelected($event)"
            ></app-color-picker>
          </div>
        </div>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      *ngIf="showTemplateSelector || showColorPicker"
      class="fixed inset-0 z-40"
      (click)="closeAllDropdowns()"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StylePanelComponent implements OnInit {
  private store = inject(Store);

  uiState$: Observable<UiModel> = this.store.select((state: any) => state.ui);

  palettes = [
    { key: 'blue' as PaletteKey, name: 'Blue', value: '#2563eb' },
    { key: 'green' as PaletteKey, name: 'Green', value: '#059669' },
    { key: 'rose' as PaletteKey, name: 'Rose', value: '#e11d48' },
    { key: 'purple' as PaletteKey, name: 'Purple', value: '#7c3aed' },
    { key: 'orange' as PaletteKey, name: 'Orange', value: '#ea580c' },
    { key: 'teal' as PaletteKey, name: 'Teal', value: '#0d9488' },
    { key: 'indigo' as PaletteKey, name: 'Indigo', value: '#4f46e5' },
    { key: 'slate' as PaletteKey, name: 'Slate', value: '#475569' }
  ];

  showTemplateSelector = false;
  selectedTemplateId?: string;
  selectedTemplateName?: string;

  showColorPicker = false;
  currentColor: string = '#000000';

  ngOnInit() {
    // Initialize current color from state if needed
    this.uiState$.subscribe(state => {
      if (state) {
        // You can map palette to actual color here if needed
        this.updateColorFromPalette(state.palette);
      }
    });
  }

  toggleTemplateSelector() {
    this.showColorPicker = false; // Close color picker when opening template selector
    this.showTemplateSelector = !this.showTemplateSelector;
  }

  toggleColorPicker() {
    this.showTemplateSelector = false; // Close template selector when opening color picker
    this.showColorPicker = !this.showColorPicker;
  }

  closeAllDropdowns() {
    this.showTemplateSelector = false;
    this.showColorPicker = false;
  }

  onColorSelected(color: string) {
    this.currentColor = color;
    // You can dispatch to NGXS state here if you want to store custom colors
    // For now, just apply the color directly
    document.documentElement.style.setProperty('--primary-color', color);

    // Analytics tracking
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'color_change',
      color: color
    });
  }

  updateColorFromPalette(palette: PaletteKey) {
    const paletteColors: Record<PaletteKey, string> = {
      blue: '#2563eb',
      green: '#059669',
      rose: '#e11d48',
      purple: '#7c3aed',
      orange: '#ea580c',
      teal: '#0d9488',
      indigo: '#4f46e5',
      slate: '#475569'
    };
    this.currentColor = paletteColors[palette] || '#000000';
  }

  onTemplateSelected(template: Template) {
    this.selectedTemplateId = template.metadata.id;
    this.selectedTemplateName = template.metadata.label;
    this.showTemplateSelector = false;

    // Apply template tokens to CSS variables
    this.applyTemplateTokens(template);

    // Analytics tracking
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'template_switch',
      template_id: template.metadata.id,
      template_label: template.metadata.label
    });
  }

  applyTemplateTokens(template: Template) {
    const cssVars = tokensToCssVars(template.tokens);

    // Apply CSS variables to the preview container
    // In a real implementation, you would apply this to the resume preview element
    const previewElement = document.querySelector('.resume-preview');
    if (previewElement) {
      Object.entries(cssVars).forEach(([key, value]) => {
        (previewElement as HTMLElement).style.setProperty(key, value);
      });
    }

    // Also apply to document root for global access
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }

  onTemplateChange(template: string) {
    this.store.dispatch(new SetTemplate(template as TemplateKey));

    // Analytics tracking
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'template_switch',
      template
    });
  }

  onFontChange(font: string) {
    this.store.dispatch(new SetFont(font));
  }

  onFontSizeChange(size: number) {
    this.store.dispatch(new SetFontSize(size));
  }

  onLineHeightChange(lineHeight: number) {
    this.store.dispatch(new SetLineHeight(lineHeight));
  }

  onPaletteChange(palette: PaletteKey) {
    this.store.dispatch(new SetPalette(palette));
  }
}