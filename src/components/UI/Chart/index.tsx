import { Line } from '@ant-design/charts';
import { castDraft } from 'immer';
import { getFirstPrice } from './chartUtils';
import { useFormattedChartData } from './useFormattedChartData';
import { type InvestmentData } from '../../../types/data/InvestmentData';

interface Props {
    readonly data: InvestmentData;
}

const localeOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
};

export const Chart = (props: Props) => {
    const { records, minPrice, maxPrice, firstPrice } = useFormattedChartData(
        props.data
    );
    const isGain =
        props.data.currentPrice - getFirstPrice(props.data.history) >= 0;

    return (
        <div>
            <Line
                height={250}
                padding="auto"
                xField="date"
                yField="price"
                annotations={[
                    {
                        type: 'regionFilter',
                        start: ['min', firstPrice],
                        end: ['max', 'max'],
                        color: 'green'
                    },
                    {
                        type: 'regionFilter',
                        start: ['min', firstPrice],
                        end: ['max', '0'],
                        color: 'red'
                    },
                    {
                        type: 'line',
                        start: ['min', firstPrice],
                        end: ['max', firstPrice],
                        style: {
                            stroke: '#F4664A',
                            lineDash: [2, 2]
                        }
                    }
                ]}
                yAxis={{
                    min: minPrice,
                    max: maxPrice,
                    label: {
                        formatter: (text) => {
                            return parseFloat(text).toLocaleString(
                                undefined,
                                localeOptions
                            );
                        }
                    }
                }}
                data={castDraft(records)}
                color={isGain ? 'green' : 'red'}
            />
        </div>
    );
};
