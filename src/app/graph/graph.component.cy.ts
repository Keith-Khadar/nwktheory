import { GraphComponent } from './graph.component'
import { IonicModule } from '@ionic/angular'
import { AuthService, AuthModule } from '@auth0/auth0-angular';

describe('GraphComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-graph></app-graph><ion-app>`, {
      declarations: [GraphComponent],
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