/// <reference types="cypress" />

describe('Testing account login and retrieval', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })

  it('Create Auth0 email account', () => {
    const email = 'cypress@testing.com' 
    const password = 'QVu8V1CR^^jx'


    cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', {args: {email, password} }, ({email, password}) => {

      // Finds the sign up button and click it
      cy.get('a').contains('Sign up').click();
      
      // Within the sign up page enter a email and password

      // Email 
      cy.get('#email').type(`${email}`)
      // Password
      cy.get('#password').type(`${password}`)

      // Click continue
      cy.get('button').contains('Continue').click()

      cy.wait(2000)
    })
      cy.url().then(($url) =>{
        if($url.includes('http://localhost:4200')){
          // Check to make sure you are logged in
          cy.get('#tab-button-Profile').click()
          cy.get('app-user-profile').find('li').should('have.length', 2)
          cy.get('app-user-profile').find('li').eq(0).contains(`${email}`)
          cy.wait(500)
        }
      })
  })

  it('Log into Auth0 email account', () => {
    const email = 'cypress@testing.com'
    const password = 'QVu8V1CR^^jx'

    cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', {args: {email, password} }, ({email, password}) => {
      
      // Within the sign up page enter a email and password
       // Email 
       cy.get('#email').type(`${email}`)
       cy.get('#username').type(`${email}`)
       // Password
       cy.get('#password').type(`${password}`)
 
       // Click continue
       cy.get('button').contains('Continue').click()
    })

    // Check to make sure you are logged in
    cy.get('#tab-button-Profile').click()
    cy.get('app-user-profile li').should('have.length', 2)
    cy.get('app-user-profile li').eq(0).contains(`${email}`)
    cy.wait(500)


    // Check that the other tabs work
    cy.get('#tab-button-Home').click()
    cy.wait(500)
    cy.get('#tab-button-Chat').click()
    cy.wait(500)

    // Log out
    cy.get('#tab-button-Profile').click()
    cy.wait(500)
    cy.get('.logout').click()
    cy.wait(500)

  })
})
