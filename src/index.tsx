import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'antd/dist/antd.min.css'; // TODO antd.min.css
import './index.css';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

const App = () => {
	const onClick = () => alert('Clicked');

	return (
		<div>
			<Button type="primary" onClick={onClick}>
				Click Me
			</Button>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
