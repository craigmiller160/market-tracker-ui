import { Form, FormInstance, Input, Modal, Radio, Space } from 'antd';
import { Updater, useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { getWatchlistNames } from '../../../services/WatchlistService';
import { useEffect, useMemo } from 'react';
import { castDraft } from 'immer';
import { TaskT } from '@craigmiller160/ts-functions/es/types';

interface Props {
	readonly show: boolean;
	readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalForm {
	readonly watchlistSelectionType: WatchlistSelectionType;
	readonly newWatchListName: string;
	readonly existingWatchlistName: string;
}

interface State {
	readonly loading: boolean;
	readonly hadError: boolean;
	readonly existingWatchlistNames: ReadonlyArray<string>;
}

// TODO don't forget alert message on success
// TODO make sure it resets when re-opened

const NewWatchlistItem = (
	<Form.Item shouldUpdate label="New">
		{(innerForm: FormInstance<ModalForm>) => {
			return (
				<Input
					disabled={
						innerForm.getFieldsValue().watchlistSelectionType !==
						'new'
					}
					value={innerForm.getFieldsValue().newWatchListName}
					onChange={(event) =>
						innerForm.setFieldsValue({
							newWatchListName: event.target.validationMessage
						})
					}
				/>
			);
		}}
	</Form.Item>
);

const createGetWatchlistNames = (setState: Updater<State>): TaskT<void> =>
	pipe(
		getWatchlistNames(),
		TaskEither.fold(
			() => async () =>
				setState((draft) => {
					draft.loading = false;
					draft.hadError = true;
				}),
			(names) => async () =>
				setState((draft) => {
					draft.loading = false;
					draft.existingWatchlistNames = castDraft(names);
				})
		)
	);

export const AddToWatchlistModal = (props: Props) => {
	const [form] = Form.useForm<ModalForm>();
	const [state, setState] = useImmer<State>({
		loading: true,
		hadError: false,
		existingWatchlistNames: []
	});
	const getWatchlistNames = useMemo(
		() => createGetWatchlistNames(setState),
		[setState]
	);

	useEffect(() => {
		getWatchlistNames();
	}, [getWatchlistNames]);

	return (
		<Modal
			title="Add to Watchlist"
			visible={props.show}
			onCancel={props.onClose}
		>
			<div>
				<Form
					form={form}
					initialValues={{
						watchlistSelectionType: 'existing'
					}}
				>
					<Form.Item name="watchlistSelectionType">
						<Radio.Group>
							<Space direction="vertical">
								<Radio value="existing">Select Box</Radio>
								<Radio value="new">{NewWatchlistItem}</Radio>
							</Space>
						</Radio.Group>
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
