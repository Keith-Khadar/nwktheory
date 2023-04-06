import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { PhotoService } from '../services/photo.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../http-error-handler.service';
import { HandleError } from '../http-error-handler.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})




export class UserProfileComponent implements OnInit{

  private handleError: HandleError;

  constructor(public photoService: PhotoService,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private http: HttpClient,
  httpErrorHandler: HttpErrorHandler
  ) {this.handleError = httpErrorHandler.createHandleError('ProfileService');}

  // Collected from Auth0
  userEmail: string = '';
  userName: string = '';

  imageExt: string = '';
  
  url = 'https://nwk.tehe.xyz:3000/';


  ngOnInit(): void {
    console.log("t");
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!
      this.http.get<ProfilePic>(this.url + 'users/' + this.userEmail + '?profilepic=true').subscribe((image) =>{
        this.imageExt = image.ProfilePic.substring(image.ProfilePic.lastIndexOf('.'));
        this.photoService.setPhoto(this.url + "static/images/" + this.userEmail + "_profile" + this.imageExt)
      });
    })
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery(this.url+ "users/" + this.userEmail + "/image");
  }
}

interface ProfilePic {
  "ProfilePic" : string
};
