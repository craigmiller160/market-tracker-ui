import { WatchlistItem } from '../../../types/Watchlist';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import './WatchlistSection.scss';
import { ReactNode } from 'react';
import { Button } from 'antd';

interface Props {
	readonly watchlistId: string;
	readonly stocks: ReadonlyArray<WatchlistItem>;
	readonly cryptos: ReadonlyArray<WatchlistItem>;
	readonly onRemoveStock: (watchlistId: string, symbol: string) => void;
}

const createGetActions =
	(type: InvestmentType, remove: (symbol: string) => void) =>
	// eslint-disable-next-line react/display-name
	(symbol: string): ReactNode[] => {
		if (InvestmentType.CRYPTO === type) {
			return [];
		}
		return [
			<Button key="remove" onClick={() => remove(symbol)}>
				Remove
			</Button>
		];
	};

const symbolToCard =
	(type: InvestmentType, remove: (symbol: string) => void) =>
	// eslint-disable-next-line react/display-name
	({ symbol }: WatchlistItem) => {
		const info: InvestmentInfo = {
			type,
			symbol,
			name: ''
		};
		const getActions = createGetActions(type, remove);
		return (
			<InvestmentCard key={symbol} info={info} getActions={getActions} />
		);
	};

export const WatchlistSection = (props: Props) => {
	const stockCards = props.stocks.map(
		symbolToCard(InvestmentType.STOCK, (symbol: string) =>
			props.onRemoveStock(props.watchlistId, symbol)
		)
	);
	const cryptoCards = props.cryptos.map(
		symbolToCard(InvestmentType.CRYPTO, (symbol: string) =>
			props.onRemoveStock(props.watchlistId, symbol)
		)
	);
	return (
		<div className="WatchlistSection" role="list">
			{stockCards}
			{cryptoCards}
		</div>
	);
};
