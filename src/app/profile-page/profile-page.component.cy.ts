import { PhotoService } from './../services/photo.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfilePageComponent } from './profile-page.component'
import { IonicModule } from '@ionic/angular'
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'

describe('ProfilePageComponent', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;
  
  it('mounts', () => {
    cy.mount(`<ion-app><app-user-profile></app-user-profile><ion-app>`, {
      declarations: [ProfilePageComponent],
      imports:[IonicModule.forRoot(), HttpClientTestingModule],
      providers:[HttpClient, PhotoService]
     })
  })
})