const getTitle = () => cy.get('.Brand .ant-menu-title-content');

const getMobileMenus = () =>
	cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content');
const getMobilePageMenu = () => getMobileMenus().eq(0);
const getMobileTimeMenu = () => getMobileMenus().eq(1);

const getMobileMenuItems = () =>
	cy.get('.ant-menu-sub .ant-menu-title-content');
const getMobileMarketsItem = () => getMobileMenuItems().eq(0);
const getMobileSearchItem = () => getMobileMenuItems().eq(1);
const getMobileWatchlistsItem = () => getMobileMenuItems().eq(2);
const getMobileRecognitionItem = () => getMobileMenuItems().eq(3);

const getMobileTodayItem = () => getMobileMenuItems().eq(0);
const getMobileOneWeekItem = () => getMobileMenuItems().eq(1);
const getMobileOneMonthItem = () => getMobileMenuItems().eq(2);
const getMobileThreeMonthsItem = () => getMobileMenuItems().eq(3);
const getMobileOneYearItem = () => getMobileMenuItems().eq(4);
const getMobileFiveYearsItem = () => getMobileMenuItems().eq(5);

export {
	getTitle,
	getMobilePageMenu,
	getMobileTimeMenu,
	getMobileMarketsItem,
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
