import { Modal } from 'antd';

interface Props {
	readonly show: boolean;
}

// TODO don't forget alert message on success

export const AddToWatchlistModal = (props: Props) => {
	return <Modal visible={props.show}></Modal>;
};
