import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagInterface } from '../../interfaces/tag.interface';
import {v4 as UUID} from 'uuid';
import { InputComponentComponent } from '../../../global/components/input-component/input-component.component';

@Component({
  selector: 'create-tag-component',
  imports: [ReactiveFormsModule, InputComponentComponent],
  template: `<form class="flex gap-x-3 justify-between" [formGroup]="createTagForm" (ngSubmit)="onSubmit()">
                    <app-input-component inputType="text" name="name" label="Crea un nuevo tag..."
                        [formGroup]="createTagForm" />
                    <button class="bg-green-400 p-2 text-white rounded max-h-[58px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                        </svg>
                    </button>
                </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTagComponent {
  fb = inject(FormBuilder);

  tagCreated = output<TagInterface>();

  createTagForm = this.fb.group({
    name: ['', [Validators.required]]
  })

  onSubmit(){
    this.createTagForm.markAllAsTouched();
    if(this.createTagForm.invalid) return;
    this.tagCreated.emit({id: UUID(), name: this.createTagForm.controls.name.value ?? ''});
  }
}
