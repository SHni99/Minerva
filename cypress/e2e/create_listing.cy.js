/// <reference types="cypress" />

describe("Login", () => {
  it("should work with cypress_user account", () => {
    cy.visit("/loginpage");
  });
});
