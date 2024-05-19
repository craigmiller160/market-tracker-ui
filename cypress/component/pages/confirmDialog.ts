const getTitle = () => cy.get('.ant-modal-header > div');
const getBody = () => cy.get('.ant-modal-body > h5');
const getCancelButton = () => cy.get('.ant-modal-footer button:nth-child(1)');
const getOkButton = () => cy.get('.ant-modal-footer button:nth-child(2)');

export const confirmDialog = {
    getTitle,
    getBody,
    getCancelButton,
    getOkButton
};
