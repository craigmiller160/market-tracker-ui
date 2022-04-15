import { MouseEvent } from 'react';
import { Watchlist } from '../../../types/Watchlist';
import {
	Button,
	Collapse,
	Dropdown,
	Form,
	Input,
	Menu,
	Typography
} from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';
import { useImmer } from 'use-immer';

// TODO buttons should be same height as text field

interface TitleState {
	readonly isEditing: boolean;
}

interface PanelTitleProps {
	readonly watchlist: Watchlist;
	readonly renameWatchlistId?: string;
}

const WatchlistPanelTitle = (props: PanelTitleProps) => {
	const { watchlist, renameWatchlistId } = props;
	const [form] = Form.useForm();
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
			<Typography.Title onClick={doEditTitle} level={4}>
				{watchlist.watchlistName}
			</Typography.Title>
		);
	}

	const onSaveClick = (event?: MouseEvent) => {
		event?.stopPropagation();
		// TODO do save action
	};

	return (
		<Form
			className="PanelTitleForm"
			initialValues={{
				watchlistName: watchlist.watchlistName
			}}
		>
			<Form.Item name="watchlistName">
				<Input allowClear />
			</Form.Item>
			<Button>Cancel</Button>
			<Button htmlType="submit" type="primary" onClick={onSaveClick}>
				Save
			</Button>
		</Form>
	);
};

export const createWatchlistPanel =
	(renameWatchlistId?: string) => (watchlist: Watchlist) => {
		return (
			<Collapse.Panel
				key={watchlist._id}
				extra="FooBar"
				className="WatchlistPanel"
				header={
					<WatchlistPanelTitle
						watchlist={watchlist}
						renameWatchlistId={renameWatchlistId}
					/>
				}
			>
				<WatchlistSection
					stocks={watchlist.stocks}
					cryptos={watchlist.cryptos}
				/>
			</Collapse.Panel>
		);
	};
