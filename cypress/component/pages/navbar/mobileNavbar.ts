const getMenus = () =>
	cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content');
const getPageMenu = () => getMenus().eq(0);
const getTimeMenu = () => getMenus().eq(1);

const getMenuItems = () => cy.get('.ant-menu-sub .ant-menu-title-content');
const getSearchItem = () => getMenuItems().eq(1);
const getInvestmentInfoItem = () => getMenuItems().eq(0);
const getRecognitionItem = () => getMenuItems().eq(2);

const getTodayItem = () => getMenuItems().eq(0);
const getOneWeekItem = () => getMenuItems().eq(1);
const getOneMonthItem = () => getMenuItems().eq(2);
const getThreeMonthsItem = () => getMenuItems().eq(3);
const getOneYearItem = () => getMenuItems().eq(4);
const getFiveYearsItem = () => getMenuItems().eq(5);

export const mobileNavbar = {
	getPageMenu,
	getTimeMenu,
	getSearchItem,
	getInvestmentInfoItem,
	getRecognitionItem,
	getTodayItem,
	getOneWeekItem,
	getOneMonthItem,
	getThreeMonthsItem,
	getOneYearItem,
	getFiveYearsItem
};
