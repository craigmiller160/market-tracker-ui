import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Welcome } from '../components/Content/Welcome';
import { match, when } from 'ts-pattern';
import { Portfolios } from '../components/Content/Portfolios';
import { Watchlists } from '../components/Content/Watchlists';
import { Markets } from '../components/Content/Markets';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { Recognition } from '../components/Content/Recognition';
import { Search } from '../components/Content/Search';

export interface RouteRules {
	isAuthorized: boolean;
	hasChecked: boolean;
	env: string | undefined;
}

const isNotProd: PredicateT<string | undefined> = (_) => _ !== 'production';

const getAuthorizedRoutes = ({ env }: RouteRules) => {
	const allEnvRoutes = [
		{
			path: 'markets',
			element: <Markets />
		},
		{
			path: 'search',
			element: <Search />
		},
		{
			path: 'watchlists',
			element: <Watchlists />
		},
		{
			path: 'recognition',
			element: <Recognition />
		}
	];
	const fallbackRoutes = [
		{
			path: '',
			element: <Navigate to="markets" />
		},
		{
			path: '*',
			element: <Navigate to="markets" />
		}
	];
	const envDependentRoutes = match(env)
		.with(when(isNotProd), () => [
			{
				path: 'portfolios',
				element: <Portfolios />
			}
		])
		.otherwise(() => []);
	return [...allEnvRoutes, ...envDependentRoutes, ...fallbackRoutes];
};

export const routes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
		element: <Navigate to="/market-tracker" />
	},
	{
		path: '/market-tracker',
		children: match(rules)
			.with({ isAuthorized: true, hasChecked: true }, getAuthorizedRoutes)
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
	},
	{
		path: '*',
		element: <Navigate to="/market-tracker" />
	}
];
