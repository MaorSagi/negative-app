import {} from "../../src/consts/data-hooks";
const user = "admin";
context("Login & Logout", () => {
  beforeEach(() => {
    cy.startSystem();
  });

  it("login & logout to system successfully", () => {
    cy.login(user, user);
    cy.logout();
  });
});