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

const hasCheckedFalseRoutes: RouteObject[] = [
	{
		path: '',
		element: <div />
	}
];

const notAuthorizedRoutes: RouteObject[] = [
	{
		path: 'welcome',
		element: <Welcome />
	},
	{
		path: '*',
		element: <Navigate to="welcome" />
	}
];

const isAuthorizedRoutes: RouteObject[] = [
	{
		path: 'portfolios',
		element: <Portfolios />
	},
	{
		path: 'watchlists',
		element: <Watchlists />
	},
	{
		path: '*',
		element: <Navigate to="portfolios" />
	}
];

const buildLevelTwoRoutes = (rules: RouteRules): RouteObject[] => {
	return match(rules.isAuthorized)
		.with(true, () => isAuthorizedRoutes)
		.otherwise(() => notAuthorizedRoutes);
};

const buildLevelOneRoutes = (rules: RouteRules): RouteObject[] => {
	return match(rules.hasChecked)
		.with(true, (): RouteObject[] => buildLevelTwoRoutes(rules))
		.otherwise((): RouteObject[] => hasCheckedFalseRoutes);
};

export const routes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
		element: <Navigate to="/market-tracker" />
	},
	{
		path: '/market-tracker',
		children: buildLevelOneRoutes(rules)
	}
];
