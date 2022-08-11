/// <reference types="cypress" />

const login = () => cy.login("cypress@user.com", "TestUser123!");

describe("Profile Page", () => {
  it("should allow to create a new listing (navbar button)", () => {
    login();
    cy.createTestListing("user");
  });

  it("able view own profile page", () => {
    //go to own profile page
    login();
    cy.visit("/listingspage");
    cy.get('[data-testid="profilePic"]').click();

    //verify own username
    cy.contains("cypress_user").should("be.visible");

    //show content in setting
    cy.get("#setting").click();
    cy.get(".dropdown-menu > :nth-child(1)")
      .contains("Edit profile")
      .should("be.visible");
    cy.get(".dropdown-menu > :nth-child(2)")
      .contains("View blocked users")
      .should("be.visible");
    cy.contains("Logout").should("be.visible");
  });

  it("should allow users to delete their listings", () => {
    login();
    cy.deleteTestListing("user");
  });
});

describe("Update profile", () => {
  it("Navigate to edit profile", () => {
    //listing page --> profile page --> setting --> "Edit profile"
    login();
    cy.visit("/listingspage");
    cy.get('[data-testid="profilePic"]').click();
    cy.get("#setting").click();
    cy.get(".dropdown-menu > :nth-child(1)").contains("Edit profile").click();

    //email should be visible
    cy.contains("cypress@user.com").should("be.visible");

    //switch should be "on"
    cy.get(":nth-child(1) > .switch > .switch-group > .switch-off").click();
    cy.get(":nth-child(1) > .switch > .switch-group")
      .contains("On")
      .should("be.visible");
    cy.get(":nth-child(2) > .switch > .switch-group > .switch-on")
      .contains("On")
      .should("be.visible");
    cy.get(":nth-child(3) > .switch > .switch-group > .switch-on")
      .contains("On")
      .should("be.visible");

    //show bio in own profile
    cy.get("#bio").clear();
    cy.get("#bio").type("hello world");
    cy.get(":nth-child(1) > .switch > .switch-group > .switch-on").click();

    //change gender input
    cy.get(".px-10 > .form-check-input").click();

    //update function
    cy.get(".ml-5").click();
  });
});
