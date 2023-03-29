import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})


export class UserProfileComponent implements OnInit{
  constructor(public photoService: PhotoService,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  // Collected from Auth0
  userEmail: string = '';
  userName: string = '';
  
  url = 'http://10.136.104.234:3000/';

  ngOnInit(): void {
    console.log("t");
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!
      console.log(this.userEmail);
      this.photoService.setPhoto(this.url + "static/images/" + this.userEmail + "_profile.png")
    })
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery(this.url+ "users/" + this.userEmail + "/image");
  }
}
