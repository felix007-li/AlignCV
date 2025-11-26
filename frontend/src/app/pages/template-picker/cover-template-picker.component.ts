import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'aligncv-cover-template-picker',
  imports: [CommonModule],
  templateUrl: './cover-template-picker.component.html',
  styleUrls: ['./template-picker.shared.scss']
})
export class CoverTemplatePickerComponent {
  templates = ['Classic', 'Modern', 'Letter Pro'];
}
