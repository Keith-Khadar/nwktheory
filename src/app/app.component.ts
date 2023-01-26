import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nwktheory';
  public isAuthenticated = false;

  public logout(): void{
    
  }
}
