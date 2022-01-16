import {render, waitFor} from '@testing-library/react';
import {RootLayout} from '../../../src/components/RootLayout';

const doRender = () => waitFor(() => render(
	<RootLayout />
))

describe('Navbar', () => {
	it('renders for desktop', () => {
		throw new Error();
	});

	it('renders for mobile', () => {
		throw new Error();
	});

	it('shows correct items for un-authenticated user, including welcome page', () => {
		throw new Error();
	});

	it('shows correct items for authenticated user', () => {
		throw new Error();
	});

	it('navigates to portfolios page', () => {
		throw new Error();
	});

	it('navigates to watchlists page', () => {
		throw new Error();
	});

	it('sends login request', () => {
		throw new Error();
	});

	it('sends logout request', () => {
		throw new Error();
	});
});
