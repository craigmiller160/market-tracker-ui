/// <reference types="vite/client" />

import { type PropsWithChildren } from 'react';
import {
	KeycloakAuthProvider,
	type RequiredRoles
} from '@craigmiller160/react-keycloak';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api-fp-ts';

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM;
	}
	return '';
};

const requiredRoles: RequiredRoles = {
	client: {
		'market-tracker-api': ['access'],
		'market-tracker-portfolio-service': ['access']
	}
};

export const MarketTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		realm={getRealm()}
		clientId="market-tracker-ui"
		localStorageKey={BEARER_TOKEN_KEY}
		requiredRoles={requiredRoles}
	>
		{props.children}
	</KeycloakAuthProvider>
);
