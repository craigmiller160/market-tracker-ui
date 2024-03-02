import { type RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Welcome } from '../components/Content/Welcome';
import { match } from 'ts-pattern';
import { Recognition } from '../components/Content/Recognition';
import { Search } from '../components/Content/Search';
import { InvestmentInfo } from '../components/Content/InvestmentInfo';

export interface RouteRules {
	isAuthorized: boolean;
	hasChecked: boolean;
	env: string | undefined;
}

const getAuthorizedRoutes = () => {
	const allEnvRoutes = [
		{
			path: 'investments',
			element: <InvestmentInfo />
		},
		{
			path: 'search',
			element: <Search />
		},
		{
			path: 'recognition',
			element: <Recognition />
		}
	];
	const fallbackRoutes = [
		{
			path: '',
			element: <Navigate to="investments" />
		},
		{
			path: '*',
			element: <Navigate to="investments" />
		}
	];
	return [...allEnvRoutes, ...fallbackRoutes];
};

export const routes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
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
		element: <Navigate to="/" />
	}
];
