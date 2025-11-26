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
import { LaravelBroadcastingService } from '../../services/laravel-broadcasting.service';
import { CollaborativeNotesPayload } from '../../interfaces/collaborative-notes-payload';
import { NotificationService } from '../../../utils/notifications/services/notifications.service';

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
  broadcastService = inject(LaravelBroadcastingService);
  notificationService = inject(NotificationService);
  paginatedNotes = signal<PaginatedResource<NoteInterface> | null>(null);

  /**
   * Effect that subscribe to the private channel to receive messages about collaborative notes in this user
   */
  listenForNewCollaborations = effect((onCleanup) => {
    const channelName = `note-assigned.${this.user?.id}`;
    this.broadcastService.echo()?.private(channelName)
      .listen('AssignedToNote', (payload: CollaborativeNotesPayload) => {
        switch (payload.status) {
          case 'ASSIGNED':
            this.notificationService.success(
              `Se te ha añadido como colaborador a una nueva nota: ${payload.note.title}`
            );
            this.paginatedNotes.update((prev) => {
              if(!prev) return null;

              return {...prev, data: [...prev.data, payload.note]}
            })
            break;
          case 'DETACHED':
            this.paginatedNotes.update(prev => {
              if(!prev) return null;
              const actualData = prev.data;
              return {...prev, data: actualData.filter(note => note.id != payload.note.id)};
            })
            break;
          case 'UPDATED': 
              this.paginatedNotes.update(prev => {
                if(!prev) return null;
                const newData = prev.data.map((note):NoteInterface  => note.id === payload.note.id? ({...payload.note}) :note);
                return {...prev, data: newData};
              })
            break;
          default:
            this.notificationService
              .error(
                `No se puede llevar a cabo una acción. Razón: No se ha considerado el status: ${payload.status}`
              );
            break;
        }
      })
  });

  loadPaginatedNotes = effect((onCleanup) => {
    const subscription = this.noteService
      .findAll()
      .subscribe({
        next: paginatedResources => {
          this.paginatedNotes.set(paginatedResources);
        },
        error: error => {
          this.notificationService.error(`No se pueden cargar los recursos por ahora, intenta de nuevo más tarde.`);
        }
      });

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

  handleDeletedNote(idNote: string){
    this.paginatedNotes.update(actual => {
      if(!actual) return null;
      const filtering = actual.data.filter(note => note.id != idNote);
      return {...actual, data: [...filtering]}
    })
  }
}
