import { Component, Inject, OnInit} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UsersService } from './users.service';
import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService]
})
export class UsersComponent implements OnInit {
  // For our Backend
  User: User | undefined;

  // Collected from Auth0
  userEmail: string = '';
  userName: string = '';

  constructor(private UsersService: UsersService, @Inject(DOCUMENT) public document: Document,
  public auth: AuthService) {}


  // When we first connect to the website check if the user exists and if they do, set them as the User
  // If they do not create a profile for them in our database.

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!

      console.log(this.userEmail);

      try{
        this.search(this.userEmail);
      }
      catch{
          if(this.User === undefined){
          console.log("Could not find user. Creating one");
          // Create a new user
          this.add(this.userName);
        }
      }
      if(this.User !== undefined){
        console.log("Found user");
      }
      else{
        console.log("Could not find server")
      }
    })
  }


  // Add a new user
  add(name: string): void {
    name = name.trim();
    if(!name){
      return;
    }

    const newUser: User = {
      Name: name,
      Email: this.userEmail,
      Connections: []
    };

    this.UsersService
      .addUser(newUser)
      .subscribe(user => this.User);
  }

  // Delete user
  delete(): void {
    this.UsersService
      .deleteUser(this.userEmail)
      .subscribe();
  }

  // Search for the user in the database
  search(email: string) {
    if(email){
      this.UsersService
        .searchUser(email)
        .subscribe(user => {
          this.User = user});
    }
  }

  // Update the user
  update(userName: string){
    if(userName){
      this.UsersService
        .updateUser(this.userEmail,userName)
        .subscribe();
    }
  }
}
