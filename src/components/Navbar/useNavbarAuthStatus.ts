import { useSelector } from 'react-redux';
import {
    hasCheckedSelector,
    isAuthorizedSelector
} from '../../store/auth/selectors';
import { useContext } from 'react';
import { KeycloakAuthContext } from '@craigmiller160/react-keycloak';

export type NavbarAuth = [boolean, boolean, string, () => void];

export const useNavbarAuthCheck = (): NavbarAuth => {
    const { logout } = useContext(KeycloakAuthContext);
    // const dispatch = useDispatch();
    const isAuthorized = useSelector(isAuthorizedSelector);
    const hasChecked = useSelector(hasCheckedSelector);
    const authBtnTxt = isAuthorized ? 'Logout' : 'Login';
    return [isAuthorized, hasChecked, authBtnTxt, logout];
};
