import { MouseEvent } from 'react';
import { DbWatchlist } from '../../../types/Watchlist';
import { Button, Collapse, Form, FormInstance, Input, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';

interface PanelTitleProps {
	readonly breakpoints: Breakpoints;
	readonly watchlist: DbWatchlist;
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
	const dispatch = useDispatch();
	const [form] = Form.useForm<TitleForm>();

	const isEditing = watchlist._id === renameWatchlistId;

	if (!isEditing) {
		return (
			<Typography.Title level={4} data-testid="watchlist-panel-title">
				{watchlist.watchlistName}
			</Typography.Title>
		);
	}

	const onSaveRenamedTitle = createOnSaveRenamedTitle(form, (newName) => {
		props.onSaveRenamedWatchlist(watchlist._id, newName);
		dispatch(
			notificationSlice.actions.addSuccess(
				'Successfully renamed watchlist'
			)
		);
	});
	const onCancelRenamedTitle = createOnCancelRenamedTitle(
		props.onClearRenamedWatchlistId
	);
	const breakpointName = getBreakpointName(props.breakpoints);

	return (
		<Form
			className={`PanelTitleForm ${breakpointName}`}
			form={form}
			initialValues={{
				watchlistName: watchlist.watchlistName
			}}
		>
			<Form.Item name="watchlistName">
				<Input allowClear onClick={(e) => e.stopPropagation()} />
			</Form.Item>
			<div className={`TitleFormActions ${breakpointName}`}>
				<Button onClick={onCancelRenamedTitle}>Cancel</Button>
				<Button
					htmlType="submit"
					type="primary"
					onClick={onSaveRenamedTitle}
				>
					Save
				</Button>
			</div>
		</Form>
	);
};

interface ActionsProps {
	readonly onRenameWatchlist: () => void;
	readonly onRemoveWatchlist: () => void;
	readonly renameWatchlistId?: string;
}

const WatchlistPanelActions = (props: ActionsProps) => {
	const onRenameClick = (event: MouseEvent) => {
		event.stopPropagation();
		props.onRenameWatchlist();
	};
	const onRemoveClick = (event: MouseEvent) => {
		event.stopPropagation();
		props.onRemoveWatchlist();
	};
	// TODO need a different button layout for mobile, this won't work
	return (
		<div>
			{props.renameWatchlistId === undefined && (
				<>
					<Button onClick={onRenameClick}>Rename</Button>
					<Button onClick={onRemoveClick}>Remove</Button>
				</>
			)}
		</div>
	);
};

export interface WatchlistPanelConfig {
	readonly breakpoints: Breakpoints;
	readonly renameWatchlistId?: string;
	readonly onRenameWatchlist: (id?: string) => void;
	readonly onRemoveWatchlist: (id: string) => void;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
	readonly onRemoveStock: (id: string, symbol: string) => void;
}

export const createWatchlistPanel =
	// eslint-disable-next-line react/display-name
	(config: WatchlistPanelConfig) => (watchlist: DbWatchlist) => {
		return (
			<Collapse.Panel
				key={watchlist._id}
				extra={
					<WatchlistPanelActions
						onRemoveWatchlist={() =>
							config.onRemoveWatchlist(watchlist._id)
						}
						renameWatchlistId={config.renameWatchlistId}
						onRenameWatchlist={() =>
							config.onRenameWatchlist(watchlist._id)
						}
					/>
				}
				className="WatchlistPanel"
				header={
					<WatchlistPanelTitle
						watchlist={watchlist}
						breakpoints={config.breakpoints}
						onClearRenamedWatchlistId={() =>
							config.onRenameWatchlist(undefined)
						}
						renameWatchlistId={config.renameWatchlistId}
						onSaveRenamedWatchlist={config.onSaveRenamedWatchlist}
					/>
				}
			>
				<WatchlistSection
					watchlistId={watchlist._id}
					onRemoveStock={config.onRemoveStock}
					stocks={watchlist.stocks}
					cryptos={watchlist.cryptos}
				/>
			</Collapse.Panel>
		);
	};
