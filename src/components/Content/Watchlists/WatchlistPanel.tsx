import { MouseEvent } from 'react';
import { DbWatchlist } from '../../../types/Watchlist';
import {
	Button,
	Collapse,
	Dropdown,
	Form,
	FormInstance,
	Input,
	Menu,
	Typography
} from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';
import { match } from 'ts-pattern';

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

const DesktopWatchlistPanelActions = (props: ActionsProps) => {
	const onRenameClick = (event: MouseEvent) => {
		event.stopPropagation();
		props.onRenameWatchlist();
	};
	const onRemoveClick = (event: MouseEvent) => {
		event.stopPropagation();
		props.onRemoveWatchlist();
	};

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

const MobileWatchlistPanelActions = (props: ActionsProps) => {
	const onMenuClick = (menuInfo: MenuInfo) =>
		match(menuInfo)
			.with({ key: 'rename' }, () => props.onRemoveWatchlist())
			.otherwise(() => props.onRenameWatchlist());

	const TheMenu = (
		<Menu onClick={onMenuClick}>
			<Menu.Item key="rename">Rename</Menu.Item>
			<Menu.Item key="remove">Remove</Menu.Item>
		</Menu>
	);

	const onMenuBtnClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	return (
		<div>
			{props.renameWatchlistId === undefined && (
				<>
					<Dropdown overlay={TheMenu} trigger={['click']}>
						<Button onClick={onMenuBtnClick}>...</Button>
					</Dropdown>
				</>
			)}
		</div>
	);
};

export interface WatchlistPanelConfig {
	readonly breakpoints: Breakpoints; // TODO probably can move this into component
	readonly renameWatchlistId?: string;
	readonly onRenameWatchlist: (id?: string) => void;
	readonly onRemoveWatchlist: (id: string) => void;
	readonly onSaveRenamedWatchlist: (id: string, newName: string) => void;
	readonly onRemoveStock: (id: string, symbol: string) => void;
}

export interface WatchlistPanelProps extends WatchlistPanelConfig {
	readonly watchlist: DbWatchlist;
}

export const WatchlistPanel =
	// eslint-disable-next-line react/display-name
	(props: WatchlistPanelProps) => {
		const {
			breakpoints,
			renameWatchlistId,
			onRemoveWatchlist,
			onRemoveStock,
			onRenameWatchlist,
			onSaveRenamedWatchlist,
			watchlist,
			...rest
		} = props;
		const actionProps: ActionsProps = {
			onRenameWatchlist: () => onRenameWatchlist(watchlist._id),
			renameWatchlistId: renameWatchlistId,
			onRemoveWatchlist: () => onRemoveWatchlist(watchlist._id)
		};

		const Actions = match(breakpoints)
			.with({ xs: true }, () => (
				<MobileWatchlistPanelActions {...actionProps} />
			))
			.otherwise(() => <DesktopWatchlistPanelActions {...actionProps} />);

		return (
			<Collapse.Panel
				{...rest}
				key={watchlist._id}
				extra={Actions}
				className="WatchlistPanel"
				header={
					<WatchlistPanelTitle
						watchlist={watchlist}
						breakpoints={breakpoints}
						onClearRenamedWatchlistId={() =>
							onRenameWatchlist(undefined)
						}
						renameWatchlistId={renameWatchlistId}
						onSaveRenamedWatchlist={onSaveRenamedWatchlist}
					/>
				}
			>
				<WatchlistSection
					watchlistId={watchlist._id}
					onRemoveStock={onRemoveStock}
					stocks={watchlist.stocks}
					cryptos={watchlist.cryptos}
				/>
			</Collapse.Panel>
		);
	};
