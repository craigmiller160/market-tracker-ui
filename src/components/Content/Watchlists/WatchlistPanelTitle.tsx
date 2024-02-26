import { type DbWatchlist } from '../../../types/Watchlist';
import { Button, Form, type FormInstance, Input, Typography } from 'antd';
import { type MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { notificationSlice } from '../../../store/notification/slice';
import './WatchlistPanelTitle.scss';
import { useBreakpointName } from '../../utils/Breakpoints';

interface Props {
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

export const WatchlistPanelTitle = (props: Props) => {
	const { watchlist, renameWatchlistId } = props;
	const dispatch = useDispatch();
	const [form] = Form.useForm<TitleForm>();

	const isEditing = watchlist._id === renameWatchlistId;
	const breakpointName = useBreakpointName();

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
