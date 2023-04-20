/// <reference types="cypress" />

describe('Testing account login and retrieval', () => {
  beforeEach(() => {
    const local = "http://localhost:4200/"
    const prod = "https://nwk.tehe.xyz/"
    cy.visit(prod)
  })

  // it('Create Auth0 email account', () => {
  //   const email = 'cypress@testing.com' 
  //   const password = 'QVu8V1CR^^jx'
  //
  //
  //   cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', {args: {email, password} }, ({email, password}) => {
  //
  //     // Finds the sign up button and click it
  //     cy.get('a').contains('Sign up').click();
  //     
  //     // Within the sign up page enter a email and password
  //
  //     // Email 
  //     cy.get('#email').type(`${email}`)
  //     // Password
  //     cy.get('#password').type(`${password}`)
  //
  //     // Click continue
  //     cy.contains('Continue').click();
  //
  //     cy.wait(500)
  //   })
  //     cy.url().then(($url) =>{
  //       if($url.includes('http://localhost:4200')){
  //         // Check to make sure you are logged in
  //         cy.get('#tab-button-Profile').click()
  //         cy.get('app-user-profile').find('li').should('have.length', 2)
  //         cy.get('app-user-profile').find('li').eq(0).contains(`${email}`)
  //         cy.wait(500)
  //       }
  //     })
  // })

  it('Log into Auth0 email account', () => {
    const email = 'ericzhou001@gmail.com'
    const password = 'Test@123'

    cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', {args: {email, password} }, ({email, password}) => {
      
      // Within the sign up page enter a email and password
       // Email 
       cy.get('#username').type(`${email}`)
      cy.wait(1000)
       // Password
       cy.get('#password').type(`${password}`)
      cy.wait(1000)
 
       // Click continue
       cy.contains('Continue').click();
    })

    // Check to make sure you are logged in
    cy.wait(1500)
    cy.get('#tab-button-Profile').click()
    cy.get('ion-label').contains(email).should('be.visible')
    cy.wait(1500)
  

    // Check that the other tabs work

    // Home
    cy.get('#tab-button-Home').click()
    cy.wait(2000)
    cy.get('#open-modal').click()
    cy.wait(1000)
    // cy.get('.native-input').type('keithkhadar@gmail.com')
    // cy.contains('Confirm').click()
    cy.get('ion-button').contains('Cancel').click()
    cy.wait(1000)
    cy.get('.highcharts-node').eq(1).click()
    cy.wait(2000)
    cy.get('ion-button').contains('Close').click()
    cy.wait(1000)

    // Chat
    cy.get('#tab-button-Chat').click()
    cy.wait(3000)

    // Log out
    cy.get('#tab-button-Profile').click()
    cy.wait(500)
    cy.get('.logout-button').click()
    cy.wait(500)

  })
})
