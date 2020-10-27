import faker from "faker";

Cypress.Cookies.defaults({
  preserve: "lireddit-id",
});

export const test = () => {
  describe("Test register, logout and login", () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    it("Register account", () => {
      cy.visit("http://localhost:3000");

      cy.contains("Login").click();
      cy.url().should("include", "/login");
      cy.contains("Register Instead").click();
      cy.url().should("include", "/register");

      cy.get("#username").click().type(username);
      cy.get("#email").click().type(email);
      cy.get("#password").click().type(password);
      cy.get("form").contains("Register").click();

      cy.url().should("not.include", "/register");
      cy.get("#navbar").should("contain.text", username.toLowerCase());
    });

    it("Logout", () => {
      cy.contains("Logout").click();
      cy.get("#navbar").should("contain.text", "Login");
    });

    it("Log into account", () => {
      cy.contains("Login").click();
      cy.url().should("include", "/login");

      cy.get("#usernameOrEmail").click().type(username);
      cy.get("#password").click().type(password);
      cy.get("form").contains("Login").click();

      cy.url().should("not.include", "/login");
      cy.get("#navbar").should("contain.text", username.toLowerCase());
    });

    it("Logout and login with email", () => {
      cy.contains("Logout").click();
      cy.get("#navbar").should("contain.text", "Login");

      cy.contains("Login").click();
      cy.url().should("include", "/login");

      cy.get("#usernameOrEmail").click().type(email);
      cy.get("#password").click().type(password);
      cy.get("form").contains("Login").click();

      cy.url().should("not.include", "/login");
      cy.get("#navbar").should("contain.text", username.toLowerCase());
    });

    it("check for refresh persistence", () => {
      cy.reload();
      cy.get("#navbar").should("contain.text", username.toLowerCase());
    });

    it("Logout", () => {
      cy.contains("Logout").click();
      cy.get("#navbar").should("contain.text", "Login");
    });
  });
};

test();
