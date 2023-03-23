import { HomePageComponent } from './home-page.component'
import { IonicModule } from '@ionic/angular'
import { GraphComponent } from '../graph/graph.component'

describe('HomePageComponent', () => {
  it('mounts', () => {
    cy.viewport(1000, 1000)
    cy.mount(`<ion-app><app-home-page></app-home-page><ion-app>`, {
      declarations: [HomePageComponent, GraphComponent],
      imports:[IonicModule.forRoot()]
     })
  })
})