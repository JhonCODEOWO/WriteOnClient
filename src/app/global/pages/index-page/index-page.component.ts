import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/AuthService.service';
import { NotesService } from '../../../notes/services/Notes.service';
import { PaginatedResource } from '../../interfaces/paginated-resource';
import { NoteInterface } from '../../../notes/interfaces/note.interface';
import { NoteElementComponent } from "../../../notes/components/note-element/note-element.component";

@Component({
  selector: 'app-index-page',
  imports: [NoteElementComponent],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent{
  router = inject(Router);
  user = inject(AuthService)._userAuthenticated();
  noteService = inject(NotesService);
  paginatedNotes = signal<PaginatedResource<NoteInterface> | null>(null);
  
  loadPaginatedNotes = effect((onCleanup) => {
    const subscription = this.noteService.findAll().subscribe(notes => this.paginatedNotes.set(notes));

    onCleanup(() => subscription.unsubscribe());
  })
}
