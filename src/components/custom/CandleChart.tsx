"use client";

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
        <Chart
            data={data}
            options={options}
            chartType='CandlestickChart'
            width="100%"
            height="400px"
        />
    )
}

export default CandleChart