export const test = () => {
  describe("Test register, logout and login", () => {
    it("Register account", () => {
      cy.visit("http://localhost:3000");

      cy.contains("Login").click();
      cy.url().should("include", "/login");
      cy.contains("Register Instead").click();
      cy.url().should("include", "/register");

      cy.get("#username").click().type("tushar");
      cy.get("#email").click().type("tushar@gmail.com");
      cy.get("#password").click().type("tushar");
      cy.get("form").contains("Register").click();

      cy.url().should("not.include", "/register");
      cy.get("body").should("contain.text", "Logged in");
    });

    it("Logout", () => {
      cy.contains("Logout").click();
      cy.get("body").should("contain.text", "Logged out");
    });

    it("Log into account", () => {
      cy.visit("http://localhost:3000");

      cy.contains("Login").click();
      cy.url().should("include", "/login");

      cy.get("#usernameOrEmail").click().type("tushar");
      cy.get("#password").click().type("tushar");
      cy.get("form").contains("Login").click();

      cy.url().should("not.include", "/login");
      cy.get("body").should("contain.text", "Logged in");
    });
  });
};

test();
