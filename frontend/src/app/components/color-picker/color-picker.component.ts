import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="color-picker-container" (click)="$event.stopPropagation()">
      <!-- Gradient Selector -->
      <div class="gradient-selector-wrapper">
        <canvas
          #gradientCanvas
          class="gradient-canvas"
          width="240"
          height="180"
          (mousedown)="onGradientMouseDown($event)"
        ></canvas>
        <!-- Selector Circle -->
        <div
          class="gradient-selector"
          [style.left.px]="selectorX"
          [style.top.px]="selectorY"
        ></div>
      </div>

      <!-- Hue Slider -->
      <div class="hue-slider-wrapper">
        <div
          class="hue-slider"
          #hueSlider
          (mousedown)="onHueMouseDown($event)"
        >
          <div
            class="hue-selector"
            [style.left.px]="hueX"
          ></div>
        </div>
      </div>

      <!-- Preset Colors -->
      <div class="preset-colors">
        <button
          *ngFor="let preset of presetColors"
          class="preset-color"
          [class.selected]="selectedColor === preset.value"
          [style.backgroundColor]="preset.value"
          (click)="selectPresetColor(preset.value)"
          [title]="preset.name"
        >
          <svg *ngIf="selectedColor === preset.value" class="check-icon" fill="white" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Hex Input -->
      <div class="hex-input-wrapper">
        <input
          type="text"
          class="hex-input"
          [(ngModel)]="hexValue"
          (blur)="onHexInput()"
          (keyup.enter)="onHexInput()"
          maxlength="7"
          placeholder="#000000"
        />
      </div>
    </div>
  `,
  styles: [`
    .color-picker-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      padding: 1rem;
      width: 280px;
    }

    .gradient-selector-wrapper {
      position: relative;
      margin-bottom: 1rem;
      cursor: crosshair;
    }

    .gradient-canvas {
      display: block;
      border-radius: 6px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .gradient-selector {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
      pointer-events: none;
      transform: translate(-50%, -50%);
    }

    .hue-slider-wrapper {
      margin-bottom: 1rem;
    }

    .hue-slider {
      position: relative;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(to right,
        #ff0000 0%,
        #ffff00 17%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 67%,
        #ff00ff 83%,
        #ff0000 100%
      );
      cursor: pointer;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .hue-selector {
      position: absolute;
      top: 50%;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .preset-colors {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .preset-color {
      aspect-ratio: 1;
      border-radius: 6px;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preset-color:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .preset-color.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }

    .check-icon {
      width: 16px;
      height: 16px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .hex-input-wrapper {
      margin-top: 0.75rem;
    }

    .hex-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
      text-align: center;
      background: #f9fafb;
      transition: all 0.2s;
    }

    .hex-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class ColorPickerComponent implements OnInit, AfterViewInit {
  @Input() currentColor: string = '#000000';
  @Output() colorSelected = new EventEmitter<string>();
  @ViewChild('gradientCanvas') gradientCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('hueSlider') hueSlider?: ElementRef<HTMLDivElement>;

  selectedColor: string = '#000000';
  hexValue: string = '#000000';

  // Gradient selector position
  selectorX: number = 0;
  selectorY: number = 0;

  // Hue selector position
  hueX: number = 0;

  // Current HSV values
  hue: number = 0;
  saturation: number = 100;
  value: number = 0;

  presetColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Brown', value: '#7f5539' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Gray', value: '#9ca3af' },
    { name: 'Dark Gray', value: '#6b7280' }
  ];

  private isDraggingGradient = false;
  private isDraggingHue = false;

  ngOnInit() {
    this.selectedColor = this.currentColor;
    this.hexValue = this.currentColor;
    this.updateFromHex(this.currentColor);
  }

  ngAfterViewInit() {
    this.drawGradient();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
  }

  drawGradient() {
    if (!this.gradientCanvas) return;

    const canvas = this.gradientCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Get base color from hue
    const baseColor = this.hsvToRgb(this.hue, 100, 100);

    // White to color gradient (horizontal)
    const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, 'rgb(255, 255, 255)');
    whiteGradient.addColorStop(1, `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`);

    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);

    // Black gradient (vertical)
    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);
  }

  onGradientMouseDown(event: MouseEvent) {
    this.isDraggingGradient = true;
    this.updateGradientPosition(event);
  }

  onHueMouseDown(event: MouseEvent) {
    this.isDraggingHue = true;
    this.updateHuePosition(event);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDraggingGradient) {
      this.updateGradientPosition(event);
    } else if (this.isDraggingHue) {
      this.updateHuePosition(event);
    }
  }

  onMouseUp() {
    this.isDraggingGradient = false;
    this.isDraggingHue = false;
  }

  updateGradientPosition(event: MouseEvent) {
    if (!this.gradientCanvas) return;

    const canvas = this.gradientCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Clamp values
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    this.selectorX = x;
    this.selectorY = y;

    // Update HSV
    this.saturation = (x / rect.width) * 100;
    this.value = 100 - (y / rect.height) * 100;

    this.updateColorFromHSV();
  }

  updateHuePosition(event: MouseEvent) {
    if (!this.hueSlider) return;

    const slider = this.hueSlider.nativeElement;
    const rect = slider.getBoundingClientRect();

    let x = event.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));

    this.hueX = x;
    this.hue = (x / rect.width) * 360;

    this.drawGradient();
    this.updateColorFromHSV();
  }

  updateColorFromHSV() {
    const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
    this.selectedColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    this.hexValue = this.selectedColor;
    this.colorSelected.emit(this.selectedColor);
  }

  selectPresetColor(color: string) {
    this.selectedColor = color;
    this.hexValue = color;
    this.updateFromHex(color);
    this.colorSelected.emit(color);
  }

  onHexInput() {
    let hex = this.hexValue.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.selectedColor = hex;
      this.updateFromHex(hex);
      this.colorSelected.emit(hex);
    } else {
      // Reset to current color if invalid
      this.hexValue = this.selectedColor;
    }
  }

  updateFromHex(hex: string) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return;

    const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
    this.hue = hsv.h;
    this.saturation = hsv.s;
    this.value = hsv.v;

    // Update UI positions
    if (this.gradientCanvas && this.hueSlider) {
      const canvas = this.gradientCanvas.nativeElement;
      const slider = this.hueSlider.nativeElement;

      this.selectorX = (this.saturation / 100) * canvas.width;
      this.selectorY = ((100 - this.value) / 100) * canvas.height;
      this.hueX = (this.hue / 360) * slider.clientWidth;

      this.drawGradient();
    }
  }

  // Color conversion utilities
  hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : (diff / max) * 100;
    const v = max * 100;

    if (diff !== 0) {
      if (max === r) {
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / diff + 2) / 6;
      } else {
        h = ((r - g) / diff + 4) / 6;
      }
    }

    return { h: h * 360, s, v };
  }

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}
