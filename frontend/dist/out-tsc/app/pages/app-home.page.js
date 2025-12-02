var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
let AppHomePage = class AppHomePage {
};
AppHomePage = __decorate([
    Component({ standalone: true, imports: [RouterLink], selector: 'app-home-page', template: `<div class='grid grid-cols-12 gap-4'><aside class='col-span-3 border rounded p-3 bg-white'><nav class='flex flex-col gap-2'><a routerLink='/app/home' class='hover:underline'>Dashboard</a><a routerLink='/app/resume/new/editor' class='hover:underline'>Resume</a><a routerLink='/app/cover-letter/new/editor' class='hover:underline'>Cover Letter</a><div class='mt-auto pt-4 border-t text-sm text-gray-500'>Profile</div></nav></aside><section class='col-span-9'><div class='flex items-center justify-between mb-3'><h2 class='text-xl font-semibold'>Your documents</h2><a routerLink='/app/resume/new/editor' class='px-3 py-1 rounded bg-blue-600 text-white'>Create new resume</a></div><div class='border rounded bg-white p-4'>Empty state</div></section></div>` })
], AppHomePage);
export { AppHomePage };
//# sourceMappingURL=app-home.page.js.map