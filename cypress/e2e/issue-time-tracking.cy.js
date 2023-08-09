describe('Issue Time Tracking', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
     
    });
  });
// TC1 Add estimation
it('Should create an issue and validate it successfully', () => {
const title = 'TEST_BUG'
const description = 'My bug description'
const originalEstimateHours = '10'
const editedEstimateHours = '20'
//Creating new issue 
cy.get('[data-testid="modal:issue-create"]').within(() => {
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]').trigger('click');
  cy.get('.ql-editor').type(description);
  cy.get('input[name="title"]').type(title);
  cy.get('[data-testid="select:userIds"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]').click();
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Highest"]').click();
  cy.get('button[type="submit"]').click();
  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
});
  //User opened issue detail view
  cy.wait(10000)
  cy.reload()
  
  // TC1 Add estimation
  cy.get('[data-testid="list-issue"]').contains(title).click()
  //Check that time tracker has no spent time added (“No Time Logged” label is visible)
  cy.get('[data-testid="modal:issue-details"]').should("contain", "No time logged");
  //Add value 10 to “Original estimate (hours)” field
  cy.get('[placeholder="Number"]').eq(0).click().type(originalEstimateHours)
  cy.contains('10h estimated').should('be.visible');
  //Closes issue detail page
  cy.get('[data-testid="icon:close"]').eq(0).click()
  //Reopen the same issue to check that original estimation is saved
  cy.get('[data-testid="list-issue"]').contains(title).click()
  cy.contains('10h estimated').should('be.visible');
   //Closes issue detail page
  cy.get('[data-testid="icon:close"]').eq(0).click()

  // TC2 Updat estimation
  //Reopen the same issue to check that original estimation is saved
  cy.get('[data-testid="list-issue"]').contains(title).click()
  cy.contains('10h estimated').should('be.visible');
  //Changes value in the field “Original estimate (hours)” from previous value to 20
  cy.get('[placeholder="Number"]').eq(0).click().clear()
  cy.get('[placeholder="Number"]').eq(0).click().type(editedEstimateHours)
  //Check that changed estimation is saved
  cy.contains('20h estimated').should('be.visible');
  //Close issue detail page
  cy.get('[data-testid="icon:close"]').eq(0).click()
  //Reopen the same issue to check that original estimation is saved
  cy.get('[data-testid="list-issue"]').contains(title).click()
  cy.contains('20h estimated').should('be.visible');
   //Close issue detail page
  cy.get('[data-testid="icon:close"]').eq(0).click()

  // TC3 Remove estimation
  //User reopens the same issue to check that original estimation is saved
  cy.wait(10000)
  //Reopen the same issue to check that original estimation is saved
  cy.get('[data-testid="list-issue"]').contains(title).click()
  cy.contains('20h estimated').should('be.visible');
  //Remove value from the field “Original estimate (hours)”
  cy.get('[placeholder="Number"]').eq(0).click().clear()
  cy.get('[placeholder="Number"]').eq(0).should('have.attr', 'placeholder', 'Number');
  //Close issue detail page
  cy.get('[data-testid="icon:close"]').eq(0).click()
  //Reopen the same issue to check that original estimation is removed
  cy.get('[data-testid="list-issue"]').contains(title).click()
  cy.get('[placeholder="Number"]').eq(0).should('have.attr', 'placeholder', 'Number');
  

  // TC4 Log time
  //User clicks on time tracking section
  cy.get('[data-testid="icon:stopwatch"]').click()
  //Check that time tracking pop-up dialogue is opened
  cy.get('[data-testid="modal:tracking"]').should('be.visible')
  //Enter value 2 to the field 
  cy.get('[placeholder="Number"]').eq(1).click().type('2')
  //Enter value 5 to the field “Time remaining”
  cy.get('[placeholder="Number"]').eq(2).click().type('5')
  //Click button “Done”
  cy.get('[data-testid="modal:tracking"]').contains('Done').click()
  //Check that 2h “Time spent” and 5h “Time remaining” are visible
  cy.get('[data-testid="modal:issue-details"]').should('contain', '2h logged') .should('contain', '5h remaining')
  //Check that “No Time Logged” label is not visible
  cy.get('[data-testid="modal:issue-details"]').contains('No time logged').should('not.exist')

  // TC5 Remove logged time
  //Click on time tracking section
  cy.get('[data-testid="icon:stopwatch"]').click()
  //Check that time tracking pop-up dialogue is opened
  cy.get('[data-testid="modal:tracking"]').should('be.visible')
  //Remove value from the field “Time spent”
  cy.get('[placeholder="Number"]').eq(1).click().clear()
  //Remove value from the field “Time remaining”
  cy.get('[placeholder="Number"]').eq(2).click().clear()
  //User click button “Done”
  cy.get('[data-testid="modal:tracking"]').contains('Done').click()

//Close issue
  cy.get('[data-testid="icon:close"]').eq(0).click()

});
});

