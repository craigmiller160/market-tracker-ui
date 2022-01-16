import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Welcome } from '../components/Content/Welcome';
import { match } from 'ts-pattern';
import { Portfolios } from '../components/Content/Portfolios';
import { Watchlists } from '../components/Content/Watchlists/Watchlists';

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
		children: match(rules.hasChecked)
			.with(true, () =>
				match(rules.isAuthorized)
					.with(true, () => [
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
							element: <Navigate to="portfolios" />
						},
						{
							path: '*',
							element: <Navigate to="portfolios" />
						}
					])
					.otherwise(() => [
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
			)
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
