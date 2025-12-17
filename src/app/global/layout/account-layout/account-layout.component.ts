import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Route, Router, ActivatedRoute } from '@angular/router';
import globalRoutes from '../../global.routes';
import { RouteElementUiInterface } from '../../interfaces/route-element-ui.interface';
import { RouteMulter } from '../../helpers/routes-multer';

@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AccountLayoutComponent implements OnInit {
  routes = globalRoutes[0].children ?? [];
  route = inject(ActivatedRoute);
  accountRoutes = signal<RouteElementUiInterface[]>([]);

  ngOnInit(): void {
    const childrenRoutes = this.routes[1].children ?? [];
    const elements: RouteElementUiInterface[] = RouteMulter.getRouteChildren(childrenRoutes);
    this.accountRoutes.set(elements);
  }
}
