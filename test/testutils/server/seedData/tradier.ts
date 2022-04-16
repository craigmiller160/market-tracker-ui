import { Data, DataUpdater } from '../Database';
import { createTradierQuote } from '../../testDataUtils';
import { castDraft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';

const createAddQuote =
	(draft: WritableDraft<Data>) => (symbol: string, modifier: number) => {
		draft.tradier.quotes[symbol] = castDraft(
			createTradierQuote(symbol, modifier)
		);
	};

export const seedTradier: DataUpdater = (draft) => {
	const addQuote = createAddQuote(draft);
	addQuote('VTI', 1);
	addQuote('VOO', 2);
	addQuote('AAPL', 3);
	addQuote('GOOG', 4);
};
