import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { NotesService } from '../../services/Notes.service';
import { NoteInterface } from '../../interfaces/note.interface';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { NgClass } from '@angular/common';
import { RichTextBoxComponent } from '../../../global/components/rich-text-box/rich-text-box.component';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponentComponent } from '../../../global/components/input-component/input-component.component';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { NoteResourceRequest } from '../../interfaces/note-request';
import { LaravelBroadcastingService } from '../../../global/services/laravel-broadcasting.service';
import { CollaboratorInterface } from '../../../collaborators/interfaces/collaborator-interface';
import { ProfileImageComponent } from "../../../global/components/profile-image/profile-image.component";
import { ModalTriggerComponent } from "../../../global/components/modal-trigger/modal-trigger.component";
import { ModalComponent } from "../../../global/components/Modal/Modal.component";
import { CollaboratorsService } from '../../../collaborators/services/Collaborators.service';
import { CollaboratorComponent } from '../../../collaborators/components/Collaborator/Collaborator.component';
import { isUUID } from '../../../global/validators/is-uuid.directive';
import { AuthService } from '../../../auth/services/AuthService.service';

@Component({
  selector: 'app-view-note-page',
  imports: [LoaderComponent, NgClass, RichTextBoxComponent, ReactiveFormsModule, InputComponentComponent, ProfileImageComponent, ModalTriggerComponent, ModalComponent, CollaboratorComponent],
  templateUrl: './ViewNotePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewNotePageComponent{
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  noteService = inject(NotesService);
  collaboratorsService = inject(CollaboratorsService);
  broadcastService = inject(LaravelBroadcastingService);
  authService = inject(AuthService);
  formHelpers = FormHelper;

  modalAddCollaborators = viewChild<ModalComponent>('addCollaboratorsModal');

  noteId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  note = signal<NoteInterface | null>(null);

  //Collaborators that are include in each note.
  collaboratorsInNote = computed<undefined | {main: CollaboratorInterface[], hidden: CollaboratorInterface[]}>(() => {
    
    if(!this.note()) return;
    
    let splitted: {main: CollaboratorInterface[], hidden: CollaboratorInterface[]} = {main: [], hidden: []};
    const collaborators = this.note()?.collaborators;
    
    if(collaborators!.length < 5){
      splitted.main = collaborators ?? [];
      return splitted;
    }
    
    splitted.main = collaborators?.slice(0, 4) ?? [];
    splitted.hidden = collaborators?.slice(4) ?? [];
    return splitted;
  });
  
  private collaborators = signal<CollaboratorInterface[]>([]); //Signal to store collaborators existing
  
  //Filter to get only collaborators available to add in a note and are different than the user authenticated.
  collaboratorsAvailable = computed(()=> {
    return this.collaborators()
      .filter(
        collaborator => 
          !this.note()?.collaborators.map(col => col.id).includes(collaborator.id) && collaborator.id != this.authService._userAuthenticated()?.id
      );
  });

  //Flags to some functionalities
  loading = signal<boolean>(false);
  editing = signal<boolean>(false);

  collaboratorsInWorkspace = signal<CollaboratorInterface[]>([]); //Data about collaborators online in this workspace

  //Make subscription to the presence channel
  listenForChanges = effect(onCleanup => {
    const noteId = this.noteId();
    if(!noteId) return;
    this.broadcastService.echo()?.join(`note.${noteId}`)
        .listen('UpdateNote', (e: {note: NoteInterface}) => {
          this.note.update((actualNote) => {
            if(!actualNote) return null;

            return {...actualNote, ...e.note}
          });
        })
        .here((users: CollaboratorInterface[]) => {
          this.collaboratorsInWorkspace.set(users);
        })
        .joining((user: CollaboratorInterface) => {
            this.collaboratorsInWorkspace.update((actual)=>[...actual, user]);
        })
        .leaving((user: CollaboratorInterface) => {
          this.collaboratorsInWorkspace.update((actual) => 
            actual.filter(u => u.id !== user.id)
          );
        })
        .error((error: any) => {
          if(error.status === 403) console.error('You are not authorized to listen to this channel');
        });

    onCleanup(()=> {
      this.broadcastService.leaveChannel(`presence-note.${noteId}`);
    })
  });

  //Forms
  updateNoteForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
    content: ['', [Validators.required]]
  })

  collaboratorsForm = this.fb.group({
    collaborators: this.fb.array<FormControl<CollaboratorInterface>>(
      [],
      [Validators.required]
    ),
    note: ['', [Validators.required, isUUID]],
  });

  //Get noteID string from the url
  findNote = effect(onCleanup => {
    if(!this.noteId()) return;
    this.loading.set(true);
    const subscription = this.noteService.find(this.noteId() ?? '').subscribe({
      next: res => {
        this.loading.set(false);
        this.note.set(res);
      }
    });

    onCleanup(() => {
      subscription.unsubscribe();
      this.note.set(null);
    })
  })

  get collaboratorsControl(){
    return this.collaboratorsForm.get('collaborators') as FormArray<FormControl<CollaboratorInterface>>;
  }

  //TODO: ADD NOTIFICATION TO NOT OWNER USERS
  updateSharing(idNote: string){
    if(!this.isTheOwner()) return;
    let newState = !this.note()?.is_shared;
    this.noteService.update(idNote, {is_shared: newState}).subscribe(updated => this.note.set(updated));
  }

  //Event method to change between editing and not editing and make operations to prepare data.
  async toggleEdition(){
    if(!this.note()?.is_shared && !this.isTheOwner()) return; //Prevent editing mode in not shared state

    //If the state editing is false we're trying to edit, then patch data.
    if(!this.editing()) this.updateNoteForm.patchValue({title: this.note()?.title, content: this.note()?.content});

    this.editing.set(!this.editing());
  }

  async updateNote(){
    //TODO: IF THE VALUES ARE THE SAME THAN BEFORE DONT MAKE THE REQUEST.
        this.updateNoteForm.markAllAsTouched();
        if (this.updateNoteForm.invalid) return;
        
        const value = this.updateNoteForm.value as NoteResourceRequest;
        const updated = await firstValueFrom(this.noteService.update(this.note()?.id ?? '', {...value, is_shared: this.note()?.is_shared}));

        this.note.set(updated);
        this.editing.set(false);
  }

  markCollaborator(collaborator: CollaboratorInterface, checkbox: HTMLInputElement){
    if (!checkbox.checked) {
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
  }

  //Handle submit event to add collaborators
  onSubmitCollaborators(){
    this.collaboratorsForm.markAllAsTouched();
    if(this.collaboratorsForm.invalid) return;
    const value = {...this.collaboratorsForm.value};

    this.noteService.addCollaborators({collaborators: value.collaborators?.map(collaborator => collaborator.id) ?? []}, value.note ?? '').subscribe({
      next: (res) => {
        if(res) {
          this.note.update((actual) => {
          if(!actual) return null;

          return {...actual, collaborators: [...actual.collaborators, ...value.collaborators ?? []]}
          });

          this.collaboratorsControl.clear();
          this.collaborators.set([]);
          this.collaboratorsForm.markAsUntouched();
          this.modalAddCollaborators()?.closeModal();
        }
      }
    });
  }

  handleWritingContent(content: string){
    this.updateNoteForm.patchValue({content});
  }

  //Handle event of component modal with id addCollaborators to load all data necessary.
  handleClickedTrigger(){
    this.collaboratorsForm.controls.note.patchValue(this.noteId() ?? '');
    this.collaboratorsService.all().subscribe(res => this.collaborators.set(res.data));
  }

  isTheOwner(): boolean{
    return this.authService._userAuthenticated()?.id === this.note()?.owner.id;
  }

  //Delete a collaborator from the resource if it is successfully then update note.
  deleteCollaborator(collaborator: CollaboratorInterface, noteID: string){
    this.noteService.dropCollaborator(noteID, collaborator).subscribe({
      next: (res) => {
        if(res) this.note.update((actual) => {
          if(!actual) return null;
          return {...actual, collaborators: [...actual.collaborators.filter(actual_collaborator => collaborator.id != actual_collaborator.id)]}
        })
      }
    });
  }
}