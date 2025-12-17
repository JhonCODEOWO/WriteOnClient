import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, delay, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserAuthenticated } from '../interfaces/user-authenticated';
import { CollaboratorInterface } from '../../collaborators/interfaces/collaborator-interface';
import { CreateUserInterface } from '../interfaces/create-account-request';
import { GenericResponseInterface } from '../../global/interfaces/generic-response';
import { ResetPasswordBody } from '../interfaces/reset-password-body.interface';
import { UpdateUserRequest } from '../interfaces/update-user-request';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlAuth = `${environment.API_URL}/auth`;
  
  client = inject(HttpClient);
  private userAuthenticated = signal<UserAuthenticated|null>(this.getUserStored());
  private token = signal<string|null>(localStorage.getItem(TOKEN_STORAGE_KEY));

  _userAuthenticated = computed(() => this.userAuthenticated());
  _token = computed(() => this.token());


  /**
   * Try to login a user, if is successfully then make the next things:
   * - Add the token to the local storage and set it to the token property.
   * - Make a request to get the user from the backend too and set it to userAuthenticated. 
   * 
   * TODO: Refactor `handleLogin` and `login` since both make the same `getUser` request.
   *       This can be simplified to a single request for efficiency and clarity.
   * @param email Email of the user
   * @param password Password of the account
   * @returns 
   */
  login(email: string, password: string): Observable<UserAuthenticated | null>{
    return this.client.post<{token: string}>(`${this.urlAuth}/login`, {email, password}).pipe(
      tap(response => this.handleLogin(response.token)), //Make operations with token retrieved by backends
      switchMap(() => this.getUser()), //Make request to try get the user
      tap(user => {
        if(!user) {
          this.handleLogout();
          return;
        }

        this.storeUser(user);
      }), //Set user logged into the service
      map(user => user)
    );
  }

  /**
   * Make a create user request to the backend and try to make login with it
   * @param body Body request 
   * @returns Observable<UserAuthenticated | null> The interface of a collaborator created successfully
   */
  create(body: CreateUserInterface): Observable<UserAuthenticated | null>{
    return this.client.post<CollaboratorInterface>(`${environment.API_URL}/users`, body).pipe(
      switchMap(userCreated => this.login(userCreated.email, body.password)) //After create try to login
    );
  }
  
  update(body: UpdateUserRequest): Observable<UserAuthenticated> {
    return this.client.post<UserAuthenticated>(`${this.urlAuth}`, {_method: 'PUT', ...body})
      .pipe(
        tap(res => {
          this.storeUser(res);
          
          if(body.password && body.password_confirmation){
            this.handleLogout();
          }
        })
      );
  }

  getUser(): Observable<UserAuthenticated | null>{
    return this.client.get<UserAuthenticated>(`${this.urlAuth}/user`).pipe(
      catchError(() => {
        return of(null);
      }),
    );
  }

  logout(): Observable<boolean>{
    return this.client.delete<boolean>(`${this.urlAuth}/logout`).pipe(
      tap(() => this.handleLogout()),
    );
  }

  /**
   * Request to send a recovery account email to target if has already an account
   * @param email Target to send the recovery email
   * @returns 
   */
  sendRecoverEmail(email: string): Observable<GenericResponseInterface> {
    return this.client.post<GenericResponseInterface>(`${this.urlAuth}/recover-password-email`, {
      email
    });
  }

  /**
   * Make a reset password request
   * @param email The email of the user to reset the password
   * @param bodyReq Body request data.
   * @returns Observable<GenericResponseInterface> The response of the backend
   */
  resetPassword(email: string, bodyReq: ResetPasswordBody): Observable<GenericResponseInterface>{
    return this.client.put<GenericResponseInterface>(`${this.urlAuth}/reset-password/${email}`, bodyReq);
  }

  private handleLogout(){
    this.token.set(null);
    this.userAuthenticated.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private handleLogin(token: string){
    this.token.set(token);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  storeUser(user: UserAuthenticated){
    this.userAuthenticated.set(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  getUserStored(): UserAuthenticated | null{
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if(!data || data.length == 0) return null;

    return JSON.parse(data);
  }
}
