import { Navbar } from './Navbar';
import { Content } from './Content';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';

export const App = () => (
	<>
		<Provider store={store}>
			<BrowserRouter basename="/market-tracker">
				<Navbar />
				<Content />
			</BrowserRouter>
		</Provider>
	</>
);
