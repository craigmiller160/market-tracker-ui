import './Portfolios.scss';
import { Button, Typography } from 'antd';
import { useGetPortfolioList } from '../../../queries/PortfolioQueries';
import { PortfolioResponse } from '../../../types/generated/market-tracker-portfolio-service';
import { Accordion, AccordionPanelConfig } from '../../UI/Accordion';
import { Spinner } from '../../UI/Spinner';
import { match } from 'ts-pattern';

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
	const { data, isFetching } = useGetPortfolioList();

	const panels = createPanels(data ?? []);
	const body = match({ data, isFetching })
		.with({ isFetching: true }, () => <Spinner />)
		.with({ data: [] }, () => <div />)
		.otherwise(() => (
			<>
				<Typography.Title id="portfoliosPageTitle" level={2}>
					Portfolios
				</Typography.Title>
				<div className="ButtonWrapper">
					<Button>Update Data Now</Button>
				</div>
				<Accordion id="portfolioAccordion" panels={panels} />
			</>
		));

	return <div className="Portfolios">{body}</div>;
};
