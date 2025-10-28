import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, delay, Observable, of, switchMap, tap } from 'rxjs';
import { UserAuthenticated } from '../interfaces/user-authenticated';
import { CollaboratorInterface } from '../../collaborators/interfaces/collaborator-interface';
import { CreateUserInterface } from '../interfaces/create-account-request';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlAuth = `${environment.API_URL}/auth`;
  
  client = inject(HttpClient);
  private userAuthenticated = signal<UserAuthenticated|null>(this.getUserStored());
  private token = signal<string|null>(localStorage.getItem(TOKEN_STORAGE_KEY));

  _userAuthenticated = computed(() => this.userAuthenticated());
  _token = computed(() => this.token());

  login(email: string, password: string): Observable<UserAuthenticated | null>{
    return this.client.post<{token: string}>(`${this.urlAuth}/login`, {email, password}).pipe(
      tap(response => this.handleLogin(response.token)),
      switchMap(() => this.getUser()),
      tap(user => this.userAuthenticated.set(user))
    );
  }

  create(body: CreateUserInterface): Observable<CollaboratorInterface>{
    return this.client.post<CollaboratorInterface>(`${this.urlAuth}/create`, body);
  }

  getUser(): Observable<UserAuthenticated | null>{
    return this.client.get<UserAuthenticated>(`${this.urlAuth}/user`).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  logout(): Observable<boolean>{
    return this.client.delete<boolean>(`${this.urlAuth}/logout`).pipe(
      tap(() => this.handleLogout()),
    );
  }

  handleLogout(){
    this.token.set(null);
    this.userAuthenticated.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  handleLogin(token: string){
    this.token.set(token);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.getUser().subscribe(user => localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)));
  }

  getUserStored(): UserAuthenticated | null{
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if(!data || data.length == 0) return null;

    return JSON.parse(data);
  }
}
