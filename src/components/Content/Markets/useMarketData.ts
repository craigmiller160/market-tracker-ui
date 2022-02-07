import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';

/*
1) Check if market open
	a) If oneDay, call calendar API
	b) Otherwise, return OPEN

2) Get History
	a) If market closed, do a no-op
	b) Otherwise, run all history APIs

3) Get Quote
	a) If market closed, do a no-op
	b) If market open and history timestamp below current timestamp, get quote
	c) If market open and history timestamp higher than current timestamp, do a no-op

 */

export const useMarketData = () => {
	const timeValue = useSelector(timeValueSelector);
};