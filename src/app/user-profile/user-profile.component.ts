import { AccountService } from './../services/account.service';
import { HttpsService } from './../services/https.service';
import { Component, OnInit } from '@angular/core';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})




export class UserProfileComponent implements OnInit{

  constructor(public photoService: PhotoService, private https: HttpsService, public account: AccountService) {}

  ngOnInit(): void {
    this.https.getImage().subscribe((image) => {
      this.photoService.setPhoto(image);
    })
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}

interface ProfilePic {
  "ProfilePic" : string
};
