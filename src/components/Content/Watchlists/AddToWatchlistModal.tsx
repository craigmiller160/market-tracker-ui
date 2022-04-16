import { Modal } from 'antd';

interface Props {
	readonly show: boolean;
	readonly onClose: () => void;
}

// TODO don't forget alert message on success

export const AddToWatchlistModal = (props: Props) => {
	return (
		<Modal title="Add to Watchlist" visible={props.show}>
			<div>
				<p>Radio & Select Box</p>
				<p>Radio & Input Field</p>
			</div>
		</Modal>
	);
};
