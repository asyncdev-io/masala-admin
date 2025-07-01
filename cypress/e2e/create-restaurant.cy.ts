describe('', () => {
  beforeEach(() => {
    cy.viewport(1024, 720);
    cy.login('test@manager.com', '12345678');
  });

  it('should create a restaurant', () => {
    // Indicates success navigation to the dashboard
    cy.url().should('include', '/dashboard');
    // Go to create restaurant page
    cy.get('[data-cy=main-nav-agregar-restaurante]').click();
    // Create restaurant inputs
    // ---- Type name
    cy.get('[data-cy=name-input]').type('Test Restaurant Name');
    // ---- Type description
    cy.get('[data-cy=description-input]').type('Test Restaurant Description');
    // ---- Choose file
    cy.get('[data-cy=image-input]').selectFile('cypress/fixtures/restaurant-image.jpeg');
    // ---- Select category
    // Open dropdown menu
    cy.get('[data-cy="category-select-trigger"]').click();
    // Select category item
    cy.get('[data-cy^="category-select-item-"]').contains("Alemana actuializada").click();
    // ---- Type email
    cy.get('[data-cy=email-input]').type('restaurant@email.com');
    // ---- Select label
    // Open dropdown menu
    cy.get('[data-cy="select-label-trigger"]').click();
    // Select label item
    cy.get('[data-cy^="select-label-item-"]').contains("Tacos").click();

    // Submit form
    cy.get('[data-cy=create-restaurant-btn]').click();

    cy.wait(8*1000);
    // Indicates success if the toast has the link to continue to the stripe onboarding
    cy.get("[data-cy=complete-registration-btn]").click();
  })
});