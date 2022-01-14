import { useSelector } from 'react-redux';
import { isAuthorizedSelector } from '../../store/auth/selectors';

export type NavbarAuth = [boolean, string, () => void];

export const useNavbarAuthCheck = (): NavbarAuth => {
	const isAuthorized = useSelector(isAuthorizedSelector);
	const authBtnTxt = isAuthorized ? 'Logout' : 'Login';
	return [isAuthorized, authBtnTxt, () => {}];
};
