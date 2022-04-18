import { Form, Input, Modal } from 'antd';

interface Props {
	readonly show: boolean;
	readonly label: string;
	readonly title: string;
	readonly onClose: (value?: string) => void;
}

interface InputFormData {
	readonly value: string;
}

export const InputModal = (props: Props) => {
	const [form] = Form.useForm<InputFormData>();
	return (
		<Modal
			title={props.title}
			visible={props.show}
			onCancel={() => props.onClose()}
			onOk={() => props.onClose(form.getFieldsValue().value)}
		>
			<Form form={form}>
				<Form.Item name="value" label={props.label}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};
