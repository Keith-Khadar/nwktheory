import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from './message.service';

// Type of the handleError function returned by HttpErrorHandler.createHandleError
export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

// Handles HttpClient Errors
@Injectable()
export class HttpErrorHandler {
  constructor(private MessageService: MessageService) { }

  // Create curried handleError function that already knows the service names
  createHandleError = (serviceName = '') => 
    <T>(operation = 'operation', result = {} as T) =>
      this.handleError(serviceName, operation, result);
  
  // Returns a function that handles Http operation failures.
  // This error handler lets the app continue to run as if no error occured.
  
  // @param serviceName is the name of the data service that attempted to operation.
  // @param operation is the name of the operation that failed
  // @param result is the optional value to return as the observable

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T){
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error); // log the error to the console 

      const message = (error.error instanceof ErrorEvent) ? error.error.message : 
      `server returned code ${error.status} with body "${error.error}"`;

      this.MessageService.add(`${serviceName}: ${operation} failed: ${message}`);

      // Let the app keep running by returing a safe result.
      return of( result );
    };
  }

}
