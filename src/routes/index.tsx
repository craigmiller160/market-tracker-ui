import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Welcome } from '../components/Content/Welcome';

export interface RouteRules {
    isAuthorized: boolean;
    hasChecked: boolean;
}

export const routes = (rules: RouteRules): RouteObject[] =>
    [
        {
            path: '/',
            element: <Navigate to="/market-tracker" />
        },
        {
            path: '/market-tracker',
            children: [
                {
                    path: '',
                    element: <Navigate to="welcome" />
                },
                {
                    path: 'welcome',
                    element: <Welcome />
                }
            ]
        }
    ]
