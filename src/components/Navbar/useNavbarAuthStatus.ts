import { useSelector } from 'react-redux';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../../store/auth/selectors';
import * as TE from 'fp-ts/es6/TaskEither';
import { login, logout } from '../../services/AuthService';

export type NavbarAuth = [
	boolean,
	boolean,
	string,
	TE.TaskEither<Error, unknown>
];

export const useNavbarAuthCheck = (): NavbarAuth => {
	const isAuthorized = useSelector(isAuthorizedSelector);
	const hasChecked = useSelector(hasCheckedSelector);
	const authBtnTxt = isAuthorized ? 'Logout' : 'Login';
	const authBtnAction = isAuthorized ? logout() : login();
	return [isAuthorized, hasChecked, authBtnTxt, authBtnAction];
};
