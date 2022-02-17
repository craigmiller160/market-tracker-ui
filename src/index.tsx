import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((registration) =>
				console.log(
					'Service Worker Registered successfully',
					registration
				)
			)
			.catch((ex) =>
				console.error('Service Worker Registration failed', ex)
			);
	});
}
