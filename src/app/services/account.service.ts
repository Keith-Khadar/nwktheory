import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';// Auth 0 
import { Observable, Subject, of } from 'rxjs';// To create observables
import { UserData } from './info';// To get the user data class

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userData = new UserData();
  // This will emit the data when it is availible (if it is not ready yet)
  private userDataSubject = new Subject<UserData>();


  // Gets the data from Auth0 
  constructor(public auth: AuthService) {
    this.auth.user$.subscribe((user : any) => {
      this.userData.Email = user.email;
      this.userData.Name = user.name;
      // This will then emit the data (it is now availible so anyone subscribed will get it)
      this.userDataSubject.next(this.userData);
    })
  }


  // Getter Functions //

  public getUserData(): Observable<UserData>{
    // Check if we already have the data from Auth0
    if(this.userData){
      // Then if we do convert it to an observable and return it
      return of(this.userData);
    }
    // Otherwise have then subscribe to the subject (then when we get the data it will emit it to them)
    else{
      return this.userDataSubject.asObservable();
    }
  }

}
