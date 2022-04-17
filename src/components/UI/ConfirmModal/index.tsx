import { Modal, Typography } from 'antd';

export enum ConfirmModalResult {
	OK,
	CANCEL
}

interface Props {
	readonly show: boolean;
	readonly message: string;
	readonly onClose: (result: ConfirmModalResult) => void;
}

export const ConfirmModal = (props: Props) => (
	<Modal
		visible={props.show}
		onCancel={() => props.onClose(ConfirmModalResult.CANCEL)}
		onOk={() => props.onClose(ConfirmModalResult.OK)}
	>
		<Typography.Title level={3}>{props.message}</Typography.Title>
	</Modal>
);
