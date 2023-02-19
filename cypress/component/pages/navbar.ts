import { mobileNavbar } from './navbar/mobileNavbar';
import { desktopNavbar } from './navbar/desktopNavbar';

const getTitle = () => cy.get('.Brand .ant-menu-title-content');

export const navbarPage = {
	getTitle,
	mobile: mobileNavbar,
	desktop: desktopNavbar
};
