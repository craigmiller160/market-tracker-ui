import { Form, Modal, Radio, Space } from 'antd';

interface Props {
	readonly show: boolean;
	readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalForm {
	readonly watchlistSelectionType: WatchlistSelectionType;
}

// TODO don't forget alert message on success

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
					<Radio.Group defaultValue="existing">
						<Space direction="vertical">
							<Radio value="existing">Select Box</Radio>
							<Radio value="new">Input Field</Radio>
						</Space>
					</Radio.Group>
				</Form>
			</div>
		</Modal>
	);
};
