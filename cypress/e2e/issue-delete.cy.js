describe('Issue deleteing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      // open first available issue
      cy.get('[data-testid="board-list:backlog"]').children().eq(0).click();
      cy.get('[data-testid="modal:issue-details"]', { timeout: 10000 }).should('be.visible');
    });
  });
  // Test 1: Deleting issue.
  it('Should delete an issue and validate it successfully', () => {
    //Assert trashpin icon is visible and delete issue
    cy.get('[data-testid="icon:trash"]').should('be.visible').click()
    cy.get('div.sc-bxivhb').contains('Delete issue').click();
    //Assert, that deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist')
    //Assert, that issue is deleted and not displayed on the Jira board anymore
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
    cy.get('[data-testid="list-issue"]')
    .first ('not.contain', 'Task')

  });

})
//Test 2: Canesel deleting issue
it('Starting the deleting issue process, but cancelling this action', () => {
  //Assert trashpin icon is visible
  cy.get('[data-testid="icon:trash"]').should('be.visible').click()
  //Cancel the deletion in the confirmation pop-up
  cy.contains('Are you sure you want to delete this issue?').should('be.visible')
  cy.get('button').contains('Cancel').click()
  //Assert, that deletion confirmation dialogue is not visible
  cy.get('[data-testid="modal:confirm"]').should('not.exist')
  cy.get('[data-testid="modal:issue-details"]').should('be.visible')
  //Close issue detail view
  cy.get('[data-testid="icon:close"]').should('be.visible').first().click();
  //Assert, that issue is not deleted and still displayed on the Jira board
  cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
  cy.get('[data-testid="list-issue"]')
  .should('have.length', '4')
  .first()
  .find('p')
  .contains('Task')


    });

  });


});