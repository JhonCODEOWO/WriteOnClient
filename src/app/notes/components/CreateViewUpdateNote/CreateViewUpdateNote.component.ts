import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Quill from 'quill';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { TagInterface } from '../../../tags/interfaces/tag.interface';
import { TagsService } from '../../../tags/services/tags.service';
import { NoteResourceRequest } from '../../interfaces/note-request';
import { NotesService } from '../../services/Notes.service';
import { HeaderInfoComponent } from '../../../global/components/HeaderInfo/HeaderInfo.component';
import { CreateTagComponent } from '../../../tags/components/create-tag/create-tag.component';
import { NgClass } from '@angular/common';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { InputComponentComponent } from '../../../global/components/input-component/input-component.component';
import { ButtonStateComponent } from "../../../global/components/button-state/button-state.component";
import { TypeButton } from '../../../global/components/button-state/enums/type-button.enum';
import { StateButton } from '../../../global/components/button-state/enums/state-button.enum';

@Component({
  selector: 'note-create-view-update',
  imports: [ReactiveFormsModule, HeaderInfoComponent, CreateTagComponent, NgClass, LoaderComponent, InputComponentComponent, ButtonStateComponent],
  templateUrl: './CreateViewUpdateNote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateViewUpdateNoteComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  tagsService = inject(TagsService);
  notesService = inject(NotesService);
  formHelpers = FormHelper;
  availableTypes = TypeButton;

  submitButtonState = signal<StateButton>(StateButton.STANDBY);

  richText = viewChild<ElementRef>('richText');
  toolbar = viewChild<ElementRef>('toolbar');

  tagsAvailable = signal<TagInterface[] | null>(null);

  loadTags = effect((onCleanup) => {
    const sub = this.tagsService.getTags().subscribe(tags => this.tagsAvailable.set(tags));
    onCleanup(() => {
      sub.unsubscribe();
    })
  })

  noteForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
    content: ['', [Validators.required]],
    is_shared: [false, [Validators.required]],
    tags: this.fb.array<FormControl<string>>([]),
  })

  ngAfterViewInit(): void {
      const richTextHTML = this.richText()?.nativeElement as HTMLDivElement;
      
      const quill = new Quill(
        richTextHTML, 
        {
          placeholder: 'Contenido de la nota', 
          modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }, {'header': 3}],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                [{ 'font': [] }],
                [{ 'align': [] }],
            ]
          },
          theme: 'snow'
        }
      );

      quill.on('text-change', () => {
        if(quill.getText().trim().length === 0) {
          this.contentControl?.setValue('');
          return;
        }

        this.contentControl?.setValue(quill.getSemanticHTML());
      })
  }

  get contentControl(){
    return this.noteForm.get('content');
  }

  get tagsControl(){
    return this.noteForm.get('tags') as FormArray;
  }

  addControlToTags(id: string){
    //Verify if id exists already
    const newIDTag = this.fb.control(id);
    if(this.tagsControl.controls.some(control => control.value === id)) return;
    this.tagsControl.push(newIDTag);
  }

  //Handle new tag created from component CreateTagComponent
  handleTagCreated(newTag: TagInterface){
    this.tagsAvailable.update(tags => {
      if(!tags) return null;
      return [newTag,...tags]
    })
  }

  //Method to dispatch when a tag is clicked
  addTagAvailable(tag: TagInterface){
    this.addControlToTags(tag.id);
  }

  onSubmit(){
    this.noteForm.markAllAsTouched();
    if(this.noteForm.invalid) return;
    this.submitButtonState.set(StateButton.LOADING);
    const formData:NoteResourceRequest = {...this.noteForm.value as any};
    this.notesService.create(formData).subscribe(note => this.router.navigateByUrl(''));
  }
}
