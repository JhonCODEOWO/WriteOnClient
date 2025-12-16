import { Routes } from '@angular/router';
import { PrincipalLayoutComponent } from '../global/layout/principal-layout/principal-layout.component';
import { CreateNoteComponentComponent } from './pages/CreateNoteComponent/CreateNoteComponent.component';
import { ViewNotePageComponent } from './pages/ViewNotePage/ViewNotePage.component';

export const noteRoutes: Routes = [
    {
        path: '',
        component: PrincipalLayoutComponent,
        children: [
            {
                path: 'new',
                component: CreateNoteComponentComponent
            },
            {
                path: ':id',
                component: ViewNotePageComponent
            },
        ]
    }
]

export default noteRoutes;