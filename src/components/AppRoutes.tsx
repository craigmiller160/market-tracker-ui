import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';

export const AppRoutes = () => {
    return useRoutes(routes({
        isAuthorized: false,
        hasChecked: false
    }));
}
