// frontend/cypress/e2e/map_integration.cy.ts
describe('US Map Integration', () => {
  it('renders the SVG map and updates colors on random scenario', () => {
    cy.visit('http://localhost:5173');

    cy.get('svg').should('exist');
    cy.get('svg').find('#CA').should('exist');

    // Click Random Scenario and then expect colors
    cy.contains('Random Scenario').click();

    cy.get('svg').find('#CA').should('have.attr', 'fill');
    cy.get('svg').find('#TX').should('have.attr', 'fill');
  });
});

// frontend/cypress/e2e/map_integration.cy.ts
// frontend/cypress/e2e/map_integration.cy.ts
describe('US Map Integration', () => {
 it('renders the SVG map and updates colors on random scenario', () => {
    cy.visit('/'); // baseUrl is http://localhost:5173

    cy.get('svg').should('exist');
    cy.get('svg').find('#CA').should('exist');

    cy.contains('Random Scenario').click();

    cy.get('svg').find('#CA').should('have.attr', 'fill');
    cy.get('svg').find('#TX').should('have.attr', 'fill');
  });

  it('shows a user-friendly error when uploading an invalid CSV', () => {
    cy.visit('/');

    // Watch the API call
    cy.intercept('POST', '/api/csv/upload').as('uploadCsv');

    // Upload an invalid CSV (bad header + invalid number)
    cy.get('input[type="file"]').selectFile(
      {
        contents: 'foo,bar\nCA,not-a-number\n',
        fileName: 'invalid.csv',
        mimeType: 'text/csv',
        lastModified: Date.now(),
      },
      { force: true },
    );

    // Ensure backend saw it and rejected with 400
    cy.wait('@uploadCsv')
      .its('response.statusCode')
      .should('eq', 400);

    // Now the frontend should show the sanitized error message
    cy.get('.csv-error')
      .should('be.visible')
      .and('contain', 'CSV'); // loose match so you can tweak wording
  });
});