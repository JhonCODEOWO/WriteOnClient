import { Route, Routes } from "@angular/router";
import { RouteElementUiInterface } from "../interfaces/route-element-ui.interface";

export class RouteMulter {
    static getRouteChildren(routes: Routes): RouteElementUiInterface[] {
        return routes.filter(route => route.path !== '**').map(route => this.toRouteUiElement(route));
    }

    static toRouteUiElement(route: Route): RouteElementUiInterface{
        return {
            title: route.data?.['label'] ?? `Title not assigned yet in ${route.path}`,
            url: route.path ?? ''
        }
    }
}