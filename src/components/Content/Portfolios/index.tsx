import './Portfolios.scss';
import { Typography } from 'antd';
import { useGetPortfolioList } from '../../../queries/PortfolioQueries';

export const Portfolios = () => {
	const { data } = useGetPortfolioList();
	if (!data) {
		return <></>;
	}

	return (
		<div className="MyInvestments">
			<Typography.Title level={2}>Portfolios</Typography.Title>
		</div>
	);
};
