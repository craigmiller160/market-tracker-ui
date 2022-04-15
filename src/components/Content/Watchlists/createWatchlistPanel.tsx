import { MouseEvent } from 'react';
import { Watchlist } from '../../../types/Watchlist';
import { Button, Collapse, Form, Input, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';

// TODO on mobile put buttons below text, if possible

interface PanelTitleProps {
	readonly watchlist: Watchlist;
	readonly renameWatchlistId?: string;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
}

interface TitleForm {
	readonly watchlistName: string;
}

const WatchlistPanelTitle = (props: PanelTitleProps) => {
	const { watchlist, renameWatchlistId } = props;
	const [form] = Form.useForm<TitleForm>();

	const isEditing = watchlist._id === renameWatchlistId;

	if (!isEditing) {
		return (
			<Typography.Title level={4}>
				{watchlist.watchlistName}
			</Typography.Title>
		);
	}

	// TODO move outside of component
	const onSaveClick = (event?: MouseEvent) => {
		event?.stopPropagation();
		props.onSaveRenamedWatchlist(
			watchlist._id,
			form.getFieldsValue().watchlistName
		);
	};

	return (
		<Form
			className="PanelTitleForm"
			form={form}
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

const WatchlistPanelActions = () => (
	<div>
		<Button>Rename</Button>
	</div>
);

export interface WatchlistPanelConfig {
	readonly renameWatchlistId?: string;
	readonly onRenameWatchlist: (id: string) => void;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
}

export const createWatchlistPanel =
	// eslint-disable-next-line react/display-name
	(config: WatchlistPanelConfig) => (watchlist: Watchlist) => {
		return (
			<Collapse.Panel
				key={watchlist._id}
				extra={<WatchlistPanelActions />}
				className="WatchlistPanel"
				header={
					<WatchlistPanelTitle
						watchlist={watchlist}
						renameWatchlistId={config.renameWatchlistId}
						onSaveRenamedWatchlist={config.onSaveRenamedWatchlist}
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
