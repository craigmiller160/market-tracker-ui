import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Welcome } from '../components/Content/Welcome';
import { match } from 'ts-pattern';
import { Portfolios } from '../components/Content/Portfolios';
import { Watchlists } from '../components/Content/Watchlists/Watchlists';
import { Markets } from '../components/Content/Markets';

export interface RouteRules {
	isAuthorized: boolean;
	hasChecked: boolean;
}

export const routes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
		element: <Navigate to="/market-tracker" />
	},
	{
		path: '/market-tracker',
		children: match(rules)
			.with({ isAuthorized: true, hasChecked: true }, () => [
				{
					path: 'marekts',
					element: <Markets />
				},
				{
					path: 'portfolios',
					element: <Portfolios />
				},
				{
					path: 'watchlists',
					element: <Watchlists />
				},
				{
					path: '',
					element: <Navigate to="markets" />
				},
				{
					path: '*',
					element: <Navigate to="markets" />
				}
			])
			.with({ isAuthorized: false, hasChecked: true }, () => [
				{
					path: 'welcome',
					element: <Welcome />
				},
				{
					path: '',
					element: <Navigate to="welcome" />
				},
				{
					path: '*',
					element: <Navigate to="welcome" />
				}
			])
			.otherwise(() => [
				{
					path: '',
					element: <div />
				},
				{
					path: '*',
					element: <div />
				}
			])
	}
];
