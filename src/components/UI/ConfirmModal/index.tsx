import { Modal, Typography } from 'antd';

export enum ConfirmModalResult {
	OK,
	CANCEL
}

interface Props {
	readonly show: boolean;
	readonly title: string;
	readonly message: string;
	readonly onClose: (result: ConfirmModalResult) => void;
}

export const ConfirmModal = (props: Props) => (
	<Modal
		title={props.title}
		open={props.show}
		onCancel={() => props.onClose(ConfirmModalResult.CANCEL)}
		onOk={() => props.onClose(ConfirmModalResult.OK)}
	>
		<Typography.Title level={5}>{props.message}</Typography.Title>
	</Modal>
);
