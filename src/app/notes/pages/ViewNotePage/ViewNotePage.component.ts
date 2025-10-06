import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, single } from 'rxjs';
import { NotesService } from '../../services/Notes.service';
import { NoteInterface } from '../../interfaces/note.interface';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { HeaderInfoComponent } from "../../../global/components/HeaderInfo/HeaderInfo.component";
import { NgClass } from '@angular/common';
import { RichTextBoxComponent } from '../../../global/components/rich-text-box/rich-text-box.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponentComponent } from '../../../global/components/input-component/input-component.component';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { NoteResourceRequest } from '../../interfaces/note-request';

@Component({
  selector: 'app-view-note-page',
  imports: [LoaderComponent, NgClass, RichTextBoxComponent, ReactiveFormsModule, InputComponentComponent],
  templateUrl: './ViewNotePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewNotePageComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  noteService = inject(NotesService);
  formHelpers = FormHelper;

  noteId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  note = signal<NoteInterface | null>(null);
  loading = signal<boolean>(false);
  editing = signal<boolean>(false);

  //Form
  updateNoteForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
    content: ['', [Validators.required]]
  })

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
    })
  })

  updateSharing(idNote: string){
    let newState = !this.note()?.is_shared;
    this.noteService.update(idNote, {is_shared: newState}).subscribe(updated => this.note.set(updated));
  }

  //Event method to change between editing and not editing and make operations to prepare data.
  async toggleEdition(){

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

  handleWritingContent(content: string){
    this.updateNoteForm.patchValue({content});
  }
}
