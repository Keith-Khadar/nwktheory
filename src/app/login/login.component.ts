import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-login',
  template: ''
})
export class LoginComponent implements OnInit{
  constructor(public auth: AuthService) {}

  login() {
    this.auth.isAuthenticated$.subscribe((value) => {
        if(value){
        }else{
          this.auth.loginWithRedirect();
        }
    } )
  }

  ngOnInit(): void {
    this.login();
  }
}
