describe('Issue comments creating, editing and deleting', () => {
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();  
        });
    });

it('Should create,edit and delete comment successfully', () => {
        const comment = 'TEST_COMMENT';
        const comment_edited = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
        
            //add comment
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);

            // Edit comment
            cy.get('[data-testid="issue-comment"]').first()
            .contains('Edit').click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]')
            .should('contain', comment).clear().type(comment_edited);

            cy.contains('button', 'Save').click().should('not.exist');
            cy.get('[data-testid="issue-comment"]')
            .should('contain', 'Edit')
            .and('contain', comment_edited);
            });

            // Delete comment
            cy.contains('Delete').click();
            cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment').click()
            .should('not.exist');

             getIssueDetailsModal().find('[data-testid="issue-comment"]')
             .contains(comment_edited)
             .should('not.exist');
    });
});
