import { Form, Input, Modal, Radio, Space } from 'antd';

interface Props {
	readonly show: boolean;
	readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalForm {
	readonly watchlistSelectionType: WatchlistSelectionType;
	readonly newWatchListName: string;
}

// TODO don't forget alert message on success
// TODO make sure it resets when re-opened

export const AddToWatchlistModal = (props: Props) => {
	const [form] = Form.useForm<ModalForm>();
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
								<Radio value="new">
									<Form.Item name="newWatchListName">
										<Input />
									</Form.Item>
								</Radio>
							</Space>
						</Radio.Group>
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
