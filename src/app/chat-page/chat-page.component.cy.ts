import { ChatPageComponent } from './chat-page.component'
import { IonicModule } from '@ionic/angular'

describe('ChatPageComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-chat-page></app-chat-page><ion-app>`, {
      declarations: [ChatPageComponent],
      imports:[IonicModule.forRoot()]
     })
  })
})