import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfileImageComponent } from '../../../global/components/profile-image/profile-image.component';
import { CollaboratorInterface } from '../../interfaces/collaborator-interface';

@Component({
  selector: 'collaborator-element',
  imports: [ProfileImageComponent],
  template: `
  <li class="flex gap-x-5 gap-y mt-3 items-center hover:bg-neutral-800 p-1 rounded">
            <app-profile-image [name]="collaborator().name" />
            <div class="flex flex-col grow">
                <span class="font-semibold text-lg text-neutral-800 dark:text-white">{{collaborator().name}}</span>
                <span class="text-sm text-neutral-500 dark:text-neutral-400">{{collaborator().email}}</span>
            </div>
  </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaboratorComponent {
  collaborator = input.required<CollaboratorInterface>();
}
