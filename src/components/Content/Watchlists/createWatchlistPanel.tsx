import { Watchlist } from '../../../types/Watchlist';
import { Collapse, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';

export const createWatchlistPanel = (watchlist: Watchlist) => (
	<Collapse.Panel
		key={watchlist._id}
		header={
			<Typography.Title level={4}>
				{watchlist.watchlistName}
			</Typography.Title>
		}
	>
		<WatchlistSection
			stocks={watchlist.stocks}
			cryptos={watchlist.cryptos}
		/>
	</Collapse.Panel>
);
