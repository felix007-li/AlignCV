import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PersonalModel = { name: string; email: string; phone: string; city: string };

@Component({
  standalone: true,
  selector: 'aligncv-personal-details-form',
  imports: [CommonModule],
  templateUrl: './personal-details-form.component.html',
  styleUrls: ['./personal-details-form.component.scss']
})
export class PersonalDetailsFormComponent {
  @Input() model!: PersonalModel;
  @Output() modelChange = new EventEmitter<PersonalModel>();
}
