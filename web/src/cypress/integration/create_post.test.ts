import faker from "faker";

Cypress.Cookies.defaults({
  preserve: "lireddit-id",
});

export const test = () => {
  describe("Post tests", () => {
    it("Register and create post", () => {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      // Register
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

      // Create post
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph().trim();

      const form = cy.get("#newpost");
      form.get("#title").click().type(title);
      form.get("#content").click().type(content);
      form.get("button[type=submit]").click();

      cy.wait(500); //TODO: Replace with better way to detect if form submitted
      cy.reload();
      cy.get("body").should("contain.text", title);
      cy.get("body").should("contain.text", content);
    });
  });
};

test();
