import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'aligncv-cover-list',
  imports: [CommonModule],
  templateUrl: './cover-list.component.html',
  styleUrls: ['./cover-list.component.scss']
})
export class CoverListComponent {
  items = Array.from({length:4}).map((_,i)=>({ id: i+1, title: `Cover Letter ${i+1}`, updated: '2d ago' }));
}
