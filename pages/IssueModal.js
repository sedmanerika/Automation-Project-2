class IssueModal {
    constructor() {
        this.submitButton = 'button[type="submit"]';
        this.issueModal = '[data-testid="modal:issue-create"]';
        this.issueDetailModal = '[data-testid="modal:issue-details"]';
        this.title = 'input[name="title"]';
        this.issueType = '[data-testid="select:type"]';
        this.descriptionField = '.ql-editor';
        this.assignee = '[data-testid="select:userIds"]';
        this.backlogList = '[data-testid="board-list:backlog"]';
        this.issuesList = '[data-testid="list-issue"]';
        this.deleteButton = '[data-testid="icon:trash"]';
        this.deleteButtonName = "Delete issue";
        this.cancelDeletionButtonName = "Cancel";
        this.confirmationPopup = '[data-testid="modal:confirm"]';
        this.closeDetailModalButton = '[data-testid="icon:close"]';
        this.timeField = 'input[placeholder="Number"]';
        this.timeTrackingModalOpen = '[data-testid="icon:stopwatch"]';
        this.timeTrackingModal = '[data-testid="modal:tracking"]';
        this.doneButtonName = "Done";
        this.estimationWindow = "Original Estimate (hours)";
    }

    getIssueModal() {
        return cy.get(this.issueModal);
    }

    getIssueDetailModal() {
        return cy.get(this.issueDetailModal);
    }

    openFirstIssueDetailModal() {
        cy.get(this.backlogList).children().eq(0).click();
    }

    ensureTimeTrackingModalIsVisible() {
        cy.get(this.timeTrackingModal).should('be.visible');
    }

    openTameTrackingModal() {
        cy.get(this.timeTrackingModalOpen).click();
    }

    selectIssueType(issueType) {
        cy.get(this.issueType).click('bottomRight');
        cy.get(`[data-testid="select-option:${issueType}"]`)
            .trigger('mouseover')
            .trigger('click');
    }

    selectAssignee(assigneeName) {
        cy.get(this.assignee).click('bottomRight');
        cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
    }

    editTitle(title) {
        cy.get(this.title).debounced('type', title);
    }

    clearEstimation() {
        cy.get(this.timeField).eq(0).clear();
        cy.wait(1000)
    }

    ensureEstimationClear() {
        cy.contains('Original Estimate (hours)').next().within(() => {
            cy.get('[placeholder="Number"]').should('be.visible');
        });
    }

    enterOriginalEstimateHours(hours) {
        cy.contains(this.estimationWindow).next().find('input').clear().debounced('type', hours);
        cy.wait(1000)
    }

    ensureEstimationIsVisible(estimationValue) {
        cy.contains(this.estimationWindow)
            .next()
            .within(() => {
                cy.get('input').should('be.visible').and('have.value', estimationValue);
            });
    }

    enterTimeSpentHours(hours) {
        cy.get(this.timeField).eq(1).debounced('type', hours);
        cy.wait(1000)
    }

    enterTimeLeftHours(hours) {
        cy.get(this.timeField).eq(2).debounced('type', hours);
        cy.wait(1000)
    }

    clearTimeSpent() {
        cy.get(this.timeField).eq(1).clear();
        cy.wait(1000)
    }

    clearTimeLeft() {
        cy.get(this.timeField).eq(2).clear();
        cy.wait(1000)
    }

    confirmTimeLogging() {
        cy.get(this.timeTrackingModal).within(() => {
            cy.contains(this.doneButtonName).click();
            cy.wait(1000)
        });
        cy.get(this.timeTrackingModal).should('not.exist');
        cy.wait(1000)
    }

    ensureNoTimeLogged() {
        cy.contains('No time logged').should('be.visible');
    }

    ensureNoTimeLoggedNotVisible() {
        cy.contains('No time logged').should('not.exist');
    }

    ensureTimeRemainingVisible(timeRemaining) {
        //cy.contains(timeRemaining + "h" + " " + "estimated").next().within(() => {
        cy.contains(timeRemaining + "h" + " " + "remaining").should('be.visible');
        //});
    }

    ensureSpentTimeVisible(spentTime) {
        //cy.contains(spentTime + "h" + " " + "logged").next().within(() => {
        cy.contains(spentTime + "h" + " " + "logged").should('be.visible');
        // });
    }

    editDescription(description) {
        cy.get(this.descriptionField).type(description);
    }

    createIssue(issueDetails) {
        this.getIssueModal().within(() => {
            this.selectIssueType(issueDetails.type);
            this.editDescription(issueDetails.description);
            this.editTitle(issueDetails.title);
            this.selectAssignee(issueDetails.assignee);
            cy.get(this.submitButton).click();
        });
    }

    ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
        cy.get(this.issueModal).should('not.exist');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues)
                .first()
                .find('p')
                .contains(issueDetails.title);
            cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should('be.visible');
        });
    }

    ensureIssueIsVisibleOnBoard(expectedAmountIssues, issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('be.visible');
        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues);
        });
    }

    ensureIssueIsNotVisibleOnBoard(expectedAmountIssues, issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('not.exist');
        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues);
        });
    }

    clickDeleteButton() {
        cy.get(this.deleteButton).click();
        cy.get(this.confirmationPopup).should('be.visible');
    }

    confirmDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.deleteButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
    }

    cancelDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.cancelDeletionButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.issueDetailModal).should('be.visible');
    }

    closeDetailModal() {
        cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
        cy.get(this.issueDetailModal).should('not.exist');
    }
}

export default new IssueModal();