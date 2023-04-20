import { PhotoService } from './../services/photo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserProfileComponent } from './user-profile.component'
import { IonicModule } from '@ionic/angular'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { AuthModule } from '@auth0/auth0-angular';

describe('ProfilePageComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-user-profile></app-user-profile><ion-app>`, {
      declarations: [UserProfileComponent],
      imports:[IonicModule.forRoot(), HttpClientTestingModule,
        AuthModule.forRoot({
          domain: 'dev-uw446xx8ru35160g.us.auth0.com',
          clientId: 'EPgxMGFPrviheSCBzWfS73nHejI2paI7',
          authorizationParams: {
            redirect_uri: window.location.origin
          }
        })],
      providers: [HttpClient, PhotoService, AuthService]
     })
  })
})
