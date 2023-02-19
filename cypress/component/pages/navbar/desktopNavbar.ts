const getItems = () => cy.get('.ant-menu-item');
const getWatchlistsItem = () => getItems().eq(0);
const getSearchItem = () => getItems().eq(1);
const getRecognitionItem = () => getItems().eq(2);
const getTodayItem = () => getItems().eq(3);
const getOneWeekItem = () => getItems().eq(4);
const getOneMonthItem = () => getItems().eq(5);
const getThreeMonthsItem = () => getItems().eq(6);
const getOneYearItem = () => getItems().eq(7);
const getFiveYearsItem = () => getItems().eq(8);

export const desktopNavbar = {
	getWatchlistsItem,
	getSearchItem,
	getRecognitionItem,
	getTodayItem,
	getOneWeekItem,
	getOneMonthItem,
	getThreeMonthsItem,
	getOneYearItem,
	getFiveYearsItem
};
