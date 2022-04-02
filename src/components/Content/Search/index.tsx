// TODO delete this eslint disable in the future
/* eslint-disable @typescript-eslint/no-empty-function */
import './Search.scss';
import { Typography } from 'antd';
import { SearchForm } from './SearchForm';

export const Search = () => (
	<div className="SearchPage">
		<Typography.Title>Search For Investment</Typography.Title>
		<SearchForm doSearch={() => {}} />
	</div>
);
