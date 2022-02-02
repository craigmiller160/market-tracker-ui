import { screen, within } from '@testing-library/react';

const SELECTED_CLASS = 'ant-menu-item-selected';

const getMenuItem = (text: string) => {
	const menuItems = screen.getAllByText(text)
		.filter((elem) => elem.className.includes('ant-menu-title-content'));
	expect(menuItems).toHaveLength(1);
	return menuItems[0];
}

export const menuItemIsSelected = (text: string) => {
	expect(getMenuItem(text).closest('li')?.className).toEqual(
		expect.stringContaining(SELECTED_CLASS)
	);
};

export const menuItemIsNotSelected = (text: string) => {
	expect(getMenuItem(text).closest('li')?.className).not.toEqual(
		expect.stringContaining(SELECTED_CLASS)
	);
};
