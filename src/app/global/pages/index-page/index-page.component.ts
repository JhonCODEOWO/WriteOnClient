import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/AuthService.service';
import { NotesService } from '../../../notes/services/Notes.service';
import { PaginatedResource } from '../../interfaces/paginated-resource';
import { NoteInterface } from '../../../notes/interfaces/note.interface';
import { NoteElementComponent } from '../../../notes/components/note-element/note-element.component';
import { TagsNote } from '../../../notes/interfaces/tags-note.interface';
import { LoaderComponent } from '../../components/loader/loader.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-index-page',
  imports: [NoteElementComponent, LoaderComponent, NgClass, RouterLink],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent{
  router = inject(Router);
  user = inject(AuthService)._userAuthenticated();
  noteService = inject(NotesService);
  paginatedNotes = signal<PaginatedResource<NoteInterface> | null>(null);

  loadPaginatedNotes = effect((onCleanup) => {
    const subscription = this.noteService
      .findAll()
      .subscribe((notes) => this.paginatedNotes.set(notes));

    onCleanup(() => subscription.unsubscribe());
  });

  /**
   * Handle event when the modal applied new tags correctly
   */
  handleAppliedTags(appliedTags: TagsNote) {
    //Apply tags to the current note inside data.
    this.paginatedNotes.update((actual) => {
      if (!actual) return null;
      const copyData = [...actual.data]; //Get a clone of data actual to manipulate it
      let indexNote = actual.data.findIndex(
        (note) => note.id === appliedTags.noteId
      ); //Get index inside the data of the note
      copyData[indexNote].tags = [
        ...copyData[indexNote].tags,
        ...appliedTags.tags.map((tag) => tag.name),
      ]; //Apply changes to property notes
      return { ...actual, data: [...copyData] }; //Return a copy of all data with only the note modified
    });
  }
}
