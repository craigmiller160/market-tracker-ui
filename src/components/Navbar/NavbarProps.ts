import { MenuItemKey } from './MenuItemKey';
import { MenuInfo } from 'rc-menu/lib/interface';
import * as TE from 'fp-ts/es6/TaskEither';

export interface NavbarProps {
	selected: MenuItemKey;
	handleMenuClick: (mi: MenuInfo) => void;
	isAuthorized: boolean;
	hasChecked: boolean;
	authBtnTxt: string;
	authBtnAction: TE.TaskEither<Error, unknown>;
}
