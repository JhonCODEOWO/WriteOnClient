import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResource } from '../../global/interfaces/paginated-resource';
import { NoteInterface } from '../interfaces/note.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  url = `${environment.API_URL}/notes`;
  client = inject(HttpClient);

  findAll(): Observable<PaginatedResource<NoteInterface>>{
    return this.client.get<PaginatedResource<NoteInterface>>(`${this.url}`);
  }
}
