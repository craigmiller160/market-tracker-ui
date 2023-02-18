import { PropsWithChildren, useContext, useEffect } from 'react';
import { KeycloakAuthContext } from '@craigmiller160/react-keycloak';
import { useDispatch } from 'react-redux';
import { authSlice } from '../../store/auth/slice';
import * as Option from 'fp-ts/es6/Option';

export const MarketTrackerKeycloakBridge = (props: PropsWithChildren) => {
	const auth = useContext(KeycloakAuthContext);
	const dispatch = useDispatch();
	useEffect(() => {
		if (auth.isPostAuthorization && auth.status === 'authorized') {
			dispatch(
				authSlice.actions.setUserData(
					Option.some({
						userId: auth.tokenParsed?.sub ?? ''
					})
				)
			);
		} else {
			authSlice.actions.setUserData(Option.none);
		}
	}, [auth, dispatch]);
	return <div>{props.children}</div>;
};
