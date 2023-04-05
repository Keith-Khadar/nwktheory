import { Injectable} from '@angular/core';
import { Platform } from '@ionic/angular';

// Capacitor imports
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

// Custom services 
import { HttpsService } from './https.service';


@Injectable({
  providedIn: 'root'
})
export class PhotoService{
  public photo: UserPhoto = ({
    filepath: '.. soon',
    webviewPath: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  });
  private PHOTO_STORAGE: string = 'photos';

  private platform: Platform;
  constructor(private https: HttpsService, platform: Platform) {
    this.platform = platform;
   }




  public setPhoto(url: string){
    this.photo.webviewPath = url;
  }
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photo = ({
      filepath: ".. soon",
      webviewPath: capturedPhoto.webPath!
    })
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photo),
    })
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Send the base64 Data to the backend
    this.https.updateProfilePic(base64Data);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  private async readAsBase64(photo: Photo) {
      // "hybrid" will detect Cordova or Capacitor
      if (this.platform.is('hybrid')) {
        // Read the file into base64 format
        const file = await Filesystem.readFile({
          path: photo.path!
        });

        return file.data;
      }
      else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
      
        return await this.convertBlobToBase64(blob) as string;
      }
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photo = JSON.parse(photoList.value!) || [];
  
    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
        const readFile = await Filesystem.readFile({
          path: this.photo.filepath,
          directory: Directory.Data
        })
        // Web platform only: Load the photo as base64 data
        this.photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
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
