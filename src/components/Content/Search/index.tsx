import './Search.scss';
import { Typography } from 'antd';
import { SearchForm } from './SearchForm';

export const Search = () => (
	<div className="SearchPage">
		<Typography.Title>Search</Typography.Title>
		<SearchForm />
	</div>
);
