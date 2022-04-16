import { Data, DataUpdater } from '../Database';
import {
	createTradierHistory,
	createTradierQuote,
	createTradierTimesale
} from '../../testDataUtils';
import { castDraft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';

const createAddQuote =
	(draft: WritableDraft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.quotes[symbol] = castDraft(
			createTradierQuote(symbol, modifier)
		);
	};

const createAddHistory =
	(draft: WritableDraft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.history[symbol] = castDraft(
			createTradierHistory(modifier)
		);
	};

const createAddTimesale =
	(draft: WritableDraft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.timesales[symbol] = castDraft(
			createTradierTimesale(modifier)
		);
	};

export const seedTradier: DataUpdater = (draft) => {
	const addQuote = createAddQuote(draft);
	const addHistory = createAddHistory(draft);
	const addTimesale = createAddTimesale(draft);
	['VTI', 'VOO', 'AAPL', 'GOOG'].forEach((symbol, index) => {
		addQuote(symbol, index);
		addHistory(symbol, index);
		addTimesale(symbol, index);
	});
};
