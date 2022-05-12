import { MouseEvent } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { match } from 'ts-pattern';
import { Breakpoints } from '../../utils/Breakpoints';
import { MenuInfo } from 'rc-menu/lib/interface';

interface ActionsProps {
	readonly breakpoints: Breakpoints;
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
		<div data-testid="desktop-panel-actions">
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
	const onMenuClick = (menuInfo: MenuInfo) => {
		menuInfo.domEvent.stopPropagation();
		match(menuInfo)
			.with({ key: 'rename' }, () => props.onRenameWatchlist())
			.otherwise(() => props.onRemoveWatchlist());
	};

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
		<div data-testid="mobile-panel-actions">
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

export const WatchlistPanelActions = (props: ActionsProps) =>
	match(props.breakpoints)
		.with({ xs: true }, () => <MobileWatchlistPanelActions {...props} />)
		.otherwise(() => <DesktopWatchlistPanelActions {...props} />);
