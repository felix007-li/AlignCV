import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProfileState } from '../core/state/profile.state';
import { PatchProfile } from '../core/state/profile.actions';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({ selector:'profile-form', standalone:true, imports:[NgIf, NgFor, FormsModule], template:`
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
export class ProfileFormComponent {
  profile = this.store.selectSnapshot(ProfileState.entity);
  constructor(private store: Store) {}
  patch(changes:any){ this.store.dispatch(new PatchProfile(changes)); }
}