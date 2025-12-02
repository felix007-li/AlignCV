import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../pages/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'home-page',
    imports: [CommonModule, NavbarComponent, RouterModule],
    template: `
    <div class="min-h-screen bg-white">
      <aligncv-navbar></aligncv-navbar>

      <!-- Hero Section -->
      <main class="max-w-7xl mx-auto px-6 py-16">
        <section class='grid md:grid-cols-2 gap-12 items-center mb-24'>
          <!-- Left: Resume Preview -->
          <div class='order-2 md:order-1 flex justify-center'>
            <div class='relative group resume-preview-wrapper'>
              <img
                src='assets/images/resume-preview.svg'
                alt='Professional Resume Example'
                class='resume-hero-image w-full max-w-md shadow-2xl rounded-lg transition-all duration-500'
              />
            </div>
          </div>

          <!-- Right: Hero Text -->
          <div class='order-1 md:order-2'>
            <h1 class='text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight'>
              Easily create a professional resume
            </h1>

            <p class='text-lg text-gray-600 mb-8'>
              Fill in your details, select a winning template and download your resume in no time.
            </p>

            <a
              routerLink='/app/resume/new/editor'
              class='inline-block px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
            >
              Get started
            </a>
          </div>
        </section>

        <!-- How does it work Section -->
        <section class='py-16'>
          <h2 class='text-4xl font-bold text-center mb-16 text-gray-900'>
            How does it work?
          </h2>

          <!-- Steps -->
          <div class='grid md:grid-cols-3 gap-8 mb-16'>
            <div
              class='text-center cursor-pointer transition-all'
              [class.opacity-100]='currentStep() === 0'
              [class.opacity-50]='currentStep() !== 0'
              (click)='setStep(0)'
            >
              <div class='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700 mx-auto mb-4 transition-all'
                   [class.bg-blue-600]='currentStep() === 0'
                   [class.text-white]='currentStep() === 0'
                   [class.scale-110]='currentStep() === 0'>
                1
              </div>
              <h3 class='text-xl font-semibold mb-2 text-gray-900'>Enter details</h3>
              <p class='text-gray-600 text-sm'>
                Start by completing the relevant sections that make up the content of your resume.
              </p>
            </div>

            <div
              class='text-center cursor-pointer transition-all'
              [class.opacity-100]='currentStep() === 1'
              [class.opacity-50]='currentStep() !== 1'
              (click)='setStep(1)'
            >
              <div class='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700 mx-auto mb-4 transition-all'
                   [class.bg-blue-600]='currentStep() === 1'
                   [class.text-white]='currentStep() === 1'
                   [class.scale-110]='currentStep() === 1'>
                2
              </div>
              <h3 class='text-xl font-semibold mb-2 text-gray-900'>Select template</h3>
              <p class='text-gray-600 text-sm'>
                Select a template and customize your resume based on your style and personality.
              </p>
            </div>

            <div
              class='text-center cursor-pointer transition-all'
              [class.opacity-100]='currentStep() === 2'
              [class.opacity-50]='currentStep() !== 2'
              (click)='setStep(2)'
            >
              <div class='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700 mx-auto mb-4 transition-all'
                   [class.bg-blue-600]='currentStep() === 2'
                   [class.text-white]='currentStep() === 2'
                   [class.scale-110]='currentStep() === 2'>
                3
              </div>
              <h3 class='text-xl font-semibold mb-2 text-gray-900'>
                <span class='text-blue-600'>Download Resume</span>
              </h3>
              <p class='text-gray-600 text-sm'>
                Download your resume quickly and edit it at any time.
              </p>
            </div>
          </div>

          <!-- Screenshot Display with Animation -->
          <div class='relative bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-2xl overflow-hidden'>
            <div class='relative w-full' style='min-height: 500px;'>
              <!-- Step 1: Enter Details -->
              <div
                class='absolute inset-0 transition-opacity duration-500'
                [class.opacity-100]='currentStep() === 0'
                [class.opacity-0]='currentStep() !== 0'
                [class.pointer-events-none]='currentStep() !== 0'
              >
                <img
                  src='assets/images/step1-enter-details.svg'
                  alt='Step 1: Enter your details'
                  class='w-full h-full object-contain'
                />
              </div>

              <!-- Step 2: Select Template -->
              <div
                class='absolute inset-0 transition-opacity duration-500'
                [class.opacity-100]='currentStep() === 1'
                [class.opacity-0]='currentStep() !== 1'
                [class.pointer-events-none]='currentStep() !== 1'
              >
                <img
                  src='assets/images/step2-select-template.svg'
                  alt='Step 2: Select a template'
                  class='w-full h-full object-contain'
                />
              </div>

              <!-- Step 3: Download Resume -->
              <div
                class='absolute inset-0 transition-opacity duration-500'
                [class.opacity-100]='currentStep() === 2'
                [class.opacity-0]='currentStep() !== 2'
                [class.pointer-events-none]='currentStep() !== 2'
              >
                <img
                  src='assets/images/step3-download-resume.svg'
                  alt='Step 3: Download your resume'
                  class='w-full h-full object-contain'
                />
              </div>
            </div>

            <!-- Navigation Dots -->
            <div class='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
              <button
                *ngFor='let step of [0, 1, 2]'
                (click)='setStep(step)'
                class='w-3 h-3 rounded-full transition-all'
                [class.bg-blue-600]='currentStep() === step'
                [class.w-8]='currentStep() === step'
                [class.bg-gray-300]='currentStep() !== step'
                [attr.aria-label]='"Go to step " + (step + 1)'
              ></button>
            </div>
          </div>
        </section>
      </main>
    </div>
    `,
    styles: [`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      section {
        animation: fadeIn 0.6s ease-out;
      }

      .resume-preview-wrapper {
        perspective: 1000px;
      }

      /* Default state: tilted resume image */
      .resume-hero-image {
        transform: perspective(1000px) rotateY(-5deg);
        transition: transform 0.5s ease;
      }

      /* Hover state: rotate to show the front */
      .group:hover .resume-hero-image {
        transform: perspective(1000px) rotateY(0deg) scale(1.05);
      }
    `]
}) 

export class HomePage implements OnInit, OnDestroy {
  currentStep = signal(0);
  private intervalId?: any;

  ngOnInit() {
    // Auto-rotate steps every 4 seconds
    this.startAutoRotate();
  }

  ngOnDestroy() {
    this.stopAutoRotate();
  }

  setStep(step: number) {
    this.currentStep.set(step);
    // Restart auto-rotate when user manually selects a step
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  private startAutoRotate() {
    this.intervalId = setInterval(() => {
      const next = (this.currentStep() + 1) % 3;
      this.currentStep.set(next);
    }, 4000);
  }

  private stopAutoRotate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}