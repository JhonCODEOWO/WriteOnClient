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
import { CreateViewUpdateNoteComponent } from "../../components/CreateViewUpdateNote/CreateViewUpdateNote.component";

@Component({
  selector: 'app-create-note-component',
  imports: [CreateViewUpdateNoteComponent],
  templateUrl: './CreateNoteComponent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNoteComponentComponent {

}
