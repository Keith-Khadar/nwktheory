import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpsService } from '../services/https.service';


@Component({
  selector: 'app-login',
  template: ''
})
export class LoginComponent implements OnInit{
  constructor(public auth: AuthService, private https: HttpsService) {}

  login() {
    this.auth.isAuthenticated$.subscribe((value) => {
        if(value){
        }else{
          this.auth.loginWithRedirect();
          this.https.getUser(true).subscribe();
        }
    } )
  }

  ngOnInit(): void {
    this.login();
  }
}
