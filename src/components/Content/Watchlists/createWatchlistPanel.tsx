import { MouseEvent } from 'react';
import { Watchlist } from '../../../types/Watchlist';
import { Collapse, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';
import { useImmer } from 'use-immer';

interface TitleState {
	readonly isEditing: boolean;
}

const WatchlistPanelTitle = ({ watchlist }: { watchlist: Watchlist }) => {
	const [state, setState] = useImmer<TitleState>({
		isEditing: false
	});

	const doEditTitle = (event?: MouseEvent<HTMLDivElement>) => {
		event?.stopPropagation();
		setState((draft) => {
			draft.isEditing = true;
		});
	};

	if (!state.isEditing) {
		return (
			<Typography.Title
				onClick={doEditTitle}
				className="PanelTitle"
				level={4}
			>
				{watchlist.watchlistName}
			</Typography.Title>
		);
	}

	return <div />;
};

export const createWatchlistPanel = (watchlist: Watchlist) => {
	return (
		<Collapse.Panel
			key={watchlist._id}
			className="WatchlistPanel"
			header={<WatchlistPanelTitle watchlist={watchlist} />}
		>
			<WatchlistSection
				stocks={watchlist.stocks}
				cryptos={watchlist.cryptos}
			/>
		</Collapse.Panel>
	);
};
