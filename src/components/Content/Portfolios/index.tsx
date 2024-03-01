import './Portfolios.scss';
import { Button, Typography } from 'antd';
import {
	useDownloadUpdatedPortfolioData,
	useGetPortfolioList
} from '../../../queries/PortfolioQueries';
import { type PortfolioResponse } from '../../../types/generated/market-tracker-portfolio-service';
import { Accordion, type AccordionPanelConfig } from '../../UI/Accordion';
import { Spinner } from '../../UI/Spinner';
import { match, P } from 'ts-pattern';
import { InvestmentType } from '../../../types/data/InvestmentType';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { InvestmentCardDataLoadingContext } from '../common/InvestmentCard/InvestmentCardDataLoadingContext';
import { useGetPortfolioInvestmentData } from './useGetPortfolioInvestmentData';
import { type PortfolioInvestmentInfo } from '../../../types/data/InvestmentInfo';

const createPanels = (
	data: ReadonlyArray<PortfolioResponse>
): ReadonlyArray<AccordionPanelConfig> =>
	data.map(
		(res): AccordionPanelConfig => ({
			key: res.id,
			investments: res.stockSymbols.map(
				(symbol): PortfolioInvestmentInfo => ({
					symbol,
					name: '',
					type: InvestmentType.STOCK,
					portfolioId: res.id
				})
			),
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

	const panels = createPanels(data ?? []);
	const body = match({
		data,
		getPortfolioListIsLoading,
		downloadPortfolioDataIsLoading
	})
		.with(
			P.union(
				{ downloadPortfolioDataIsLoading: true },
				{ getPortfolioListIsLoading: true, data: P.nullish }
			),
			() => <Spinner />
		)
		.with({ data: [] }, () => <div />)
		.otherwise(() => (
			<>
				<Typography.Title id="portfoliosPageTitle" level={2}>
					Portfolios
				</Typography.Title>
				<div className="button-wrapper">
					<Button
						id="downloadPortfolioDataBtn"
						onClick={downloadPortfolioData}
					>
						Update Portfolios Now
					</Button>
				</div>
				<InvestmentCardDataLoadingContext.Provider
					value={useGetPortfolioInvestmentData}
				>
					<Accordion id="portfolioAccordion" panels={panels} />
				</InvestmentCardDataLoadingContext.Provider>
			</>
		));

	return <div className="portfolios">{body}</div>;
};
