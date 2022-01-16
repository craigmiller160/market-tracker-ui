import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';
import { useSelector } from 'react-redux';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../store/auth/selectors';

export const AppRoutes = () => {
	const isAuthorized = useSelector(isAuthorizedSelector);
	const hasChecked = useSelector(hasCheckedSelector);
	return useRoutes(
		routes({
			isAuthorized,
			hasChecked
		})
	);
};
