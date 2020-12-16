/**
 * @author Daniel Correa <dcorreab@eafit.edu.co>
 */
describe('Circle model tests', () => {
  it('Circle model test', () => {
    // go to projects section
    cy.visit('http://localhost:8080');
    cy.get('span').contains('Config').click();
    cy.wait(100);
    cy.get('button').contains('Discover installed models').click();
    cy.wait(500);
    cy.get('button[class="close"]').should('be.visible').click();
    
    cy.get('span').contains('Projects').click();

    // create a new project
    const input = cy.get('input[placeholder="Enter projectName"]');
    input.type('Stores');

    const inputCheckBox = cy.get('input[value="circle"]');
    inputCheckBox.click();

    cy.get('button').contains("Create Project").click();
    cy.get('div[class="modal-body"]').should('contain', 'Project created successfully');
    cy.wait(500);
    cy.get('button[class="close"]').should('be.visible').click();

    // go to the project circle model section
    cy.get('a').contains("CircleModel").click();
    
    // create circle element
    cy.get('img[class="mxToolbarModeSelected"]:first').trigger('pointerdown', { which: 1 });
    cy.get('div[id="vgraph-container"]').find('svg').trigger('pointermove');
    cy.get('div[id="vgraph-container"]').find('svg').trigger('pointerup', { force: true });

    //should contain root text inside svg
    cy.get('div[id="vgraph-container"]').find('svg').should('contain', 'circle');
  });
});