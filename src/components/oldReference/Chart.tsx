/* eslint-disable */
import { Line } from '@ant-design/plots';
import {Annotation} from '@antv/g2plot/src/types/annotation';

const data: Record<string, any>[] = [
    {
        date: '2021-01-01',
        price: 100
    },
    {
        date: '2021-01-02',
        price: 150
    },
    {
        date: '2021-01-03',
        price: 120
    },
    {
        date: '2021-01-04',
        price: 85
    },
    {
        date: '2021-01-05',
        price: 180
    }
]

const style = {
    margin: '0 auto',
    width: '75%'
}

const annotations: Annotation[] = [
    {
        type: 'regionFilter',
        start: ['min', 'median'],
        end: ['max', '0'],
        color: '#F4664A',
    },
    {
        type: 'text',
        position: ['min', 'median'],
        content: 'Start',
        offsetY: -4,
        style: {
            textBaseline: 'bottom',
        },
    },
    {
        type: 'line',
        start: ['120', '100'],
        end: ['200', '210'],
        style: {
            stroke: '#F4664A',
            lineDash: [2, 2],
        }
    },
];

export const Chart = () => {
    const startPrice = data[0].price;
    const endPrice = data[data.length - 1].price;
    const diffPrice = endPrice - startPrice;
    const color = diffPrice >= 0 ? 'green' : 'red';

    return (
        <div style={ style }>
            <Line
                padding="auto"
                xField="date"
                yField="price"
                data={data}
                color={ color }
            />
        </div>
    )
};