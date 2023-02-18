/// <reference types="vite/client" />

import { PropsWithChildren } from 'react';
import { KeycloakAuthProvider } from '@craigmiller160/react-keycloak';
import { MarketTrackerKeycloakBridge } from './MarketTrackerKeycloakBridge';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api-fp-ts';

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM;
	}
	return '';
};

export const MarketTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		realm={getRealm()}
		clientId="market-tracker-ui"
		localStorageKey={BEARER_TOKEN_KEY}
	>
		<MarketTrackerKeycloakBridge>
			{props.children}
		</MarketTrackerKeycloakBridge>
	</KeycloakAuthProvider>
);
