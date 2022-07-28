/// <reference types="cypress" />

// Shortened login for cypress-user
const login = () => cy.login("cypress@user.com", "TestUser123!");

// Predetermined message for this test run
const msg = `hello-${Math.random()}`;

describe("Create Listings Page", () => {
  it("should allow a user to create a listing", () => {
    cy.login("cypress@admin.com", "TestUser123!");
    cy.visit("/create-listing");

    // User wants to find a tutee
    cy.contains("tutor").click();
    cy.contains("tutee").should("be.visible");

    // User wants to teach for $20 per hour
    cy.get("#rates").type("20");

    // User wants to add "Other" tag with value "cypress-admin here"
    cy.get("[name='selection-field']").find("select").select("Others");
    cy.get("[name='selection-field']").find("input").type("cypress-admin here");

    // User submits listing
    cy.get("button[type='submit']").click();
    cy.contains("Submitting...").should("be.visible");

    // User should be redirected to listings page
    cy.url().should("contain", "listingspage");
  });
});

describe("Listings Page", () => {
  it("should allow a user to chat with the creator of a listing", () => {
    login();
    cy.visit("/listingspage");

    // Click on created card with "cypress-user here"
    cy.get("[role='figure']")
      .contains("cypress-admin here")
      .parent()
      .parent()
      .click();

    // Click on the Chat button
    cy.get(".btn").contains("Chat").should("be.visible");
    cy.get(".btn").contains("Chat").click();

    // Ensure chat is open
    cy.url().should("contain", "chats");

    // Check that chat is active with listing creator
    cy.get(".cs-conversation--active")
      .contains("cypress-admin")
      .should("be.visible");
    cy.get(".cs-conversation-header__user-name").should(
      "have.text",
      "cypress-admin"
    );

    // Send a message
    cy.get(".cs-message-input__content-editor").type(`${msg}{enter}`);

    // Check if message appears
    cy.contains(msg).should("be.visible");
  });
});

describe("Chat Page", () => {
  it("should display the sent message", () => {
    cy.login("cypress@admin.com", "TestUser123!");
    cy.visit("/chats");

    // Click on conversation with cypress-user
    cy.contains("cypress_user").parent().parent().click();

    // Check if message appears
    cy.contains(msg).should("be.visible");
  });
});

describe("After successful deal", () => {
  it("cypress_admin should be able to delete his listing", () => {
    cy.login("cypress@admin.com", "TestUser123!");
    cy.visit("/listingspage");

    // Click on created card with "cypress-admin here"
    cy.get("[role='figure']")
      .contains("cypress-admin here")
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
      .contains("cypress-admin here")
      .parent()
      .parent()
      .should("not.exist");
  });
});
