import { Component } from '@angular/core';
import { ProfileFormComponent } from './profile-form.component';
import { JdSuggestAdvancedComponent } from './jd-suggest-advanced.component';
@Component({ selector:'profile-sidebar', standalone:true, imports:[ProfileFormComponent, JdSuggestAdvancedComponent], template:`
<aside class="w-full md:w-80 shrink-0 space-y-3">
  <profile-form></profile-form>
  <jd-suggest-advanced></jd-suggest-advanced>
</aside>` })
export class ProfileSidebarComponent {}
