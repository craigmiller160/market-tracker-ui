import './Portfolios.scss';
import { Typography } from 'antd';
import { useGetPortfolioList } from '../../../queries/PortfolioQueries';
import { PortfolioResponse } from '../../../types/generated/market-tracker-portfolio-service';
import { Accordion, AccordionPanelConfig } from '../../UI/Accordion';

const createPanels = (
	data: ReadonlyArray<PortfolioResponse>
): ReadonlyArray<AccordionPanelConfig> =>
	data.map(
		(res): AccordionPanelConfig => ({
			key: res.id,
			investments: [],
			title: <Typography.Title level={4}>{res.name}</Typography.Title>
		})
	);

export const Portfolios = () => {
	const { data } = useGetPortfolioList();
	if (!data) {
		return <></>;
	}

	const panels = createPanels(data ?? []);

	return (
		<div className="Portfolios">
			<Typography.Title id="portfoliosPageTitle" level={2}>
				Portfolios
			</Typography.Title>
			<Accordion panels={panels} />
		</div>
	);
};
