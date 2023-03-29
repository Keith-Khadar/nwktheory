import { HomePageComponent } from './home-page.component'
import { IonicModule } from '@ionic/angular'
import { GraphComponent } from '../graph/graph.component'
import { AuthModule } from '@auth0/auth0-angular';

describe('HomePageComponent', () => {
  it('mounts', () => {
    cy.viewport(1000, 1000)
    cy.mount(`<ion-app><app-home-page></app-home-page><ion-app>`, {
      declarations: [HomePageComponent, GraphComponent],
      imports:[IonicModule.forRoot(),
        AuthModule.forRoot({
          domain: 'dev-uw446xx8ru35160g.us.auth0.com',
          clientId: 'EPgxMGFPrviheSCBzWfS73nHejI2paI7',
          authorizationParams: {
            redirect_uri: window.location.origin
          }
        })]
     })
  })
})