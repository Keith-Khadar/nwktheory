import { UserProfileComponent } from './user-profile.component'
import { IonicModule } from '@ionic/angular'

describe('ProfilePageComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-user-profile></app-user-profile><ion-app>`, {
      declarations: [UserProfileComponent],
      imports:[IonicModule.forRoot()]
     })
  })
})