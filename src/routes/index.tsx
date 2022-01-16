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
					.with(true, () => {
						console.log('IsChecked & IsAuthorized')
						return [
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
						]
					})
					.otherwise(() => {
						console.log('IsCheckedOnly')
						return [
							{
								path: 'welcome',
								element: <Welcome />
							},
							{
								path: '',
								element: <Navigate to="welcome" />
							}
						]
					})
			)
			.otherwise(() => {
				console.log('AllFalse')
				return [
					{
						path: '*',
						element: <div />
					}
				]
			})
	}
];
