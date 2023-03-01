import { TabsComponent } from './tabs.component'
import { TabsRoutingModule } from './tabs-routing.module'
import { IonicModule } from '@ionic/angular'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouteReuseStrategy } from '@angular/router'
import { IonicRouteStrategy } from '@ionic/angular'
import { AppRoutingModule } from '../app-routing.module'

describe('ProfilePageComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-tabs></app-tabs><ion-router-outlet></ion-router-outlet><ion-app>`, {
      declarations: [TabsComponent],
      imports:[IonicModule.forRoot(), TabsRoutingModule, CommonModule, FormsModule, AppRoutingModule],
      providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}]
     })
  })
})