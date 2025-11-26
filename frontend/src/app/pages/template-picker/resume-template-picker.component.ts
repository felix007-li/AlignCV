import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'aligncv-resume-template-picker',
  imports: [CommonModule],
  templateUrl: './resume-template-picker.component.html',
  styleUrls: ['./template-picker.shared.scss']
})
export class ResumeTemplatePickerComponent {
  templates = ['Classic', 'Modern', 'Compact', 'ATS Clean'];
}
