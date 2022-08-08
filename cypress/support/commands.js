// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/loginpage");
    cy.get('input[type="email"]').type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains("You have successfully logged in").should("be.visible");
  });
});

Cypress.Commands.add("loginfailed", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("/loginpage");
    cy.get('input[type="email"]').type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });
});

Cypress.Commands.add("createTestListing", (userRole) => {
  cy.visit("/create-listing");

  // User wants to find a tutee
  cy.contains("tutor").click();
  cy.contains("tutee").should("be.visible");

  // User wants to teach for $20 per hour
  cy.get("#rates").type("20");

  // User wants to add "Other" tag with unique user role identifier
  cy.get("[name='selection-field']").find("select").select("Others");
  cy.get("[name='selection-field']")
    .find("input")
    .type(`cypress-${userRole} here`);

  // User submits listing
  cy.get("button[type='submit']").click();
  cy.contains("Submitting...").should("be.visible");

  // User should be redirected to listings page
  cy.url().should("contain", "listingspage");
});

Cypress.Commands.add("deleteTestListing", (userRole) => {
  cy.visit("/listingspage");

  // Click on created card with user role identifier
  cy.get("[role='figure']")
    .contains(`cypress-${userRole} here`)
    .parent()
    .parent()
    .click();

  // Click on the Delete button
  cy.get(".btn").contains("Delete").click();

  // Assert presence of confirmation message
  cy.contains("Are you sure?").should("be.visible");
  cy.get("button").contains("Yes").click();

  // Ensure listing is really deleted
  cy.get("[role='figure']")
    .contains(`cypress-${userRole} here`)
    .parent()
    .parent()
    .should("not.exist");
});
