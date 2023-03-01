/// <reference types="cypress" />

describe('nwktheory testing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })

  // it('Create Auth0 email account', () => {
  //   cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', () => {

  //     // Finds the sign up button and clicks it
  //     cy.get('.c34934055.c2dd6083e').eq(2).click()
      
  //     // Within the sign up page enter a email and password
  //     const email = 'cypress@testing.com'
  //     const password = 'QVu8V1CR^^jx'
  //     // Email 
  //     cy.get('.input.cdb43277e.cc737af35').type(`${email}`)
  //     // Password
  //     cy.get('.input.cdb43277e.c94bb61d1').type(`${password}`)

  //     // Click continue
  //     cy.get('.c994ae14c.c2fd8f218.ca2dc35c7.c0c7f649b.c2b7b15aa').click()
  //   })

  //   // Check to make sure you are logged in
  //   cy.get('.button-inner').eq(0).click()

  // })

  it('Log into Auth0 email account', () => {
    const email = 'cypress@testing.com'
    const password = 'QVu8V1CR^^jx'

    cy.origin('https://dev-uw446xx8ru35160g.us.auth0.com', {args: {email, password} }, ({email, password}) => {
      
      // Within the sign up page enter a email and password
      // Email 
      cy.get('.input.cdb43277e.c07239cfd').type(`${email}`)
      // Password
      cy.get('.input.cdb43277e.c94bb61d1').type(`${password}`)

      // Click continue
      cy.get('.c994ae14c.c2fd8f218.ca2dc35c7.c0c7f649b.cfbf81233').click()
    })

    // Check to make sure you are logged in
    cy.get('#tab-button-Profile').click()
    cy.get('app-user-profile').find('li').should('have.length', 2)
    cy.get('app-user-profile').find('li').eq(0).contains(`${email}`)
    cy.wait(2000)

  })
})
