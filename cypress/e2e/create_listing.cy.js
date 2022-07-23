/// <reference types="cypress" />

// Shortened login method
const login = () => cy.login("cypress@user.com", "TestUser123!");

describe("Create Listing Page", () => {
  it("should be accessible when logged in", () => {
    login();
    cy.visit("/listingspage");
    cy.get("a.btn").contains("Create Listing").click();
    cy.url().should("contain", "create-listing");
  });

  it("should post a listing with user inputs captured", () => {
    login();
    cy.visit("/create-listing");

    // User wants to find a tutee
    cy.contains("tutor").click();
    cy.contains("tutee").should("be.visible");

    // User wants to teach at the secondary level
    cy.get("#level").select("Secondary");

    // User wants to teach for $20 per hour
    // cy.get("#rates").click();
    cy.get("#rates").type("20");

    // User wants to teach Math
    cy.get('[name="selection-field"]').should("have.length", 1);
    cy.get("[name='selection-field']").find("input").type("Math");

    // User wants to add more tags
    cy.get("#selection-fields > svg").click();
    cy.get("#selection-fields > svg").click();
    cy.get('[name="selection-field"]').should("have.length", 3);

    // User wants to delete the middle tag
    cy.get("#selection-fields > div:nth-child(2)").find("button").click();
    cy.get('[name="selection-field"]').should("have.length", 2);

    // User wants to add "Other" tag with value "cypress-user here"
    cy.get("[name='selection-field']").eq(1).find("select").select("Others");
    cy.get("[name='selection-field']")
      .eq(1)
      .find("input")
      .type("cypress-user here");

    // User submits listing
    cy.get("button[type='submit']").click();
    cy.contains("Submitting...").should("be.visible");

    // User should be redirected to listings page
    cy.url().should("contain", "listingspage");
  });
});
