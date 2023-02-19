const getTitle = () => cy.get('.Brand .ant-menu-title-content');

const getMobileMenus = () =>
	cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content');
const getMobilePageMenu = () => getMobileMenus().eq(0);
const getMobileTimeMenu = () => getMobileMenus().eq(1);

const getMobileMenuItems = () =>
	cy.get('.ant-menu-sub .ant-menu-title-content');
const getMobileSearchItem = () => getMobileMenuItems().eq(1);
const getMobileWatchlistsItem = () => getMobileMenuItems().eq(0);
const getMobileRecognitionItem = () => getMobileMenuItems().eq(2);

const getMobileTodayItem = () => getMobileMenuItems().eq(0);
const getMobileOneWeekItem = () => getMobileMenuItems().eq(1);
const getMobileOneMonthItem = () => getMobileMenuItems().eq(2);
const getMobileThreeMonthsItem = () => getMobileMenuItems().eq(3);
const getMobileOneYearItem = () => getMobileMenuItems().eq(4);
const getMobileFiveYearsItem = () => getMobileMenuItems().eq(5);

export const navbarPage = {
	getTitle,
	getMobilePageMenu,
	getMobileTimeMenu,
	getMobileSearchItem,
	getMobileWatchlistsItem,
	getMobileRecognitionItem,
	getMobileTodayItem,
	getMobileOneWeekItem,
	getMobileOneMonthItem,
	getMobileThreeMonthsItem,
	getMobileOneYearItem,
	getMobileFiveYearsItem
};
