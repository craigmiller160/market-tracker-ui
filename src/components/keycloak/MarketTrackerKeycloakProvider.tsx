import { PropsWithChildren } from 'react';
import { KeycloakAuthProvider } from '@craigmiller160/react-keycloak';
import { MarketTrackerKeycloakBridge } from './MarketTrackerKeycloakBridge';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api-fp-ts';

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
