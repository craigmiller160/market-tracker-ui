import marketDataJson from './marketsPageInvestments.json';
import {
	MarketInvestmentInfoArray,
	marketInvestmentInfoArrayV
} from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import { handleValidationResult } from '../errors/TypeValidationError';

export const getMarketInvestmentInfo = () => {
	const result = pipe(
		marketInvestmentInfoArrayV.decode(marketDataJson),
		handleValidationResult
	);
};
