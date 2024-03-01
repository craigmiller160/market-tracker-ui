import { screen, within } from '@testing-library/react';

const SELECTED_CLASS = 'ant-menu-item-selected';

export const getMenuItem = (text: string): HTMLElement => {
	const navbar = screen.getByTestId('navbar');
	return within(navbar).getByText(text);
};

export const menuItemIsSelected = (text: string) => {
	// eslint-disable-next-line testing-library/no-node-access
	expect(getMenuItem(text).closest('li')?.className).toEqual(
		expect.stringContaining(SELECTED_CLASS)
	);
};

export const menuItemIsNotSelected = (text: string) => {
	// eslint-disable-next-line testing-library/no-node-access
	expect(getMenuItem(text).closest('li')?.className).not.toEqual(
		expect.stringContaining(SELECTED_CLASS)
	);
};
