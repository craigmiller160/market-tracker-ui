import { WatchlistItem } from '../../../types/Watchlist';
import { InvestmentCard } from '../common/InvestmentCard/InvestmentCard';
import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../types/data/InvestmentType';
import './WatchlistSection.scss';

interface Props {
	readonly stocks: ReadonlyArray<WatchlistItem>;
	readonly cryptos: ReadonlyArray<WatchlistItem>;
}

const symbolToCard =
	(type: InvestmentType) =>
	// eslint-disable-next-line react/display-name
	({ symbol }: WatchlistItem) => {
		const info: InvestmentInfo = {
			type,
			symbol,
			name: ''
		};
		return <InvestmentCard key={symbol} info={info} />;
	};

export const WatchlistSection = (props: Props) => {
	const stockCards = props.stocks.map(symbolToCard(InvestmentType.STOCK));
	const cryptoCards = props.cryptos.map(symbolToCard(InvestmentType.CRYPTO));
	return (
		<div className="WatchlistSection" role="list">
			{stockCards}
			{cryptoCards}
		</div>
	);
};
