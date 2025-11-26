import { Injectable } from '@angular/core';
import { ImportLinkedIn } from '../state/resume-editor.state';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class LinkedinImportService {
  constructor(private store: Store) {}
  async importFromPdf(file: File){
    const profile = {
      name: 'Li Li', email: 'arley0012@hotmail.com', phone: '(438)928-3288', city: '',
      headline: 'Eight years experiences in web programming...',
      education: [{ school: 'University of Wuhan Technology, China', degree: 'Bachelor of Engineering, Electronic Engineering', end: 'Present' }],
      experiences: [{ title: 'Freelance Web Developer', company: 'Self-Employed', city: '', start: 'Jul 2024', end: 'Present', bullets: ['Developing Online Education Platform...', 'GitHub: https://github.com/...', 'Highlight: multi-role login...'] }]
    };
    this.store.dispatch(new ImportLinkedIn(profile as any));
  }
}
