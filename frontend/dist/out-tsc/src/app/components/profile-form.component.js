var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { ProfileState } from '../core/state/profile.state';
import { PatchProfile } from '../core/state/profile.actions';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ProfileFormComponent = class ProfileFormComponent {
    constructor(store) {
        this.store = store;
        this.profile = this.store.selectSnapshot(ProfileState.entity);
    }
    patch(changes) { this.store.dispatch(new PatchProfile(changes)); }
};
ProfileFormComponent = __decorate([
    Component({ selector: 'profile-form', standalone: true, imports: [NgIf, NgFor, FormsModule], template: `
<div class="border rounded-xl p-4 space-y-3">
  <div class="text-sm font-semibold">User Profile</div>
  <div class="grid grid-cols-1 gap-2" *ngIf="profile as p">
    <label class="text-xs text-gray-500">Name</label>
    <input class="border rounded p-2" [(ngModel)]="p.name" (ngModelChange)="patch({name:$event})" />
    <label class="text-xs text-gray-500">Headline</label>
    <input class="border rounded p-2" [(ngModel)]="p.headline" (ngModelChange)="patch({headline:$event})" />
    <label class="text-xs text-gray-500">Email</label>
    <input class="border rounded p-2" [(ngModel)]="p.email" (ngModelChange)="patch({email:$event})" />
    <label class="text-xs text-gray-500">Phone</label>
    <input class="border rounded p-2" [(ngModel)]="p.phone" (ngModelChange)="patch({phone:$event})" />
    <label class="text-xs text-gray-500">Location</label>
    <input class="border rounded p-2" placeholder="City" [(ngModel)]="p.location.city" (ngModelChange)="patch({location:{...p.location, city:$event}})" />
    <input class="border rounded p-2" placeholder="Region/State" [(ngModel)]="p.location.region" (ngModelChange)="patch({location:{...p.location, region:$event}})" />
    <input class="border rounded p-2" placeholder="Country" [(ngModel)]="p.location.country" (ngModelChange)="patch({location:{...p.location, country:$event}})" />
  </div>
</div>` })
], ProfileFormComponent);
export { ProfileFormComponent };
//# sourceMappingURL=profile-form.component.js.map