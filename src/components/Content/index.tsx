import { Welcome } from './Welcome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../../store/auth/selectors';
import { Routes } from 'react-router-dom';
import ProtectedRoute, { Rule } from '@craigmiller160/react-protected-route';
import { Portfolios } from './Portfolios';
import { Watchlists } from './Watchlists/Watchlists';
import { Route } from 'react-router';

interface RuleProps {
	isAuthorized: boolean;
}

const isAuthRule: Rule<RuleProps> = {
	allow: (ruleProps?: RuleProps) => ruleProps?.isAuthorized ?? false,
	redirect: '/welcome'
};

export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector(hasCheckedSelector);
	const isAuthorized = useSelector(isAuthorizedSelector);

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			{hasChecked && (
				<Routes>
					<ProtectedRoute
						path="/portfolios"
						exact
						component={Portfolios}
						ruleProps={{ isAuthorized }}
						rules={[isAuthRule]}
					/>
					<ProtectedRoute
						path="/watchlists"
						exact
						component={Watchlists}
						ruleProps={{ isAuthorized }}
						rules={[isAuthRule]}
					/>
					<Route path="/welcome" element={Welcome} />
				</Routes>
			)}
		</Layout.Content>
	);
};
