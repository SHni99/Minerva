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

describe("Listings Page", () => {
  it("should display the newly created listing", () => {
    login();
    cy.visit("/listingspage");

    const getListing = () =>
      cy.get("[role='figure']").contains("cypress-user here").parent().parent();

    // Ensure listing card displays the correct details
    cy.get("[role='figure']")
      .contains("cypress-user here")
      .should("be.visible");
    getListing().contains("20").should("be.visible");
    getListing().contains("Secondary").should("be.visible");
    getListing().contains("Math").should("be.visible");

    // Click on created card with "cypress-user here"
    getListing().click();
    cy.get(".modal-header").contains("cypress_user").should("be.visible");
    cy.get(".modal-body").contains("Math").should("be.visible");
    cy.get(".modal-body").contains("cypress-user here").should("be.visible");
  });

  it("should allow users to edit thier listings", () => {
    login();
    cy.visit("/listingspage");
    const getTagField = (index) => cy.get("[name='selection-field']").eq(index);

    // Click on created card with "cypress-user here"
    cy.get("[role='figure']")
      .contains("cypress-user here")
      .parent()
      .parent()
      .click();

    // Click on the Edit button
    cy.get(".btn").contains("Edit").should("be.visible");
    cy.get(".btn").contains("Edit").click();

    // Users should be notified that they are editing a listing
    cy.contains("You are editing a listing").should("be.visible");

    // Ensure old fields are loaded correctly
    cy.contains("tutee").should("be.visible");
    cy.get("option").contains("Secondary").should("be.selected");
    cy.get("#rates").should("have.value", "20");
    getTagField(0).find("option").contains("Subject").should("be.selected");
    getTagField(0).find("input").should("have.value", "Math");
    getTagField(1).find("option").contains("Others").should("be.selected");
    getTagField(1).find("input").should("have.value", "cypress-user here");

    // Edit fields
    cy.contains("tutee").click();
    cy.get("#level").select("Tertiary");
    cy.get("#rates").clear().type("70");
    getTagField(0).find("select").select("Qualifications");
    getTagField(0).find("input").clear().type("Undergraduate");
    cy.get("#selection-fields > svg").click();
    getTagField(2).find("select").select("Subject");
    getTagField(2).find("input").type("Chemistry");

    // Submit changes
    cy.get("button[type='submit']").click();
    cy.contains("Updating your listing...").should("be.visible");
    cy.url().should("contain", "listingspage");
  });

  it("should display newly updated listing", () => {
    login();
    cy.visit("/listingspage");
    cy.contains("tutor").click();

    const getListing = () =>
      cy.get("[role='figure']").contains("cypress-user here").parent().parent();

    // Ensure listing card displays the correct details
    cy.get("[role='figure']")
      .contains("cypress-user here")
      .should("be.visible");
    getListing().contains("70").should("be.visible");
    getListing().contains("Tertiary").should("be.visible");
    getListing().contains("Undergraduate").should("be.visible");
    getListing().contains("Chemistry").should("be.visible");

    // Click on created card with "cypress-user here"
    getListing().click();
    cy.get(".modal-header").contains("cypress_user").should("be.visible");
    cy.get(".modal-body").contains("cypress-user here").should("be.visible");
    cy.get(".modal-body").contains("Undergraduate").should("be.visible");
    cy.get(".modal-body").contains("Chemistry").should("be.visible");
  });

  it("should allow users to delete thier own listings", () => {
    login();
    cy.visit("/listingspage");
    cy.contains("tutor").click();

    const getListing = () =>
      cy.get("[role='figure']").contains("cypress-user here").parent().parent();

    // Click on created card with "cypress-user here"
    getListing().should("be.visible");
    getListing().click();

    // Click on the Delete button
    cy.get(".btn").contains("Delete").should("be.visible");
    cy.get(".btn").contains("Delete").click();

    // Assert presence of confirmation message
    cy.contains("Are you sure?").should("be.visible");
    cy.get("button").contains("Yes").click();
    cy.get(".spinner-border").should("not.exist");

    // Ensure listing is really deleted
    cy.visit("/listingspage");
    cy.get("[role='figure']").contains(`cypress-user here`).should("not.exist");
  });
});
