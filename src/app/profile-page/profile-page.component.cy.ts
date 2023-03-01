import { ProfilePageComponent } from './profile-page.component'
import { IonicModule } from '@ionic/angular'

describe('ProfilePageComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-user-profile></app-user-profile><ion-app>`, {
      declarations: [ProfilePageComponent],
      imports:[IonicModule.forRoot()]
     })
  })
})