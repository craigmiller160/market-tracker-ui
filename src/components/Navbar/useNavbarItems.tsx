import { ReactNode } from 'react';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';

enum NavbarItemType {
	PAGE,
	NON_PROD_PAGE,
	TIME
}

interface NavbarItem {
	readonly key: string;
	readonly name: string;
	readonly type: NavbarItemType;
	readonly onClick?: () => void;
	readonly className?: string;
}

export const useNavbarItems = (): ReactNode => {
	const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
		useNavbarAuthCheck();
	return <div />;
};
