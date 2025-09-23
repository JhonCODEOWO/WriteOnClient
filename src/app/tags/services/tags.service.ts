import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TagInterface } from '../interfaces/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  client = inject(HttpClient);
  url = `${environment.API_URL}/tags`

  getTags(): Observable<TagInterface[]>{
    return this.client.get<TagInterface[]>(this.url);
  }
}
