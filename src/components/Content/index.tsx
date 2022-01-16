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
// import { ProtectedRouteV2, RuleV2 } from '../routing/ProtectedRouteV2';
// import { Watchlists } from './Watchlists/Watchlists';
// import { Portfolios } from './Portfolios';
//
interface RuleProps {
	isAuthorized: boolean;
}

// const isAuthRule: RuleV2<RuleProps> = {
// 	allow: (ruleProps: RuleProps) => ruleProps.isAuthorized,
// 	redirect: '/welcome'
// };
//
// const isNotAuthRule: RuleV2<RuleProps> = {
// 	allow: (ruleProps: RuleProps) => ruleProps.isAuthorized,
// 	redirect: '/portfolios'
// };

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
					{/*<ProtectedRouteV2*/}
					{/*	path="portfolios/"*/}
					{/*	ruleProps={ruleProps}*/}
					{/*	rules={[isAuthRule]}*/}
					{/*	element={<Portfolios />}*/}
					{/*/>*/}
					{/*<ProtectedRouteV2*/}
					{/*	path="watchlists/*"*/}
					{/*	ruleProps={ruleProps}*/}
					{/*	rules={[isAuthRule]}*/}
					{/*	element={<Watchlists />}*/}
					{/*/>*/}
					{/*<ProtectedRouteV2*/}
					{/*	path="welcome"*/}
					{/*	ruleProps={ruleProps}*/}
					{/*	rules={[isNotAuthRule]}*/}
					{/*	element={<Welcome />}*/}
					{/*/>*/}
					{/*<Route path="welcome" element={<Welcome />} />*/}
					<Route path="" element={<Navigate to="welcome" />} />
				</Routes>
			)}
		</Layout.Content>
	);
};
