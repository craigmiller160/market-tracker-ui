import {
	getAltIdForSymbol,
	getSymbolForAltId
} from '../../src/data/MarketPageInvestmentParsing';
import '@relmify/jest-fp-ts';

describe('MarketPageInvestmentParsing', () => {
	describe('getAltIdForSymbol', () => {
		it('has alt id', () => {
			const result = getAltIdForSymbol('BTC');
			expect(result).toEqualRight('bitcoin');
		});

		it('does not have alt id', () => {
			const result = getAltIdForSymbol('ABC');
			expect(result).toEqualRight('ABC');
		});
	});

	describe('getSymbolForAltId', () => {
		it('has symbol', () => {
			const result = getSymbolForAltId('bitcoin');
			expect(result).toEqualRight('BTC');
		});

		it('does not have symbol', () => {
			const result = getSymbolForAltId('ABC');
			expect(result).toEqualRight('ABC');
		});
	});
});
