/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
describe('Docs Tests', () => {
  it('Docs URL test', () => {
    cy.visit('http://localhost:8080');
    cy.get('span').contains('Docs').click();
    cy.url().should('include', '/docs');
    cy.get('p').should('contain', 'VariaMos wiki');
  });
});