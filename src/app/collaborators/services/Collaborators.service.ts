import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResource } from '../../global/interfaces/paginated-resource';
import { CollaboratorInterface } from '../interfaces/collaborator-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {
  route = `${environment.API_URL}/users`;
  client = inject(HttpClient);

  all(): Observable<PaginatedResource<CollaboratorInterface>>{
    return this.client.get<PaginatedResource<CollaboratorInterface>>(this.route);
  }
}
