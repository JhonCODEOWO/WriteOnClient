import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NoteInterface } from '../../interfaces/note.interface';
import { ResumeNotePipe } from '../../../global/pipes/ResumeNote.pipe';
import { ModalComponent } from "../../../global/components/Modal/Modal.component";
import { ModalTriggerComponent } from '../../../global/components/modal-trigger/modal-trigger.component';
import { TagInterface } from '../../../tags/interfaces/tag.interface';
import { TagsService } from '../../../tags/services/tags.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { TagsNote } from '../../interfaces/tags-note.interface';
import { NotesService } from '../../services/Notes.service';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../utils/notifications/services/notifications.service';
import { AuthService } from '../../../auth/services/AuthService.service';

@Component({
  selector: 'note-element',
  imports: [ResumeNotePipe, ModalComponent, ModalTriggerComponent, ReactiveFormsModule, LoaderComponent, InputComponentComponent, RouterLink],
  templateUrl: './note-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteElementComponent {
  fb = inject(FormBuilder);
  formHelpers = FormHelper;
  notificationService = inject(NotificationService);
  user = inject(AuthService)._userAuthenticated;

  createTagForm = this.fb.group({
    name: ['', [Validators.required]]
  })
  
  /**
   * FormGroup to include a array of Tags IDs
   * @todo Reset tags field when the submit is success.
   */
  tagsForm = this.fb.group({
    tags: this.fb.array<FormGroup>([], [Validators.required])
  });

  tags = signal<null | TagInterface[]>(null);
  // actualTags = signal<null | TagInterface[]>(null);
  note = input.required<NoteInterface>();
  tagService = inject(TagsService);
  noteService = inject(NotesService);
  appliedTags = output<TagsNote>() //Event to emit all tags added correctly
  deletedNote = output<string>(); //Event to emit when a note is deleted

  //Handle modal triggered by ModalTrigger component
  handleTriggerClicked(){
    this.tagService.getTags().subscribe({
      next: (tags) => {
        const availableTags = tags.filter(tag => !this.note().tags.includes(tag.name));
        this.tags.set(availableTags);
      }
    }); //Try load all tags to show inside the form
  }

  //Handle cancel from modal component
  handleCancel(){
    this.tags.set(null);
    this.tagsForm.controls.tags.clear();
    // this.actualTags.set(null);
  }

  get tagsControl(){
    return this.tagsForm.get('tags') as FormArray;
  }

  pushTag(tag: TagInterface){
    const existingTags = this.tagsControl.controls.map(control => control.value.id);
    if(existingTags.includes(tag.id)) return;
    this.tagsControl.push(this.fb.group({id: [tag.id, [Validators.required]], name: [tag.name, [Validators.required]]}));
  }

  //Manage tags from form
  deleteTag(tag: AbstractControl){
    const index = this.tagsControl.controls.findIndex((group) => group.value.id === tag.value.id);
    this.tagsControl.removeAt(index);
  }

  //Method that execute a delete operation in backend
  delete(id: string){
    
    if(id != this.note().id || this.user()?.id != this.note().owner.id) {
      this.notificationService.error(`No puedes realizar esta acción porque no eres el propietario.`);
      return;
    };//Check if the id is the same than the note property or the user is different than the owner

    this.noteService.delete(id).subscribe({
      next: (response) => {
        if(response) {
          this.notificationService.success(`${this.note().title} eliminada correctamente`);
          this.deletedNote.emit(id);
        }
      },
      error: error => {
        this.notificationService.error(`No se ha podido eliminar por un error interno, prueba otra vez o intenta de nuevo más tarde`);
      }
    });
  }

  onSubmit(){
    this.tagsForm.markAllAsTouched();
    if(this.tagsForm.invalid) return;
    
    //Get all tags tried to apply.
    const tagsGroup = this.tagsControl.value as TagInterface[];
    const tagsIDs: string[] = tagsGroup.map(tag => tag.id);

    //Make the request to backend
    this.noteService.update(this.note().id, {tags: tagsIDs}).subscribe({
      next: (res) => {
        this.notificationService.success(`Se han aplicado los tags correctamente.`);
        this.appliedTags.emit({noteId: this.note().id, tags: tagsGroup}); //Sent note and tags to applied to the parent
        //TODO CLOSE THE MODAL.
      },
      error: error => {
        this.notificationService.error(`No se pudo llevar a cabo la operación, intenta de nuevo o prueba más tarde.`);
      }
    })
  }


}
