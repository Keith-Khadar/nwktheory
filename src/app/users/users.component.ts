import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { UsersService } from './users.service';
export interface User{
  id: number;
  name: string;
}

export interface UserData{
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userData: UserData | undefined;
  editUser: User | undefined; // the user currently being edited
  userName = '';

  constructor(private UsersService: UsersService) {}

  @ViewChild('userEditInput')
  set userEditInput(element: 
    ElementRef<HTMLInputElement>) {
      if (element){
        element.nativeElement.focus();
      }
    }
  
  ngOnInit(): void {
    // this.getUsers();
  }

  // getUsers(): void {
  //   this.UsersService.getUsers()
  //     .subscribe(users => (this.users = users));
  // }

  add(name: string): void {
    this.editUser = undefined;
    name = name.trim();
    if(!name){
      return;
    }

    // The server will generate the id for this new user
    const newUser: User = { name } as User;
    this.UsersService
      .addUser(newUser)
      .subscribe(user => this.users.push(user));
  }

  delete(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.UsersService
      .deleteUser(user.id)
      .subscribe();
  }

  edit(userName: string){
    this.update(userName);
    this.editUser = undefined;
  }

  search(searchTerm: string) {
    this.editUser = undefined;
    if(searchTerm){
      this.UsersService
        .searchUsers(searchTerm)
        .subscribe(userdata => (this.userData = userdata));
    } else{
      // this.getUsers();
    }
  }

  update(userName: string){
    if(userName && this.editUser && this.editUser.name !== userName){
      this.UsersService
        .updateUser({...this.editUser, name: userName})
        .subscribe(user => {
          // replace the user in the heroes list with update from server
          const ix = user ? this.users.findIndex(u => u.id === user.id): -1;
          if(ix > -1){
            this.users[ix] = user;
          }
        });
        this.editUser = undefined;
    }
  }
}
