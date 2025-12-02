import { Component } from '@angular/core'; 
import { RouterLink, RouterOutlet } from '@angular/router'; 

@Component({ selector:'app-root', standalone:true, imports:[RouterOutlet,RouterLink], template:`
    <main class='max-w-full mx-auto p-4'>
        <router-outlet></router-outlet>
    </main>` 
})

export class AppComponent {}
