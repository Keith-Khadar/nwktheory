import { Component, Inject} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})


export class UserProfileComponent{
  constructor(public photoService: PhotoService,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
