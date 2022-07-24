/// <reference types="cypress" />

// Shortened login for cypress-user
const login = () => cy.login("cypress@user.com", "TestUser123!");

describe("Create Listings Page", () => {
  it("should allow a user to create the first test listing", () => {
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
    cy.get("#selection-fields > svg").click();
    cy.get("#selection-fields > svg").click();
    cy.get('[name="selection-field"]').should("have.length", 5);

    // User wants to teach Chemistry
    cy.get("[name='selection-field']").eq(1).find("input").type("Chemistry");

    // User has qualifications as an undergraduate
    cy.get("[name='selection-field']")
      .eq(2)
      .find("select")
      .select("Qualifications");
    cy.get("[name='selection-field']")
      .eq(2)
      .find("input")
      .type("Undergraduate");

    // User prefers to teach on weekdays 2pm-5pm
    cy.get("[name='selection-field']")
      .eq(3)
      .find("select")
      .select("Preferred Times");
    cy.get("[name='selection-field']")
      .eq(3)
      .find("input")
      .type("Weekdays 2pm-5pm");

    // User wants to introduce himself as cypress-user
    cy.get("[name='selection-field']").eq(4).find("select").select("Others");
    cy.get("[name='selection-field']")
      .eq(4)
      .find("input")
      .type("cypress-user here");

    // User submits listing
    cy.get("button[type='submit']").click();
    cy.contains("Submitting...").should("be.visible");

    // User should be redirected to listings page
    cy.url().should("contain", "listingspage");
  });

  it("should allow a user to create the second test listing", () => {
    login();
    cy.visit("/create-listing");

    // User wants to find a tutor
    cy.contains("tutor").should("be.visible");

    // User wants to teach at the tertiary level
    cy.get("#level").select("tertiary");

    // User wants to offer $50 per hour
    cy.get("#rates").type("50");

    // User wants to learn Physics
    cy.get('[name="selection-field"]').should("have.length", 1);
    cy.get("[name='selection-field']").find("input").type("Physics");

    // User wants to add more tags
    cy.get("#selection-fields > svg").click();
    cy.get("#selection-fields > svg").click();
    cy.get("#selection-fields > svg").click();
    cy.get("#selection-fields > svg").click();
    cy.get('[name="selection-field"]').should("have.length", 5);

    // User wants to learn Biology
    cy.get("[name='selection-field']").eq(1).find("input").type("Biology");

    // User wants a tutor who is a certified MOE teacher
    cy.get("[name='selection-field']")
      .eq(2)
      .find("select")
      .select("Qualifications");
    cy.get("[name='selection-field']").eq(2).find("input").type("MOE Teacher");

    // User prefers to learn on weekends 10am-2pm
    cy.get("[name='selection-field']")
      .eq(3)
      .find("select")
      .select("Preferred Times");
    cy.get("[name='selection-field']")
      .eq(3)
      .find("input")
      .type("Weekends 10am-2pm");

    // User wants to introduce himself as cypress-user
    cy.get("[name='selection-field']").eq(4).find("select").select("Others");
    cy.get("[name='selection-field']")
      .eq(4)
      .find("input")
      .type("cypress-user here");

    // User submits listing
    cy.get("button[type='submit']").click();
    cy.contains("Submitting...").should("be.visible");

    // User should be redirected to listings page
    cy.url().should("contain", "listingspage");
  });
});

// describe("Listings Page", () => {
//     it("should display the two test listings correctly", () => {

//     });

// });
