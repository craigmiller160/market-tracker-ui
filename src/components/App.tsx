import { Navbar } from './Navbar';
import { Content } from './Content';
import { BrowserRouter } from 'react-router-dom';

export const App = () => (
	<>
		<BrowserRouter basename="/market-tracker">
			<Navbar />
			<Content />
		</BrowserRouter>
	</>
);
