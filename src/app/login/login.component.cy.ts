import { LoginComponent } from './login.component'
import { AuthService } from '@auth0/auth0-angular';
import { mount } from '@cypress/angular'

// describe('LoginComponent', () => {
//   it('mounts', () => {
//     cy.mount(LoginComponent)
//   })
// })

it('mounts', () => {
  mount(LoginComponent, {
    providers: [AuthService],
  })
  cy.get('[data-cy=increment]').click()
  cy.get('[data-cy=counter]').should('have.text', '1')
})