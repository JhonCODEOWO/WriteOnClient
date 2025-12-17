import { Routes } from '@angular/router';
import { PrincipalLayoutComponent } from './layout/principal-layout/principal-layout.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { isLoggedGuard } from '../auth/guards/is-logged.guard';
import { AccountLayoutComponent } from './layout/account-layout/account-layout.component';
import { SecurityProfilePageComponent } from './pages/config-account/security-profile-page/security-profile-page.component';
import { EditProfilePageComponent } from './pages/config-account/edit-profile-page/edit-profile-page.component';

const globalRoutes: Routes = [
    {
        path: '',
        component: PrincipalLayoutComponent,
        children: [
            {
                path: '',
                component: IndexPageComponent,
                title: 'Inicio'
            },
            {
                path: 'settings',
                component: AccountLayoutComponent,
                children: [
                    {
                        path: 'edit-profile',
                        component: EditProfilePageComponent,
                        title: 'Editar perfil'
                    },
                    {
                        path: 'security',
                        component: SecurityProfilePageComponent,
                        title: 'Seguridad'
                    },
                    {
                        path: '**',
                        redirectTo: 'edit-profile',
                    }
                ],
                title: 'Configuraciones de la cuenta'
            }
        ],
    }
]


export default globalRoutes;