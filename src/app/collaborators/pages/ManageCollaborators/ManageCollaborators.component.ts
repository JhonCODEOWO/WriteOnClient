import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal } from '@angular/core';
import { CollaboratorsService } from '../../services/Collaborators.service';
import { CollaboratorInterface } from '../../interfaces/collaborator-interface';
import { PaginatedResource } from '../../../global/interfaces/paginated-resource';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { ProfileImageComponent } from "../../../global/components/profile-image/profile-image.component";
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollaboratorComponent } from '../../components/Collaborator/Collaborator.component';
import { ModalTriggerComponent } from "../../../global/components/modal-trigger/modal-trigger.component";
import { ModalComponent } from "../../../global/components/Modal/Modal.component";

@Component({
  selector: 'app-manage-collaborators',
  imports: [LoaderComponent, ProfileImageComponent, ReactiveFormsModule, CollaboratorComponent, ModalTriggerComponent, ModalComponent],
  templateUrl: './ManageCollaborators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCollaboratorsComponent {
  fb = inject(FormBuilder);

  collaboratorsForm = this.fb.group({
    collaborators: this.fb.array<FormControl<CollaboratorInterface>>([], [Validators.required]),
    note: ['', [Validators.required]]
  })
  
  collaboratorService = inject(CollaboratorsService);
  isLoading = signal(false);
  collaborators = signal<null |  PaginatedResource<CollaboratorInterface>>(null);

  loadCollaborators = effect((onCleanup) => {
    this.isLoading.set(true);
    const subscription = this.collaboratorService.all().subscribe((response) => {
      this.collaborators.set(response);
      this.isLoading.set(false);
    })

    onCleanup(() => subscription.unsubscribe());
  })

  get collaboratorsControl(){
    return this.collaboratorsForm.get('collaborators') as FormArray<FormControl<CollaboratorInterface>>;
  }
  
  markCollaborator(collaborator: CollaboratorInterface, element: HTMLInputElement){
    if(!element.checked) {
      const index = this.collaboratorsControl.controls.findIndex(control => control.value.id === collaborator.id);
      this.collaboratorsControl.removeAt(index);
      return;
    }

    const collaboratorControl = this.fb.control(collaborator,{nonNullable:true, validators: [Validators.required]});

    this.collaboratorsControl.push(collaboratorControl)

    console.log(this.collaboratorsForm.value);
  }
}
