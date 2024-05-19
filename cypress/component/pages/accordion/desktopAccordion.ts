import { type GetPanel } from './types';

export const createDesktopAccordion = (getPanel: GetPanel) => {
    const getPanelRenameButton: GetPanel = (panel) =>
        getPanel(panel).find(
            '.ant-collapse-header .ant-collapse-extra button:nth-child(1)'
        );
    const getPanelRemoveButton: GetPanel = (panel) =>
        getPanel(panel).find(
            '.ant-collapse-header .ant-collapse-extra button:nth-child(2)'
        );
    return {
        getPanelRenameButton,
        getPanelRemoveButton
    };
};
