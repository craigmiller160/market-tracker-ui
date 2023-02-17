import { useSelector } from 'react-redux';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../../store/auth/selectors';

export type NavbarAuth = [boolean, boolean, string, () => void];

export const useNavbarAuthCheck = (): NavbarAuth => {
	// const dispatch = useDispatch();
	const isAuthorized = useSelector(isAuthorizedSelector);
	const hasChecked = useSelector(hasCheckedSelector);
	const authBtnTxt = isAuthorized ? 'Logout' : 'Login';
	// const authBtnAction = isAuthorized ? logout(dispatch) : login();
	const authBtnAction = () => null; // TODO fix this
	return [isAuthorized, hasChecked, authBtnTxt, authBtnAction];
};
