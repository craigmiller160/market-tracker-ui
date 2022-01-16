import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';

export const AppRoutes = () => {
    const theRoute = useRoutes(routes({
        isAuthorized: false
    }));
    return theRoute;
}
