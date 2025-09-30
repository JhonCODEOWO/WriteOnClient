import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import Quill from 'quill';
import Toolbar from 'quill/modules/toolbar';
import { CheckComponent } from "../../../global/components/check/check.component";
import { FormHelper } from '../../../global/helpers/form-helpers';
import { TagsService } from '../../../tags/services/tags.service';
import { TagInterface } from '../../../tags/interfaces/tag.interface';
import { LoaderComponent } from '../../../global/components/loader/loader.component';
import { CreateTagComponent } from "../../../tags/components/create-tag/create-tag.component";
import { HeaderInfoComponent } from "../../../global/components/HeaderInfo/HeaderInfo.component";
import { NgClass } from '@angular/common';
import { NotesService } from '../../services/Notes.service';
import { NoteResourceRequest } from '../../interfaces/note-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-note-component',
  imports: [ReactiveFormsModule, InputComponentComponent, CheckComponent, LoaderComponent, CreateTagComponent, HeaderInfoComponent, NgClass],
  templateUrl: './CreateNoteComponent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNoteComponentComponent implements AfterViewInit{
  fb = inject(FormBuilder);
  router = inject(Router);
  tagsService = inject(TagsService);
  notesService = inject(NotesService);
  formHelpers = FormHelper;

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
    const formData:NoteResourceRequest = {...this.noteForm.value as any};
    this.notesService.create(formData).subscribe(note => this.router.navigateByUrl(''));
  }
}
