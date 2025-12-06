"use strict";
describe('US Map Integration', () => {
    it('renders the SVG map and updates colors on random scenario', () => {
        cy.visit('http://localhost:5173');
        cy.get('svg').should('exist');
        cy.get('svg').find('#CA').should('have.attr', 'fill');
        cy.contains('Random Scenario').click();
        cy.get('svg').find('#TX').should('have.attr', 'fill');
    });
});
