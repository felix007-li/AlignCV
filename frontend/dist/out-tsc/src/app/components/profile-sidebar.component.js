var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { ProfileFormComponent } from './profile-form.component';
import { JdSuggestAdvancedComponent } from './jd-suggest-advanced.component';
let ProfileSidebarComponent = class ProfileSidebarComponent {
};
ProfileSidebarComponent = __decorate([
    Component({ selector: 'profile-sidebar', standalone: true, imports: [ProfileFormComponent, JdSuggestAdvancedComponent], template: `
<aside class="w-full md:w-80 shrink-0 space-y-3">
  <profile-form></profile-form>
  <jd-suggest-advanced></jd-suggest-advanced>
</aside>` })
], ProfileSidebarComponent);
export { ProfileSidebarComponent };
//# sourceMappingURL=profile-sidebar.component.js.map