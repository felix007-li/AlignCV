import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type Child = { label: string; path: string; };
type NavItem = { label: string; path?: string; children?: Child[] };

@Component({
  standalone: true,
  selector: 'aligncv-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  open = signal<string | null>(null);

  nav: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Resume', children: [
      { label: 'Templates', path: '/resume/templates' },
      { label: 'Examples',  path: '/resume/examples'  },
    ]},
    { label: 'Cover Letter', children: [
      { label: 'Templates', path: '/cover-letter/templates' },
      { label: 'Examples',  path: '/cover-letter/examples'  },
    ]},
    { label: 'Pricing', path: '/pricing' },
    { label: 'FAQ',     path: '/faq'     },
  ];

  toggle(label: string) {
    this.open.set(this.open() === label ? null : label);
  }

  close() { this.open.set(null); }
}
