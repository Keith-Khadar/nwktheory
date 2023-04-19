import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Auth0 Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';

// Import Ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { RouteReuseStrategy } from '@angular/router';

// This is our login component that will redirect you to Auth0's universal login
import { LoginComponent } from './login/login.component';

// This is more sending https requests
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChatDetailPageComponent } from './chat-detail-page/chat-detail-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatDetailPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // might need to have this follow browser idk
    AppRoutingModule,
    BrowserAnimationsModule,
    
    // Import the Auth 0
    AuthModule.forRoot({
      domain: 'dev-uw446xx8ru35160g.us.auth0.com',
      clientId: 'EPgxMGFPrviheSCBzWfS73nHejI2paI7',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},],
  bootstrap: [AppComponent]
})
export class AppModule { }
