import { MenuInfo } from 'rc-menu/lib/interface';
import * as TE from 'fp-ts/es6/TaskEither';
import { MenuItemPageKey } from './MenuItemKey';

export interface NavbarProps {
	selectedPageKey: MenuItemPageKey;
	handleMenuClick: (mi: MenuInfo) => void;
	isAuthorized: boolean;
	hasChecked: boolean;
	authBtnTxt: string;
	authBtnAction: TE.TaskEither<Error, unknown>;
}
