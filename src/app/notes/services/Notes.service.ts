import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResource } from '../../global/interfaces/paginated-resource';
import { NoteInterface } from '../interfaces/note.interface';
import { HttpClient } from '@angular/common/http';
import { NoteResourceRequest } from '../interfaces/note-request';
import { GenericResponseInterface } from '../../global/interfaces/generic-response';
import { CollaboratorInterface } from '../../collaborators/interfaces/collaborator-interface';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  url = `${environment.API_URL}/notes`;
  client = inject(HttpClient);

  create(body: NoteResourceRequest): Observable<NoteInterface>{
    return this.client.post<NoteInterface>(`${this.url}/create`, body);
  }

  find(id: string): Observable<NoteInterface>{
    return this.client.get<NoteInterface>(`${this.url}/${id}`);
  }

  findAll(): Observable<PaginatedResource<NoteInterface>>{
    return this.client.get<PaginatedResource<NoteInterface>>(`${this.url}`);
  }

  update(idNote: string, body: Partial<NoteResourceRequest>): Observable<NoteInterface>{
    return this.client.post<NoteInterface>(`${this.url}/update/${idNote}`, {_method: 'PATCH',...body});
  }

  delete(idNote: string): Observable<boolean>{
    return this.client.delete<boolean>(`${this.url}/${idNote}`);
  }

  deleteTag(idNote: string, idTag: string): Observable<GenericResponseInterface>{
    return this.client.delete<GenericResponseInterface>(`${this.url}/${idNote}/${idTag}`);
  }

  addCollaborators(body: {collaborators: string[]}, noteID: string): Observable<boolean>{
    return this.client.post<boolean>(`${this.url}/add_collaborators/${noteID}`, body);
  }

  dropCollaborator(noteID: string, collaboratorID: CollaboratorInterface): Observable<boolean>{
    return this.client.delete<boolean>(`${this.url}/collaborators/${noteID}/${collaboratorID.id}`);
  }
}
