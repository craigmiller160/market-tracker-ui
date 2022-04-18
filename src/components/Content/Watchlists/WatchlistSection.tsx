import { WatchlistItem } from '../../../types/Watchlist';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import './WatchlistSection.scss';
import { ReactNode } from 'react';
import { Button } from 'antd';

interface Props {
	readonly watchlistName: string;
	readonly stocks: ReadonlyArray<WatchlistItem>;
	readonly cryptos: ReadonlyArray<WatchlistItem>;
}

const createGetActions =
	(watchlistName: string, type: InvestmentType) =>
	// eslint-disable-next-line react/display-name
	(symbol: string): ReactNode[] => {
		if (InvestmentType.CRYPTO === type) {
			return [];
		}
		return [<Button key="remove">Remove</Button>];
	};

const symbolToCard =
	(watchlistName: string, type: InvestmentType) =>
	// eslint-disable-next-line react/display-name
	({ symbol }: WatchlistItem) => {
		const info: InvestmentInfo = {
			type,
			symbol,
			name: ''
		};
		const getActions = createGetActions(watchlistName, type);
		return (
			<InvestmentCard key={symbol} info={info} getActions={getActions} />
		);
	};

export const WatchlistSection = (props: Props) => {
	const stockCards = props.stocks.map(
		symbolToCard(props.watchlistName, InvestmentType.STOCK)
	);
	const cryptoCards = props.cryptos.map(
		symbolToCard(props.watchlistName, InvestmentType.CRYPTO)
	);
	return (
		<div className="WatchlistSection" role="list">
			{stockCards}
			{cryptoCards}
		</div>
	);
};
