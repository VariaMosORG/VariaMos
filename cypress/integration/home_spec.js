describe('Home Test', () => {
  it('Does not do much!', () => {
    cy.visit('http://localhost:8080');
    cy.get('span').contains('Docs').click();
    cy.url().should('include', '/docs');
  })
});