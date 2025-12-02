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
import { StyleSyncService } from '../style-sync.service';

@Component({
  standalone: true,
  selector: 'app-style-panel',
  imports: [CommonModule, FormsModule, TemplateSelectorComponent, ColorPickerComponent],
  template: `
    <div class="style-bar-shell">
      <div class="style-bar relative" #styleBar>
        <div class="flex items-center justify-between w-full gap-4">
        <!-- Templates Button -->
        <div class="flex items-center bg-white gap-1.5">
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
        <!-- Center and right sections added below -->
        <div class="flex items-center gap-3 justify-center flex-1">
          <!-- Font Family -->
          <div class="flex items-center gap-1.5 relative">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
            </svg>
            <button
              class="inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all min-w-[116px] justify-between"
              (click)="toggleFontMenu()"
            >
              <span class="flex items-center gap-2">
                <span class="font-semibold">Aa</span>
                <span class="truncate max-w-[72px]">{{ currentFontLabel }}</span>
              </span>
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              *ngIf="showFontMenu"
              class="absolute bottom-full left-0 mb-2 z-50 w-52 rounded-lg border border-gray-200 bg-white shadow-lg py-2"
              (click)="$event.stopPropagation()"
            >
              <div class="px-4 pb-2 text-xs font-semibold text-gray-700 tracking-wide">FONT FAMILY</div>
              <button
                *ngFor="let opt of fontOptions"
                class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50"
                [class.text-blue-600]="opt.value === (uiStateSnapshot?.font || defaults.font)"
                (click)="setFont(opt.value)"
              >
                <svg *ngIf="opt.value === (uiStateSnapshot?.font || defaults.font)" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span *ngIf="opt.value !== (uiStateSnapshot?.font || defaults.font)" class="w-4 h-4"></span>
                <span>{{ opt.label }}</span>
              </button>
            </div>
          </div>

          <!-- Font Size -->
          <div class="flex items-center gap-1.5 relative">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
            <button
              class="inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all min-w-[88px] justify-between"
              (click)="toggleFontSizeMenu()"
            >
              <span class="flex items-center gap-1">
                <span class="font-semibold">Tt</span>
                <span>{{ currentFontSizeLabel }}</span>
              </span>
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              *ngIf="showFontSizeMenu"
              class="absolute bottom-full left-0 mb-2 z-50 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-2"
              (click)="$event.stopPropagation()"
            >
              <div class="px-4 pb-2 text-xs font-semibold text-gray-700 tracking-wide">FONT SIZE</div>
              <button
                *ngFor="let opt of fontSizeOptions"
                class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50"
                [class.text-blue-600]="opt.size === (uiStateSnapshot?.fontSize || defaults.fontSize)"
                (click)="setFontSize(opt.size)"
              >
                <svg *ngIf="opt.size === (uiStateSnapshot?.fontSize || defaults.fontSize)" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span *ngIf="opt.size !== (uiStateSnapshot?.fontSize || defaults.fontSize)" class="w-4 h-4"></span>
                <span>{{ opt.label }}</span>
              </button>
            </div>
          </div>

          <!-- Line Height -->
          <div class="flex items-center gap-1.5 relative">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <button
              class="inline-flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all min-w-[100px] justify-between"
              (click)="toggleLineHeightMenu()"
            >
              <span class="flex items-center gap-2">
                <span class="font-semibold">↕</span>
                <span>{{ currentLineHeightLabel }}</span>
              </span>
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              *ngIf="showLineHeightMenu"
              class="absolute bottom-full left-0 mb-2 z-50 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-2"
              (click)="$event.stopPropagation()"
            >
              <div class="px-4 pb-2 text-xs font-semibold text-gray-700 tracking-wide">LINE HEIGHT</div>
              <button
                *ngFor="let opt of lineHeightOptions"
                class="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50"
                [class.text-blue-600]="opt === (uiStateSnapshot?.lineHeight || defaults.lineHeight)"
                (click)="setLineHeight(opt)"
              >
                <svg *ngIf="opt === (uiStateSnapshot?.lineHeight || defaults.lineHeight)" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span *ngIf="opt !== (uiStateSnapshot?.lineHeight || defaults.lineHeight)" class="w-4 h-4"></span>
                <span>{{ opt }}</span>
              </button>
            </div>
          </div>

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

        <!-- Right: Fullscreen -->
        <div class="flex items-center">
          <button
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
            (click)="toggleFullscreen()"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V5a1 1 0 011-1h3m8 0h3a1 1 0 011 1v3m0 8v3a1 1 0 01-1 1h-3m-8 0H5a1 1 0 01-1-1v-3" />
            </svg>
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
        <!-- Templates dropdown aligned to full style pane width with spacing -->
        <div
          *ngIf="showTemplateSelector"
          class="absolute left-0 right-0 bottom-[calc(100%+14px)] z-60 px-2 sm:px-3"
          (click)="$event.stopPropagation()"
        >
          <app-template-selector
            [selectedTemplateId]="selectedTemplateId"
            (templateSelected)="onTemplateSelected($event)"
          ></app-template-selector>
        </div>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      *ngIf="showTemplateSelector || showColorPicker || showFontSizeMenu || showFontMenu || showLineHeightMenu"
      class="fixed inset-0 z-30"
      (click)="closeAllDropdowns()"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .style-bar-shell {
      position: sticky;
      bottom: 0;
      z-index: 60;
      left: 0;
      right: 0;
      width: 100%;
      padding: 0 8px;
      pointer-events: none;
    }

    .style-bar {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      padding: 10px 14px;
      pointer-events: auto;
    }
  `]
})
export class StylePanelComponent implements OnInit {
  private store = inject(Store);
  private styleSync = inject(StyleSyncService);

  uiState$: Observable<UiModel> = this.store.select((state: any) => state.ui);
  uiStateSnapshot: UiModel | null = null;
  readonly defaults: UiModel = { template: 'sans', font: 'Arial, sans-serif', fontSize: 14, lineHeight: 1.25, palette: 'blue' };

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
  userSelectedColor: string | null = null; // Track user-selected color
  showFontSizeMenu = false;
  showFontMenu = false;
  showLineHeightMenu = false;
  isFullscreen = false;

  fontSizeOptions = [
    { label: 'XS', size: 12 },
    { label: 'S', size: 13 },
    { label: 'M', size: 14 },
    { label: 'L', size: 16 },
    { label: 'XL', size: 18 }
  ];
  currentFontSizeLabel = 'M';
  fontOptions = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Poppins', value: 'Poppins, Arial, sans-serif' },
    { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Lora', value: 'Lora, Georgia, serif' },
    { label: 'Menlo', value: 'Menlo, monospace' },
    { label: 'Fira Code', value: '"Fira Code", Menlo, monospace' },
    { label: 'Courier New', value: '"Courier New", monospace' }
  ];
  currentFontLabel = 'Arial';
  lineHeightOptions = [1, 1.15, 1.25, 1.5, 2];
  currentLineHeightLabel = '1.25';

  ngOnInit() {
    // Initialize current color from state if needed
    this.uiState$.subscribe(state => {
      if (state) {
        this.uiStateSnapshot = state;
        this.updateColorFromPalette(state.palette);
        this.currentFontSizeLabel = this.getFontSizeLabel(state.fontSize);
        this.currentFontLabel = this.getFontLabel(state.font);
        this.currentLineHeightLabel = this.getLineHeightLabel(state.lineHeight);
        this.applyStateToPreview(state);
        this.styleSync.setState({
          font: state.font,
          fontSize: state.fontSize,
          lineHeight: state.lineHeight,
          colorPrimary: this.userSelectedColor || this.mapPaletteToColor(state.palette)
        });
      }
    });
  }

  private mapPaletteToColor(palette: PaletteKey): string {
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
    return paletteColors[palette] || '#2563eb';
  }

  toggleTemplateSelector() {
    this.showColorPicker = false; // Close color picker when opening template selector
    this.showFontSizeMenu = false;
    this.showFontMenu = false;
    this.showLineHeightMenu = false;
    this.showTemplateSelector = !this.showTemplateSelector;

    // Ensure CSS vars are re-applied when opening (in case root vars were reset)
    if (this.uiStateSnapshot) {
      this.applyStateToPreview(this.uiStateSnapshot);
    }
  }

  toggleColorPicker() {
    this.showTemplateSelector = false; // Close template selector when opening color picker
    this.showFontSizeMenu = false;
    this.showFontMenu = false;
    this.showLineHeightMenu = false;
    this.showColorPicker = !this.showColorPicker;
  }

  toggleFontSizeMenu() {
    this.showTemplateSelector = false;
    this.showColorPicker = false;
    this.showFontMenu = false;
    this.showLineHeightMenu = false;
    this.showFontSizeMenu = !this.showFontSizeMenu;
  }

  toggleFontMenu() {
    this.showTemplateSelector = false;
    this.showColorPicker = false;
    this.showFontSizeMenu = false;
    this.showFontMenu = !this.showFontMenu;
  }

  toggleLineHeightMenu() {
    this.showTemplateSelector = false;
    this.showColorPicker = false;
    this.showFontSizeMenu = false;
    this.showFontMenu = false;
    this.showLineHeightMenu = !this.showLineHeightMenu;
  }

  closeAllDropdowns() {
    this.showTemplateSelector = false;
    this.showColorPicker = false;
    this.showFontSizeMenu = false;
    this.showFontMenu = false;
    this.showLineHeightMenu = false;
  }

  onColorSelected(color: string) {
    this.currentColor = color;
    this.userSelectedColor = color; // Save user selection

    // Apply color to CSS variables (correct variable name)
    document.documentElement.style.setProperty('--color-primary', color);

    // ALSO apply to preview element (to ensure it works after template switch)
    this.setPreviewVar('--color-primary', color);
    if (this.uiStateSnapshot) {
      this.applyStateToPreview(this.uiStateSnapshot);
    }

    console.log('Color picker selected:', color);

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

  setFontSize(size: number) {
    this.store.dispatch(new SetFontSize(size));
    this.currentFontSizeLabel = this.getFontSizeLabel(size);
    document.documentElement.style.setProperty('--font-size-body', `${size}px`);
    document.documentElement.style.setProperty('--font-size', `${size}px`);

    // Update local snapshot and apply immediately to preview
    this.uiStateSnapshot = { ...(this.uiStateSnapshot || this.defaults), fontSize: size };
    this.applyStateToPreview(this.uiStateSnapshot);
    this.styleSync.setState({
      font: this.uiStateSnapshot.font,
      fontSize: size,
      lineHeight: this.uiStateSnapshot.lineHeight,
      colorPrimary: this.userSelectedColor || this.mapPaletteToColor(this.uiStateSnapshot.palette)
    });

    // Also apply to preview container to match live view
    this.setPreviewVar('--font-size-body', `${size}px`);
    this.setPreviewVar('--font-size', `${size}px`);

    // Analytics
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'font_size_change',
      size
    });

    this.showFontSizeMenu = false;
  }

  private getFontSizeLabel(size: number): string {
    const match = this.fontSizeOptions.find(opt => opt.size === size);
    return match ? match.label : `${size}px`;
  }

  setLineHeight(lineHeight: number) {
    this.store.dispatch(new SetLineHeight(lineHeight));
    document.documentElement.style.setProperty('--line-height', String(lineHeight));

    // Update local snapshot and apply immediately to preview
    this.uiStateSnapshot = { ...(this.uiStateSnapshot || this.defaults), lineHeight };
    this.applyStateToPreview(this.uiStateSnapshot);
    this.styleSync.setState({
      font: this.uiStateSnapshot.font,
      fontSize: this.uiStateSnapshot.fontSize,
      lineHeight,
      colorPrimary: this.userSelectedColor || this.mapPaletteToColor(this.uiStateSnapshot.palette)
    });

    this.setPreviewVar('--line-height', String(lineHeight));

    this.currentLineHeightLabel = this.getLineHeightLabel(lineHeight);
    this.showLineHeightMenu = false;

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'line_height_change',
      lineHeight
    });
  }

  private getLineHeightLabel(lineHeight: number): string {
    return String(lineHeight);
  }

  toggleFullscreen() {
    const target = document.querySelector('.resume-preview') as HTMLElement | null;
    const node = target || document.documentElement;

    if (!document.fullscreenElement) {
      node.requestFullscreen?.().then(() => {
        this.isFullscreen = true;
      }).catch(() => {
        this.isFullscreen = false;
      });
    } else {
      document.exitFullscreen?.().then(() => {
        this.isFullscreen = false;
      }).catch(() => {
        this.isFullscreen = false;
      });
    }
  }

  setFont(font: string) {
    this.store.dispatch(new SetFont(font));
    document.documentElement.style.setProperty('--font-family', font);

    // Update local snapshot and apply immediately to preview
    this.uiStateSnapshot = { ...(this.uiStateSnapshot || this.defaults), font };
    this.applyStateToPreview(this.uiStateSnapshot);
    this.styleSync.setState({
      font,
      fontSize: this.uiStateSnapshot.fontSize,
      lineHeight: this.uiStateSnapshot.lineHeight,
      colorPrimary: this.userSelectedColor || this.mapPaletteToColor(this.uiStateSnapshot.palette)
    });

    this.setPreviewVar('--font-family', font);

    this.currentFontLabel = this.getFontLabel(font);
    this.showFontMenu = false;

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'font_change',
      font
    });
  }

  private getFontLabel(font: string): string {
    const match = this.fontOptions.find(opt => opt.value === font || opt.label === font);
    if (match) return match.label;
    return font || 'Font';
  }

  private setPreviewVar(key: string, value: string) {
    const previewElement = document.querySelector('.resume-preview');
    const canvasElement = previewElement?.querySelector('.resume-canvas') as HTMLElement | null;
    if (previewElement) (previewElement as HTMLElement).style.setProperty(key, value);
    if (canvasElement) canvasElement.style.setProperty(key, value);
  }

  private applyStateToPreview(state: UiModel) {
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
    const primary = this.userSelectedColor || paletteColors[state.palette] || '#2563eb';

    const vars: Record<string, string> = {
      '--font-family': state.font,
      '--font-size': `${state.fontSize}px`,
      '--font-size-body': `${state.fontSize}px`,
      '--line-height': String(state.lineHeight),
      '--color-primary': primary
    };

    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
      this.setPreviewVar(k, v);
    });
  }

  onTemplateSelected(template: Template) {
    console.log('Template selected:', template);
    this.selectedTemplateId = template.metadata.id;
    this.selectedTemplateName = template.metadata.label;
    // Keep selector open for easy comparison
    // this.showTemplateSelector = false;

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

    // Apply to document root and preview
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
      this.setPreviewVar(key, value);
    });

    // Store template ID for special styling (e.g., cw-horizontal, cw-vertical)
    document.documentElement.style.setProperty('--template-id', template.metadata.id);

    // Sync shared style state
    this.styleSync.setState({
      font: template.tokens.fontFamily,
      fontSize: template.tokens.fontSize.body,
      lineHeight: template.tokens.lineHeight,
      colorPrimary: this.userSelectedColor || template.tokens.palette.primary
    });

    // Re-apply user selected color if exists (to override template's default color)
    if (this.userSelectedColor) {
      setTimeout(() => {
        // Apply to document root
        document.documentElement.style.setProperty('--color-primary', this.userSelectedColor!);

        // ALSO apply to preview element (critical for template switching!)
        const previewElement = document.querySelector('.resume-preview');
        if (previewElement) {
          (previewElement as HTMLElement).style.setProperty('--color-primary', this.userSelectedColor!);
        }

        console.log('Re-applied user color after template switch:', this.userSelectedColor);
      }, 100);
    }
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
    this.setFont(font);
  }

  onFontSizeChange(size: number) {
    this.store.dispatch(new SetFontSize(size));
    // Apply font size to CSS variables
    document.documentElement.style.setProperty('--font-size-body', size + 'px');
    // Also update heading size proportionally
    const headingSize = Math.round(size * 1.35);
    document.documentElement.style.setProperty('--font-size-heading', headingSize + 'px');
  }

  onPaletteChange(palette: PaletteKey) {
    this.store.dispatch(new SetPalette(palette));
    // Apply palette color to CSS variables
    this.updateColorFromPalette(palette);
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
    const color = paletteColors[palette] || '#2563eb';
    document.documentElement.style.setProperty('--color-primary', color);

    this.uiStateSnapshot = { ...(this.uiStateSnapshot || this.defaults), palette };
    this.applyStateToPreview(this.uiStateSnapshot);
    this.setPreviewVar('--color-primary', color);
    this.styleSync.setState({
      font: this.uiStateSnapshot.font,
      fontSize: this.uiStateSnapshot.fontSize,
      lineHeight: this.uiStateSnapshot.lineHeight,
      colorPrimary: this.userSelectedColor || color
    });
  }
}
