import { Form, FormInstance, Input, Modal } from 'antd';
import { useForceUpdate } from '../../hooks/useForceUpdate';

interface Props {
	readonly show: boolean;
	readonly label: string;
	readonly title: string;
	readonly onClose: (value?: string) => void;
}

interface InputFormData {
	readonly value: string;
}

const isOkDisabled = (form: FormInstance<InputFormData>): boolean => {
	const values = form.getFieldsValue();
	return (values.value?.length ?? 0) <= 0;
};

export const InputModal = (props: Props) => {
	const [form] = Form.useForm<InputFormData>();
	const forceUpdate = useForceUpdate();
	return (
		<Form form={form} onValuesChange={forceUpdate}>
			<Modal
				title={props.title}
				open={props.show}
				onCancel={() => props.onClose()}
				onOk={() => props.onClose(form.getFieldsValue().value)}
				okButtonProps={{
					disabled: isOkDisabled(form)
				}}
			>
				<Form.Item name="value" label={props.label}>
					<Input />
				</Form.Item>
			</Modal>
		</Form>
	);
};
