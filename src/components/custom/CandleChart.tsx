"use client";

import { Card } from '../ui/card';
import { MCQ } from './McqIframe'
import Chart from 'react-google-charts';


const CandleChart = ({ mcq }: { mcq: MCQ }) => {

    if (!mcq) return;
    const answer = mcq?.answer;

    if (!answer) return;

    const values = answer.split(",");
    if (values.length !== 4) return;
    const numbers = values.map((value) => {
        return Number(value);
    })

    const [open, high, low, close] = numbers

    const options = {
        legend: "none",
        bar: { groupWidth: "5%" }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
            risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
        },
    };


    const data = [
        ["Day", "", "", "", ""],
        ["Mon", low, open, close, high],
    ];

    return (
        <Card className='m-10 mb-0 border-2 bg-gray-700 text-white'>
            <Chart
                data={data}
                options={options}
                chartType='CandlestickChart'
                width="100%"
                height="400px"
                className='bg-gray-700 text-white border-1'
            />
        </Card>
    )
}

export default CandleChart