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

describe("Listings Page", () => {
  const getListing = () =>
    cy.get("[role='figure']").contains("cypress-user here").parent().parent();
  const getFilter = (filterName) =>
    cy.get(`[aria-label="${filterName}-filter"]`).parent().parent();

  it("should display the two test listings correctly", () => {
    login();
    cy.visit("/listingspage");

    // Ensure listing card displays the correct details
    cy.get("[role='figure']")
      .contains("cypress-user here")
      .should("be.visible");
    getListing().contains("20").should("be.visible");
    getListing().contains("Secondary").should("be.visible");
    getListing().contains("Math").should("be.visible");
    getListing().contains("Chemistry").should("be.visible");
    getListing().contains("Undergraduate").should("be.visible");
    getListing().contains("Weekdays 2pm-5pm").should("be.visible");

    // Toggle to find the second test listing
    cy.contains("tutor").click();

    // Ensure listing card displays the correct details
    cy.get("[role='figure']")
      .contains("cypress-user here")
      .should("be.visible");
    getListing().contains("50").should("be.visible");
    getListing().contains("Tertiary").should("be.visible");
    getListing().contains("Physics").should("be.visible");
    getListing().contains("Biology").should("be.visible");
    getListing().contains("MOE Teacher").should("be.visible");
    getListing().contains("Weekends 10am-2pm").should("be.visible");
  });

  it("should have a properly functioning search bar", () => {
    login();
    cy.visit("/listingspage");

    // Check that the search only returns 1 listing
    cy.get("#search-input").type("cypress-user here{enter}");
    cy.get("[role='figure']").should("have.length", 2);

    // Toggle to tutees
    cy.contains("tutor").click();

    // Check that the search only returns 1 listing
    cy.get("[role='figure']").should("have.length", 1);

    // Clear search
    cy.get("button[aria-label='Close']").click();

    // Check that the listings are no longer filtered
    cy.get("[role='figure']").should("have.length.greaterThan", 1);
    cy.contains("tutee").click();
    cy.get("[role='figure']").should("have.length.greaterThan", 1);
  });

  /*it("should be able to find test listing 1 with the provided filters", () => {
    login();
    cy.visit("/listingspage");

    // Filter by Level
    getFilter("level").click();
    getFilter("level").parent().contains("Secondary").click();
    getFilter("level").click();

    // Open More Filters
    cy.get("[aria-label='more-filters']").click();
    cy.get(".offcanvas").should("be.visible");

    // Filter by Rates
    cy.contains("Hourly Rates").siblings().eq(0).click();
    cy.get("input.form-control").eq(1).clear().type("30");

    // Close More Filters
    cy.get(".fade").click();

    // Check if test listing 1 is still present
    cy.get(".spinner").should("not.exist");
    getListing().should("exist");
  });*/

  it("should filter out test listing 1 with the filters given", () => {
    login();
    cy.visit("/listingspage");

    // Filter by Level
    getFilter("level").click();
    getFilter("level").parent().contains("Tertiary").click();
    getFilter("level").click();

    // Check that test listing 1 is filtered out
    cy.get(".spinner").should("not.exist");
    cy.get("[role='figure']").contains("cypress-user here").should("not.exist");
  });

  it("should be able to find test listing 2 with the provided filters", () => {
    login();
    cy.visit("/listingspage");
    cy.contains("tutor").click();
    cy.get(".spinner").should("not.exist");

    // Filter by Level
    getFilter("level").click();
    getFilter("level").parent().contains("Tertiary").click();
    getFilter("level").click();

    // Open More Filters
    cy.get("[aria-label='more-filters']").click();
    cy.get(".offcanvas").should("be.visible");

    // Filter by Rates
    cy.contains("Hourly Rates").siblings().eq(0).click();
    cy.get("input.form-control").eq(1).clear().type("70");

    // Close More Filters
    cy.get(".fade").click();

    // Check if test listing 2 is still present
    cy.get(".spinner").should("not.exist");
    getListing().should("exist");
  });

  it("should filter out test listing 2 with the filters given", () => {
    login();
    cy.visit("/listingspage");
    cy.contains("tutor").click();
    cy.get(".spinner").should("not.exist");

    // Filter by Level
    getFilter("level").click();
    getFilter("level").parent().contains("Secondary").click();
    getFilter("level").click();

    // Check that test listing 1 is filtered out
    cy.get(".spinner").should("not.exist");
    cy.get("[role='figure']").contains("cypress-user here").should("not.exist");
  });
});

describe("After searching", () => {
  it("test listings should be able to be deleted", () => {
    login();
    cy.visit("/listingspage");

    // Click on created card with "cypress-admin here"
    cy.get("[role='figure']")
      .contains("cypress-user here")
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
      .contains("cypress-user here")
      .parent()
      .parent()
      .should("not.exist");

    // Toggle to find test listing 2
    cy.contains("tutor").click();

    // Click on created card with "cypress-admin here"
    cy.get("[role='figure']")
      .contains("cypress-user here")
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
      .contains("cypress-user here")
      .parent()
      .parent()
      .should("not.exist");
  });
});
