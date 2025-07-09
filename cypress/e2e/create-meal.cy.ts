import { testRestaurantName, testUILoginCredentials } from "../support/commands";

describe('Category Meal', () => {

  beforeEach(() => {
    cy.viewport(1024, 720);
    // Use login UI command
    cy.testLogin(testUILoginCredentials.email, testUILoginCredentials.password);
  });

  it('should create a category', () => {
    // Indicates success navigation to the dashboard
    cy.url().should('include', '/dashboard');

    // ---- Select a restaurant
    cy.testSelectRestaurant(testRestaurantName);

    // ---- Go to "Agregar platillo" page
    cy.get("[data-cy=main-nav-agregar-platillo]").click();

    // ---- Create category inputs
    // Type name
    cy.get("[data-cy=category-name-input]").type('Test Category');

    // Submit form
    cy.get("[data-cy=category-create-btn]").click();

    //---- Check if the category was created
    cy.wait(8 * 1000);
    cy.get("[data-cy=category-success-text]").should('be.visible');
  });

  it('should create a meal', () => {
    // ---- Indicates success navigation to the dashboard
    cy.url().should('include', '/dashboard');

    // ---- Select a restaurant
    cy.testSelectRestaurant(testRestaurantName);

    // ---- Go to "Agregar platillo" page
    cy.get("[data-cy=main-nav-agregar-platillo]").click();

    // ---- Create meal inputs
    // Type name
    cy.get("[data-cy=meal-name-input]").type('Test Meal');
    // Select category
    // Open dropdown menu
    cy.get("[data-cy=meal-select-category]").click();
    // Select category item
    cy.get("[data-cy^=meal-select-category-option-").first().click();
    // Type price
    cy.get("[data-cy=meal-price-input]").type('10');
    // Choose file
    cy.get("[data-cy=meal-image-input]").selectFile('cypress/fixtures/meal-image.jpg');
    // Type description
    cy.get("[data-cy=meal-description-input]").type('Test Meal Description');

    // ---- Submit form
    cy.get("[data-cy=meal-create-btn]").click();

    // ---- Check if the meal was created
    cy.wait(8 * 1000);
    cy.get("[data-cy=meal-success-text]").should('be.visible');

  });
});