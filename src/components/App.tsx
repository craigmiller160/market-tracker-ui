import { Navbar } from './Navbar';
import { Content } from './Content';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Layout } from 'antd';
import './App.scss';

// TODO build in redirect from / to /market-tracker
export const App = () => (
	<>
		<Provider store={store}>
			<BrowserRouter basename="/market-tracker">
				<Layout className="MarketTrackerApp">
					<Navbar />
					<Content />
				</Layout>
			</BrowserRouter>
		</Provider>
	</>
);
