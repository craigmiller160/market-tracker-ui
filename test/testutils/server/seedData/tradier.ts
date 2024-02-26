import { type Data, type DataUpdater } from '../Database';
import {
	createTradierHistory,
	createTradierQuote,
	createTradierTimesale
} from '../../testDataUtils';
import { castDraft } from 'immer';
import { type Draft } from 'immer';

const createAddQuote =
	(draft: Draft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.quotes[symbol] = castDraft(
			createTradierQuote(symbol, modifier)
		);
	};

const createAddHistory =
	(draft: Draft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.history[symbol] = castDraft(
			createTradierHistory(modifier)
		);
	};

const createAddTimesale =
	(draft: Draft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.timesales[symbol] = castDraft(
			createTradierTimesale(modifier)
		);
	};

export const seedTradier: DataUpdater = (draft) => {
	const addQuote = createAddQuote(draft);
	const addHistory = createAddHistory(draft);
	const addTimesale = createAddTimesale(draft);
	['VTI', 'VOO', 'AAPL', 'GOOG', 'MSFT'].forEach((symbol, index) => {
		addQuote(symbol, index);
		addHistory(symbol, index);
		addTimesale(symbol, index);
	});
};
