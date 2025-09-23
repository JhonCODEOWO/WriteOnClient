import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NoteInterface } from '../../interfaces/note.interface';
import { ResumeNotePipe } from '../../../global/pipes/ResumeNote.pipe';
import { ModalComponent } from "../../../global/components/Modal/Modal.component";
import { ModalTriggerComponent } from '../../../global/components/modal-trigger/modal-trigger.component';

@Component({
  selector: 'note-element',
  imports: [ResumeNotePipe, ModalComponent, ModalTriggerComponent],
  templateUrl: './note-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteElementComponent {
  note = input.required<NoteInterface>();
}
