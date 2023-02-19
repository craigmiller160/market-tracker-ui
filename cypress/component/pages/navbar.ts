import { mobileNavbar } from './navbar/mobileNavbar';

const getTitle = () => cy.get('.Brand .ant-menu-title-content');

export const navbarPage = {
	getTitle,
	mobile: mobileNavbar
};
