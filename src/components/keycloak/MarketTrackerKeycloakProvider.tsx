import { PropsWithChildren } from 'react';
import { KeycloakAuthProvider } from '@craigmiller160/react-keycloak';
import { MarketTrackerKeycloakBridge } from './MarketTrackerKeycloakBridge';

export const MarketTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		realm=""
		clientId="market-tracker-ui"
		localStorageKey={BEARER_TOKEN_KEY}
	>
		<MarketTrackerKeycloakBridge>
			{props.children}
		</MarketTrackerKeycloakBridge>
	</KeycloakAuthProvider>
);
