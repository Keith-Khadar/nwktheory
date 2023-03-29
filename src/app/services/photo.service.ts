import { catchError } from 'rxjs';
import { Component, Inject, Injectable, OnInit} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { HttpErrorHandler, HandleError } from './../http-error-handler.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PhotoService{

  private handleError: HandleError;

  
  constructor(
  private http: HttpClient,
  httpErrorHandler: HttpErrorHandler
  ) { this.handleError = httpErrorHandler.createHandleError('ProfileService');}


  public photo: UserPhoto = ({
    filepath: '.. soon',
    webviewPath: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  });

  public body: Body = ({
    image: "..."
  })

  public setPhoto(url: string){
    this.photo.webviewPath = url;
  }
  public async addNewToGallery(url : string) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto, url);
    this.photo = ({
      filepath: ".. soon",
      webviewPath: capturedPhoto.webPath!
    })
  }

  private async savePicture(photo: Photo, url:string) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);
  
    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    
    // Send to Backend
    this.body.image = base64Data;

    
    this.http.put<UserPhoto>(url,this.body).subscribe();


    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
export interface Body{
  image: string;
}
