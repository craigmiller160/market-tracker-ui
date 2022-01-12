import { Button } from 'antd';
import {Navbar} from './Navbar';

export const App = () => {
	const onClick = () => alert('Clicked');

	return (
		<div>
            <Navbar />
            <div style={ { margin: '5rem auto', width: '100%', textAlign: 'center' } }>
                <Button type="primary" onClick={onClick}>
                    Click Me
                </Button>
            </div>
		</div>
	);
};
