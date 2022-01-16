import { Welcome } from './Welcome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../../store/auth/selectors';
import { Routes, Navigate } from 'react-router-dom';
import { Route } from 'react-router';
import { ProtectedRoute, Rule } from '../routing/ProtectedRoute';
import { Watchlists } from './Watchlists/Watchlists';
import { Portfolios } from './Portfolios';

interface RuleProps {
	isAuthorized: boolean;
}

const isAuthRule: Rule<RuleProps> = {
	allow: (ruleProps: RuleProps) => ruleProps.isAuthorized,
	redirect: '/welcome'
};

const isNotAuthRule: Rule<RuleProps> = {
	allow: (ruleProps: RuleProps) => ruleProps.isAuthorized,
	redirect: '/portfolios'
};

export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector(hasCheckedSelector);
	const isAuthorized = useSelector(isAuthorizedSelector);

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	const ruleProps: RuleProps = {
		isAuthorized
	};

	return (
		<Layout.Content className="MainContent">
			{hasChecked && (
				<Routes>
					<ProtectedRoute
						path="portfolios/"
						ruleProps={ruleProps}
						rules={[isAuthRule]}
						element={<Portfolios />}
					/>
					<ProtectedRoute
						path="watchlists/*"
						ruleProps={ruleProps}
						rules={[isAuthRule]}
						element={<Watchlists />}
					/>
					<ProtectedRoute
						path="welcome"
						ruleProps={ruleProps}
						rules={[isNotAuthRule]}
						element={<Welcome />}
					/>
					{/*<Route path="welcome" element={<Welcome />} />*/}
					<Route path="" element={<Navigate to="welcome" />} />
				</Routes>
			)}
		</Layout.Content>
	);
};
