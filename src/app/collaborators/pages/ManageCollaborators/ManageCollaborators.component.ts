import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnChanges,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { CollaboratorsService } from '../../services/Collaborators.service';
import { CollaboratorInterface } from '../../interfaces/collaborator-interface';
import { PaginatedResource } from '../../../global/interfaces/paginated-resource';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { ProfileImageComponent } from '../../../global/components/profile-image/profile-image.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CollaboratorComponent } from '../../components/Collaborator/Collaborator.component';
import { ModalTriggerComponent } from '../../../global/components/modal-trigger/modal-trigger.component';
import { ModalComponent } from '../../../global/components/Modal/Modal.component';
import { NoteInterface } from '../../../notes/interfaces/note.interface';
import { NotesService } from '../../../notes/services/Notes.service';
import { firstValueFrom } from 'rxjs';
import { isUUID } from '../../../global/validators/is-uuid.directive';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { HSSelect, ISingleOption } from 'preline/dist';

@Component({
  selector: 'app-manage-collaborators',
  imports: [
    LoaderComponent,
    ProfileImageComponent,
    ReactiveFormsModule,
    CollaboratorComponent,
    ModalTriggerComponent,
    ModalComponent,
  ],
  templateUrl: './ManageCollaborators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCollaboratorsComponent implements AfterViewInit {
  fb = inject(FormBuilder);
  collaboratorService = inject(CollaboratorsService);
  notesService = inject(NotesService);
  formHelpers = FormHelper;
  selectElement = viewChild<ElementRef>('select');

  isLoading = signal(false);
  collaborators = signal<null | PaginatedResource<CollaboratorInterface>>(null);
  notes = signal<null | PaginatedResource<NoteInterface>>(null);

  effectNotes = effect(() => {
    if (this.notes()) {
      const select = HSSelect.getInstance(
        this.selectElement()?.nativeElement
      ) as HSSelect;
      if(!select) return;
      select.addOption(this.notes()!.data.map((note): ISingleOption => ({title: note.title, val: note.id})));
    }
  });

  collaboratorsForm = this.fb.group({
    collaborators: this.fb.array<FormControl<CollaboratorInterface>>(
      [],
      [Validators.required]
    ),
    note: ['', [Validators.required, isUUID]],
  });

  loadCollaborators = effect((onCleanup) => {
    this.isLoading.set(true);
    const subscription = this.collaboratorService
      .all()
      .subscribe((response) => {
        this.collaborators.set(response);
        this.isLoading.set(false);
      });

    onCleanup(() => subscription.unsubscribe());
  });

  ngAfterViewInit(): void {}

  get collaboratorsControl() {
    return this.collaboratorsForm.get('collaborators') as FormArray<
      FormControl<CollaboratorInterface>
    >;
  }

  markCollaborator(
    collaborator: CollaboratorInterface,
    element: HTMLInputElement
  ) {
    if (!element.checked) {
      const index = this.collaboratorsControl.controls.findIndex(
        (control) => control.value.id === collaborator.id
      );
      this.collaboratorsControl.removeAt(index);
      return;
    }

    const collaboratorControl = this.fb.control(collaborator, {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.collaboratorsControl.push(collaboratorControl);

    console.log(this.collaboratorsForm.value);
  }

  onSubmitCollaborators() {
    this.collaboratorsForm.markAllAsTouched();
    if (this.collaboratorsForm.invalid) return;
    const value = {...this.collaboratorsForm.value};
    this.notesService.addCollaborators({collaborators: value.collaborators?.map(collaborator => collaborator.id) ?? []}, value.note ?? '').subscribe((res) => console.log(res));
  }

  handleTriggerClick() {
    window.HSStaticMethods.autoInit();
    const subscription = this.notesService.findAll().subscribe({
      next: (res) => {
        this.notes.set(res);
      },
    });
  }
}
