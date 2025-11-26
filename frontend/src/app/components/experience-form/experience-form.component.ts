import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ExperienceForm {
  title: string; employer: string; city: string;
  startMonth: string; startYear: string; endMonth: string; endYear: string; present: boolean;
  description: string;
}

@Component({
  standalone: true,
  selector: 'aligncv-experience-form',
  imports: [CommonModule],
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss']
})
export class ExperienceFormComponent {
  @Input() model: ExperienceForm = { title:'', employer:'', city:'', startMonth:'', startYear:'', endMonth:'', endYear:'', present:true, description:'' };
  @Output() modelChange = new EventEmitter<ExperienceForm>();
}
