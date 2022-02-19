import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './components/App';
import { store } from './store';
import { notificationSlice } from './store/notification/slice';

ReactDOM.render(<App />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/market-tracker/service-worker.js')
			.then((registration) => registration.update())
			.catch((ex) =>
				store.dispatch(
					notificationSlice.actions.addError(
						`Service Worker registration failed: ${ex.message}`
					)
				)
			);
	});
}
