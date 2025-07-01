/// <reference types="cypress" />

import { Role } from "@/types/roles";
import { jwtDecode } from "jwt-decode";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request('POST', '/auth/login-admin', { email, password })
    .then((response) => {
      expect(response.status).to.eq(200);
      const token = response.body.token;
      const payload: { email: string, names: string, role: Role } = jwtDecode(token);
      cy.setCookie("masala-admin-token", token);
      cy.setCookie("masala-admin-email", payload.email);
      cy.setCookie("masala-admin-name", payload.names);
      cy.setCookie("masala-admin-role", payload.role);
      cy.setCookie('masala-admin-token', token);
    });
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-btn]').click();
})

declare global {
  namespace Cypress {
    interface Chainable {
      apiLogin(email: string, password: string): Chainable<any>;
      login(email: string, password: string): Chainable<any>;
    }
  }
}

export { };