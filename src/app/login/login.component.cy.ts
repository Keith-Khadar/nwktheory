import { LoginComponent } from './login.component'
import { AuthModule } from '@auth0/auth0-angular';
import { mount } from '@cypress/angular'
import { IonicModule } from '@ionic/angular'


it('mounts', () => {
  mount(`<ion-app><app-login></app-login></ion-app>`, {
    declarations: [LoginComponent],
    imports:[IonicModule.forRoot(), AuthModule.forRoot({
      domain: 'dev-uw446xx8ru35160g.us.auth0.com',
      clientId: 'EPgxMGFPrviheSCBzWfS73nHejI2paI7',
      authorizationParams: {
        redirect_uri: window.location.origin
      }})]
  })
})