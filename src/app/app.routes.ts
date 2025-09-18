import { Routes } from '@angular/router';
import { PrincipalLayoutComponent } from './global/layout/principal-layout/principal-layout.component';
import { IndexPageComponent } from './global/pages/index-page/index-page.component';
import { AuthLayoutComponent } from './auth/layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { isLoggedGuard } from './auth/guards/is-logged.guard';
import authRoutes from './auth/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
    },
    {
        path: '',
        component: PrincipalLayoutComponent,
        children: [
            {
                path: '',
                component: IndexPageComponent
            }
        ],
        canMatch: [isLoggedGuard]
    },
    {
        path: '**',
        redirectTo: 'notes'
    }
];
