import { mobileNavbar } from './mobileNavbar';
import { desktopNavbar } from './desktopNavbar';

const getTitle = () => cy.get('.Brand .ant-menu-title-content');

export const navbarPage = {
	getTitle,
	mobile: mobileNavbar,
	desktop: desktopNavbar
};
