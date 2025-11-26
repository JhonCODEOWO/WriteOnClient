import { Component, inject, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ContainerComponent } from './utils/notifications/components/container/container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'WriteOn';
  router = inject(Router);

  
  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => window.HSStaticMethods.autoInit(), 100);
      }
    });
  }
}
