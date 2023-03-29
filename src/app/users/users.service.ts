
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs';

import { HttpErrorHandler, HandleError } from './../http-error-handler.service';

import { User } from './user';


const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class UsersService {
  public url = "http://10.136.104.234:3000";
  usersUrl = this.url + "/users"; // URL to web api
  
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler){
      this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  // Get user whose name contains search term
  searchUser(email: string): Observable<User>{
    email = email.trim();
    const url = this.usersUrl + "/" + email;
      return this.http.get<User>(url)
        .pipe(
          catchError(this.handleError<User>
            ('searchUser'))
        );
    }

    // Post add a new hero to the database
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }

  // Delete: delete the user from the server
  deleteUser(email: string): Observable<unknown> {
    const url = `${this.usersUrl}/${email}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError('deleteUser'))
      );
  }

  // Put: update the hero on the server. Returns the updated hero upon sucess
  updateUser(email: string, name : string): Observable<unknown> {  
    const url = this.usersUrl + '/' + email + '?' + 'name=' + name; 
    return this.http.put<User>(url, httpOptions)
      .pipe(
        catchError(this.handleError('updateUserName'))
      );
  }

}
