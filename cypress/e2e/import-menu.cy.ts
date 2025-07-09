import { testUILoginCredentials } from "../support/commands";

describe('Menu', () => {

  beforeEach(() => {
    cy.viewport(1024, 720);
    // Use login UI command
    cy.testLogin(testUILoginCredentials.email, testUILoginCredentials.password);
  });

  it('should import menu', () => {
    // ---- Indicates success navigation to the dashboard
    cy.url().should('include', '/dashboard');
    // ---- Select a restaurant
    cy.testSelectRestaurant("Test Restaurant Name 2");
    // ---- Go to Menu page
    cy.get('[data-cy=main-nav-menú]').click();
    // ---- Click on button to open the modal to import menu
    cy.get('[data-cy=import-menu-btn]').click();
    // ---- Select a restaurant
    cy.get('[data-cy=modal-select-restaurant]').select("Test Restaurant Name");
    // ---- Click on button to import menu
    cy.get('[data-cy=modal-import-btn]').click();
    // ---- Indicates success test
    cy.wait(8*1000);
    cy.get('[data-cy=import-menu-success-text]').should('be.visible');
  });
});