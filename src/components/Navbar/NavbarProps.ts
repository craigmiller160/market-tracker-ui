import { MenuInfo } from 'rc-menu/lib/interface';
import * as TE from 'fp-ts/es6/TaskEither';

export interface NavbarProps {
	selectedPageKey: string;
	selectedTimeKey: string;
	handleMenuClick: (mi: MenuInfo) => void;
	isAuthorized: boolean;
	hasChecked: boolean;
	authBtnTxt: string;
	authBtnAction: TE.TaskEither<Error, unknown>;
}
