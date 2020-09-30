describe("Test login", () => {
  it("Open login page", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Login").click();

    cy.url().should("include", "/login");

    cy.get("input#usernameOrEmail").click().type("tushar");

    cy.get("input#password").click().type("tushar");

    cy.get("form").contains("Login").last().click();

    cy.url().should("not.include", "/login");

    cy.get("body").should("contain.text", "Logged in");
  });
});
