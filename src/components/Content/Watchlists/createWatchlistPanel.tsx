import { MouseEvent } from 'react';
import { Watchlist } from '../../../types/Watchlist';
import { Button, Collapse, Form, FormInstance, Input, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';

// TODO on mobile put buttons below text, if possible
// TODO form buttons same height as text field

interface PanelTitleProps {
	readonly watchlist: Watchlist;
	readonly renameWatchlistId?: string;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
	readonly onClearRenamedWatchlistId: () => void;
}

interface TitleForm {
	readonly watchlistName: string;
}

const createOnSaveRenamedTitle =
	(
		form: FormInstance<TitleForm>,
		onSaveRenamedWatchlist: (newName: string) => void
	) =>
	(event: MouseEvent) => {
		event.stopPropagation();
		onSaveRenamedWatchlist(form.getFieldsValue().watchlistName);
	};
const createOnCancelRenamedTitle =
	(onClearRenamedWatchlistId: () => void) => (event: MouseEvent) => {
		event.stopPropagation();
		onClearRenamedWatchlistId();
	};

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

	const onSaveRenamedTitle = createOnSaveRenamedTitle(form, (newName) =>
		props.onSaveRenamedWatchlist(watchlist._id, newName)
	);
	const onCancelRenamedTitle = createOnCancelRenamedTitle(
		props.onClearRenamedWatchlistId
	);

	return (
		<Form
			className="PanelTitleForm"
			form={form}
			initialValues={{
				watchlistName: watchlist.watchlistName
			}}
		>
			<Form.Item name="watchlistName">
				<Input allowClear onClick={(e) => e.stopPropagation()} />
			</Form.Item>
			<Button onClick={onCancelRenamedTitle}>Cancel</Button>
			<Button
				htmlType="submit"
				type="primary"
				onClick={onSaveRenamedTitle}
			>
				Save
			</Button>
		</Form>
	);
};

interface ActionsProps {
	readonly onRenameWatchlist: () => void;
}

const WatchlistPanelActions = (props: ActionsProps) => {
	const onRenameClick = (event: MouseEvent) => {
		event.stopPropagation();
		props.onRenameWatchlist();
	};
	return (
		<div>
			<Button onClick={onRenameClick}>Rename</Button>
		</div>
	);
};

export interface WatchlistPanelConfig {
	readonly renameWatchlistId?: string;
	readonly onRenameWatchlist: (id?: string) => void;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
}

export const createWatchlistPanel =
	// eslint-disable-next-line react/display-name
	(config: WatchlistPanelConfig) => (watchlist: Watchlist) => {
		return (
			<Collapse.Panel
				key={watchlist._id}
				extra={
					<WatchlistPanelActions
						onRenameWatchlist={() =>
							config.onRenameWatchlist(watchlist._id)
						}
					/>
				}
				className="WatchlistPanel"
				header={
					<WatchlistPanelTitle
						watchlist={watchlist}
						onClearRenamedWatchlistId={() =>
							config.onRenameWatchlist(undefined)
						}
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
