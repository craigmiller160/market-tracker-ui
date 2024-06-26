import { mount, type MountReturn } from 'cypress/react18';
type Chainable<T> = Cypress.Chainable<T>;
import { match, P } from 'ts-pattern';
import {
    type KeycloakAuth,
    KeycloakAuthContext
} from '@craigmiller160/react-keycloak';
import { MemoryRouter } from 'react-router';
import { App } from '../../src/components/App';

const desktopViewport = (): Chainable<null> => cy.viewport(1920, 1080);
const mobileViewport = (): Chainable<null> => cy.viewport(500, 500);

export type MountViewport = 'desktop' | 'mobile';

export type MountConfig = {
    readonly viewport: MountViewport;
    readonly isAuthorized: boolean;
    readonly initialRoute: string;
};

export const defaultConfig: MountConfig = {
    viewport: 'desktop',
    isAuthorized: true,
    initialRoute: '/'
};

const handleViewport = (config?: Partial<MountConfig>): Chainable<null> =>
    match(config)
        .with(undefined, desktopViewport)
        .with({ viewport: 'mobile' }, mobileViewport)
        .otherwise(desktopViewport);
const getInitialEntries = (config?: Partial<MountConfig>): string[] =>
    match(config)
        .with(undefined, () => ['/'])
        .with({ initialRoute: P.string }, ({ initialRoute }) => [initialRoute])
        .otherwise(() => ['/']);

const keycloakAuth: KeycloakAuth = {
    status: 'authorized',
    isPostAuthorization: true,
    isPreAuthorization: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logout: () => {}
};

export const mountApp = (
    config?: Partial<MountConfig>
): Chainable<MountReturn> => {
    handleViewport(config);
    const initialEntries = getInitialEntries(config);
    return mount(
        <MemoryRouter initialEntries={initialEntries}>
            <KeycloakAuthContext.Provider value={keycloakAuth}>
                <App />
            </KeycloakAuthContext.Provider>
        </MemoryRouter>
    );
};
