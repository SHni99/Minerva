/// <reference types="cypress" />
const login = () => cy.loginfailed("cypress@user.com", "TestUser123!1");
const login2 = () => cy.login("cypress@user.com", "TestUser123!");

describe("Login Page", () => {
    it("Initialization of login page with empty field and entering wrong password", ()=>{
        cy.visit("/loginpage");
        cy.get('#Home').click();
        cy.visit("/");

        cy.visit("/loginpage");
        cy.get('#forgot').click();
        cy.visit("/resetpage");

        cy.visit("/loginpage");
        cy.get('#here').click();
        cy.visit("/registerpage");

        cy.visit("/loginpage");
        cy.get('.btn').click();
        cy.contains("Please enter a password more than 8 characters").should("be.visible");

        login();
        cy.on('window:alert',(t)=>{
            //assertions
            expect(t).to.contains("You have entered an invalid email or password");
        });
    });

    it("Login after entering correct password", ()=>{
        login2();
        cy.visit("listingspage")
    });
});