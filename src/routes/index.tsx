import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';

export interface RouteRules {
    isAuthorized: boolean;
}

export const routes = (rules: RouteRules): RouteObject[] =>
    [
        {
            path: '/',
            element: <Navigate to="/market-tracker" />
        }
    ]
