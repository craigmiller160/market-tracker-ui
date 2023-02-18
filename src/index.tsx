import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { App } from './components/App';
import { store } from './store';
import { notificationSlice } from './store/notification/slice';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.querySelector('#root')!);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

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
