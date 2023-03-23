import { GraphComponent } from './graph.component'
import { IonicModule } from '@ionic/angular'

describe('GraphComponent', () => {
  it('mounts', () => {
    cy.mount(`<ion-app><app-graph></app-graph><ion-app>`, {
      declarations: [GraphComponent],
      imports:[IonicModule.forRoot()]
     })
  })
})