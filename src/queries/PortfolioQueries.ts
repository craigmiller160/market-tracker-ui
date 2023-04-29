import { useQuery } from '@tanstack/react-query';
import { getPortfolioList } from '../services/PortfolioService';

export const GET_PORTFOLIO_LIST_KEY = 'PortfolioQueries_GetPortfoioList';

export const useGetPortfolioList = () =>
	useQuery({
		queryKey: [GET_PORTFOLIO_LIST_KEY],
		queryFn: getPortfolioList
	});
