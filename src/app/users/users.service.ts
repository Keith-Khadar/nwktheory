import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs';

import { HttpErrorHandler, HandleError } from './../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

export interface User{
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  usersUrl = 'http://10.136.149.139:7000/users'; // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler){
      this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  // Get users from the server
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError('getUser', []))
      );
  }

  // Get users whose name contains search term
  searchUsers(term: string): Observable<User[]>{
    term = term.trim();

    // Add safe, URL encoded search perameter if there is a search term
    const options = term ? 
    { params: new HttpParams().set('name', term) } :
      {};
      return this.http.get<User[]>(this.usersUrl, options)
        .pipe(
          catchError(this.handleError<User[]>
            ('searchUsers', []))
        );
    }
  
  // Save Methods

  // Post add a new hero to the database
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }

  // Delete: delete the user from the server
  deleteUser(id: number): Observable<unknown> {
    const url = `${this.usersUrl}/${id}`; // Delete api/heroes/id
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteUser'))
      );
  }

  // Put: update the hero on the server. Returns the updated hero upon sucess
  updateUser(user: User): Observable<User> {
    httpOptions.headers = 
      httpOptions.headers.set('Authprization', 'my-new-auth-token');
    
    return this.http.put<User>(this.usersUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('updateUser', user))
      );
  }

}
