import { Routes } from '@angular/router';
import { PrincipalLayoutComponent } from '../global/layout/principal-layout/principal-layout.component';
import { ManageCollaboratorsComponent } from './pages/ManageCollaborators/ManageCollaborators.component';

export const CollaboratorsRoutes: Routes = [
    {
        path: '',
        component: PrincipalLayoutComponent,
        children: [
            {
                path: '',
                component: ManageCollaboratorsComponent
            }
        ]
    }
]

export default CollaboratorsRoutes;