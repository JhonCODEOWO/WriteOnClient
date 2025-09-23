import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NoteInterface } from '../../interfaces/note.interface';
import { ResumeNotePipe } from '../../../global/pipes/ResumeNote.pipe';
import { ModalComponent } from "../../../global/components/Modal/Modal.component";
import { ModalTriggerComponent } from '../../../global/components/modal-trigger/modal-trigger.component';
import { TagInterface } from '../../../tags/interfaces/tag.interface';
import { TagsService } from '../../../tags/services/tags.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormHelper } from '../../../global/helpers/form-helpers';

@Component({
  selector: 'note-element',
  imports: [ResumeNotePipe, ModalComponent, ModalTriggerComponent, ReactiveFormsModule],
  templateUrl: './note-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteElementComponent {
  fb = inject(FormBuilder);
  formHelpers = FormHelper;
  
  tagsForm = this.fb.group({
    'tags': this.fb.array<FormGroup>([], [Validators.required, Validators.maxLength(2)])
  });

  tags = signal<null | TagInterface[]>(null);
  note = input.required<NoteInterface>();
  tagService = inject(TagsService);

  //Handle modal triggered
  handleTriggerClicked(){
    this.tagService.getTags().subscribe({
      next: (tags) => {
        this.tags.set(tags);
      }
    }); //Try load all tags to show
  }

  get tagsControl(){
    return this.tagsForm.get('tags') as FormArray;
  }

  pushTag(tag: TagInterface){
    const existingTags = this.tagsControl.controls.map(control => control.value.id);
    if(existingTags.includes(tag.id)) return;
    this.tagsControl.push(this.fb.group({id: [tag.id], name: [tag.name]}));
  }

  deleteTag(tag: AbstractControl){
    const index = this.tagsControl.controls.findIndex((group) => group.value.id === tag.value.id);
    this.tagsControl.removeAt(index);
  }

  onSubmit(){
    this.tagsForm.markAllAsTouched();
    if(this.tagsForm.invalid) return;
    
  }
}
