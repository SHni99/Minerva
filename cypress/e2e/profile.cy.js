/// <reference types="cypress" />

const login = () => cy.login("cypress@user.com", "TestUser123!");

describe("Profile Page", () => {
  it("able view own profile page", () => {
    //go to own profile page
    login();
    cy.visit("listingspage");
    cy.get('[data-testid="profilePic"]').click();
    cy.visit("profile");

    //verify own username
    cy.contains("cypress_user").should("be.visible");

    //verify own listing modal (edit/delete)
    cy.get('.listingCard_card__WTbkH').click();
    cy.contains("cypress_user").should("be.visible");
    cy.get('.btn-outline-secondary').contains("Edit").should("be.visible");
    cy.get('.btn-danger').contains("Delete").should("be.visible");
    cy.get('.btn-close').click();

    //go to reviews
    cy.get('#noanim-tab-example-tab-reviews').click();
    
    //go to listings
    cy.get('#noanim-tab-example-tab-listings').click();

    //show content in setting
    cy.get('#setting').click();
    cy.get('.dropdown-menu > :nth-child(1)').contains("Edit profile").should("be.visible");
    cy.get('.dropdown-menu > :nth-child(2)').contains("View blocked users").should("be.visible");
    cy.contains("Logout").should("be.visible");

  }); 
})

describe("Update profile", () => {
  it("Navigate to edit profile", () => {
    //listing page --> profile page --> setting --> "Edit profile"
    login();
    cy.visit("listingspage");
    cy.get('[data-testid="profilePic"]').click();
    cy.visit("profile");
    cy.get("#setting").click();
    cy.get(".dropdown-menu > :nth-child(1)").contains("Edit profile").click();
    cy.visit("loginmainpage#");

    //email should be visible
    cy.contains("cypress@user.com").should("be.visible");

    //switch should be "on"
    cy.get(':nth-child(1) > .switch > .switch-group > .switch-off').click();
    cy.get(':nth-child(1) > .switch > .switch-group').contains("On").should("be.visible");
    cy.get(':nth-child(2) > .switch > .switch-group > .switch-on').contains("On").should("be.visible");
    cy.get(':nth-child(3) > .switch > .switch-group > .switch-on').contains("On").should("be.visible");

    //show bio in own profile
    cy.get('#bio').clear();
    cy.get('#bio').type("hello world");
    cy.get(':nth-child(1) > .switch > .switch-group > .switch-on').click();

    //change gender input
    cy.get('.px-10 > .form-check-input').click();

    //update function
    cy.get('.ml-5').click();

    //go back profile page
    cy.get('[data-testid="profilePic"]').click();
    cy.visit("profile");
    cy.contains("hello world").should("be.visible");
    cy.contains("Male").should("be.visible");
    cy.contains("cypress@user.com").should("not.exist");
  });
});
