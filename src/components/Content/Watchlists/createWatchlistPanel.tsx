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

const TitleFormMenu = (
	<Menu onClick={(info) => info.domEvent.stopPropagation()}>
		<Menu.Item key="cancel">Cancel</Menu.Item>
	</Menu>
);

const WatchlistPanelTitle = ({ watchlist }: { watchlist: Watchlist }) => {
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
			<Typography.Title
				onClick={doEditTitle}
				className="PanelTitle"
				level={4}
			>
				{watchlist.watchlistName}
			</Typography.Title>
		);
	}

	const onSaveClick = (event?: MouseEvent) => {
		event?.stopPropagation();
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
			<Dropdown.Button onClick={onSaveClick} overlay={TitleFormMenu}>
				Save
			</Dropdown.Button>
		</Form>
	);
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
