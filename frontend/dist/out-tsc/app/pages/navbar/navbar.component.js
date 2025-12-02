var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
let NavbarComponent = class NavbarComponent {
    constructor() {
        this.open = signal(null);
        this.nav = [
            { label: 'Home', path: '/' },
            { label: 'Resume', children: [
                    { label: 'Templates', path: '/resume/templates' },
                    { label: 'Examples', path: '/resume/examples' },
                ] },
            { label: 'Cover Letter', children: [
                    { label: 'Templates', path: '/cover-letter/templates' },
                    { label: 'Examples', path: '/cover-letter/examples' },
                ] },
            { label: 'Pricing', path: '/pricing' },
            { label: 'FAQ', path: '/faq' },
        ];
    }
    toggle(label) {
        this.open.set(this.open() === label ? null : label);
    }
    close() { this.open.set(null); }
};
NavbarComponent = __decorate([
    Component({
        standalone: true,
        selector: 'aligncv-navbar',
        imports: [CommonModule, RouterModule],
        templateUrl: './navbar.component.html',
        styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 50;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .nav {
      width: 100%;
    }

    .nav__inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      gap: 2rem;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      text-decoration: none;
      white-space: nowrap;
      transition: color 0.2s;
    }

    .brand:hover {
      color: #2563eb;
    }

    .nav__menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
    }

    .menu-item {
      position: relative;
    }

    .menu-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 0.375rem;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .menu-link:hover,
    .menu-link:focus {
      color: #1f2937;
      background-color: #f3f4f6;
      outline: none;
    }

    .menu-link.active {
      color: #2563eb;
      font-weight: 600;
    }

    .menu-link.with-caret {
      padding-right: 0.75rem;
    }

    .caret {
      font-size: 0.75rem;
      transition: transform 0.2s;
    }

    .menu-item:hover .caret,
    button[aria-expanded="true"] .caret {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0;
      padding-top: 0.5rem;
      background: transparent;
      min-width: 12rem;
      list-style: none;
    }

    .dropdown::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: -1;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-0.5rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown li {
      margin: 0;
    }

    .dropdown li:first-child a {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    .dropdown li:last-child a {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    .dropdown a {
      display: block;
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      color: #4b5563;
      text-decoration: none;
      transition: all 0.2s;
    }

    .dropdown a:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .btn-dashboard {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      background-color: #2563eb;
      border-radius: 0.375rem;
      text-decoration: none;
      transition: background-color 0.2s;
      white-space: nowrap;
    }

    .btn-dashboard:hover {
      background-color: #1d4ed8;
    }

    @media (max-width: 768px) {
      .nav__inner {
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem 1rem;
      }

      .nav__menu {
        width: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .btn-dashboard {
        width: 100%;
        justify-content: center;
      }
    }
  `]
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map