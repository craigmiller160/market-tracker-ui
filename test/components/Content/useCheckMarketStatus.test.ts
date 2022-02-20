import { checkAndUpdateMarketStatus } from '../../../src/store/marketSettings/actions';

jest.mock('../../../src/store/marketSettings/actions', () => ({
	checkAndUpdateMarketStatus: jest.fn()
}));

const checkAndUpdateMarketStatusMock = checkAndUpdateMarketStatus as jest.Mock;

describe('useCheckMarketStatus', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('user is not authorized', () => {
		throw new Error();
	});

	it('runs successfully a single time', () => {
		throw new Error();
	});

	it('tries to run more than once', () => {
		throw new Error();
	});
});
