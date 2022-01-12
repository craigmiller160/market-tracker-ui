import { Button } from 'antd';

export const App = () => {
	const onClick = () => alert('Clicked');

	return (
		<div>
			<Button type="primary" onClick={onClick}>
				Click Me
			</Button>
		</div>
	);
};
