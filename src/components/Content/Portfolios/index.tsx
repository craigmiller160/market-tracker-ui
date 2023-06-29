import './Portfolios.scss';
import { Button, Typography } from 'antd';
import {
	useDownloadUpdatedPortfolioData,
	useGetPortfolioList
} from '../../../queries/PortfolioQueries';
import { PortfolioResponse } from '../../../types/generated/market-tracker-portfolio-service';
import { Accordion, AccordionPanelConfig } from '../../UI/Accordion';
import { Spinner } from '../../UI/Spinner';
import { match } from 'ts-pattern';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';

const createPanels = (
	data: ReadonlyArray<PortfolioResponse>
): ReadonlyArray<AccordionPanelConfig> =>
	data.map(
		(res): AccordionPanelConfig => ({
			key: res.id,
			investments: res.stockSymbols.map((symbol) => ({
				symbol,
				name: '',
				type: InvestmentType.STOCK
			})),
			title: <Typography.Title level={4}>{res.name}</Typography.Title>
		})
	);

export const Portfolios = () => {
	const time = useSelector(timeValueSelector);
	const { data, isFetching: getPortfolioListIsLoading } =
		useGetPortfolioList(time);
	const {
		mutate: downloadPortfolioData,
		isLoading: downloadPortfolioDataIsLoading
	} = useDownloadUpdatedPortfolioData();

	const isLoading =
		getPortfolioListIsLoading || downloadPortfolioDataIsLoading;

	const panels = createPanels(data ?? []);
	const body = match({ data, isLoading })
		.with({ isLoading: true }, () => <Spinner />)
		.with({ data: [] }, () => <div />)
		.otherwise(() => (
			<>
				<Typography.Title id="portfoliosPageTitle" level={2}>
					Portfolios
				</Typography.Title>
				<div className="ButtonWrapper">
					<Button
						id="downloadPortfolioDataBtn"
						onClick={downloadPortfolioData}
					>
						Update Portfolios Now
					</Button>
				</div>
				<Accordion id="portfolioAccordion" panels={panels} />
			</>
		));

	return <div className="Portfolios">{body}</div>;
};
