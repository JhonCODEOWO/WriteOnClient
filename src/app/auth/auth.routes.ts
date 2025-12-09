import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CreateAccountPage } from './pages/create-account-page/create-account-page';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                component: LoginPageComponent
            },
            {
                path: 'create-account',
                component: CreateAccountPage
            },
            {
                path: 'reset-password',
                component: ResetPasswordPageComponent
            }

        ]
    }
    
]

export default authRoutes;