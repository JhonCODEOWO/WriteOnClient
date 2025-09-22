import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NoteInterface } from '../../interfaces/note.interface';

@Component({
  selector: 'note-element',
  imports: [],
  templateUrl: './note-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteElementComponent {
  note = input.required<NoteInterface>();
}
