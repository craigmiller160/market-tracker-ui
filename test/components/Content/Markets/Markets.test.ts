import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';

const mockApi = new MockAdapter(ajaxApi.instance);

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		throw new Error();
	});

	it('renders for today when history has higher millis than current time', async () => {
		throw new Error();
	});

	it('renders for today with market closed', async () => {
		throw new Error();
	});

	it('renders for 1 week', async () => {
		throw new Error();
	});

	it('renders for 1 month', async () => {
		throw new Error();
	});

	it('renders for 3 months', async () => {
		throw new Error();
	});

	it('renders for 1 year', async () => {
		throw new Error();
	});

	it('renders for 5 years', async () => {
		throw new Error();
	});
});
