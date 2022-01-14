import { useSelector } from 'react-redux';
import { isAuthorizedSelector } from '../../store/auth/selectors';
import * as TE from 'fp-ts/es6/TaskEither';
import { login, logout } from '../../services/AuthService';

export type NavbarAuth = [boolean, string, () => TE.TaskEither<Error, unknown>];

export const useNavbarAuthCheck = (): NavbarAuth => {
	const isAuthorized = useSelector(isAuthorizedSelector);
	const authBtnTxt = isAuthorized ? 'Logout' : 'Login';
	const authBtnAction = isAuthorized ? login : logout;
	return [isAuthorized, authBtnTxt, authBtnAction];
};
