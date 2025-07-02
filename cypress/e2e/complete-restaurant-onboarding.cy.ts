import { testRestaurantName, testUILoginCredentials } from "../support/commands";

describe('Restaurant Onboarding', () => {
  beforeEach(() => {
    cy.viewport(1024, 720);
    cy.testLogin(testUILoginCredentials.email, testUILoginCredentials.password);
  });

  it('should navigate to the restaurant onboarding page', () => {
    // ---- Select a restaurant
    cy.testSelectRestaurant(testRestaurantName);
    // ---- Click on button to navigate to onboarding page
    cy.get("[data-cy=complete-onboarding-link]").click();
    // ---- Click on button to complete onboarding
    cy.wait(8*1000);
    cy.get("[data-cy=complete-onboarding-btn]").should("be.visible").click();
  });
});