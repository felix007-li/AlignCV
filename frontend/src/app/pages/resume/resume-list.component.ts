import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'aligncv-resume-list',
  imports: [CommonModule],
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})
export class ResumeListComponent {
  items = Array.from({length:6}).map((_,i)=>({ id: i+1, title: `Resume ${i+1}`, updated: '3d ago' }));
}
