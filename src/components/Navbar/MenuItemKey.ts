// TODO delete or refactor all of this
export type MenuItemKey = 'auth' | 'portfolios' | 'watchlists' | '';

export const isMenuItemKey = (value: string): boolean =>
	['auth', 'portfolios', 'watchlists', ''].includes(value);
