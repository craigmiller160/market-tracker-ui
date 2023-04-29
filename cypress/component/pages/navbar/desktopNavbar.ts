const getItems = () => cy.get('.ant-menu-item');
const getInvestmentInfoItem = () => getItems().eq(1);
const getSearchItem = () => getItems().eq(2);
const getRecognitionItem = () => getItems().eq(3);
const getTodayItem = () => getItems().eq(4);
const getOneWeekItem = () => getItems().eq(5);
const getOneMonthItem = () => getItems().eq(6);
const getThreeMonthsItem = () => getItems().eq(7);
const getOneYearItem = () => getItems().eq(8);
const getFiveYearsItem = () => getItems().eq(9);

export const desktopNavbar = {
	getInvestmentInfoItem,
	getSearchItem,
	getRecognitionItem,
	getTodayItem,
	getOneWeekItem,
	getOneMonthItem,
	getThreeMonthsItem,
	getOneYearItem,
	getFiveYearsItem
};
