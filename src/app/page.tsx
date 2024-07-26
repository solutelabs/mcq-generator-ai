import Chart from '@/components/custom/Chart'
import McqIframe from '@/components/custom/McqIframe'
import React from 'react'

let sales = [
  { date: "2023-04-30T12:00:00.00+00:00", value: 4 },
  { date: "2023-05-01T12:00:00.00+00:00", value: 6 },
  { date: "2023-05-02T12:00:00.00+00:00", value: 8 },
  { date: "2023-05-03T12:00:00.00+00:00", value: 7 },
  { date: "2023-05-04T12:00:00.00+00:00", value: 10 },
  { date: "2023-05-05T12:00:00.00+00:00", value: 12 },
  { date: "2023-05-06T12:00:00.00+00:00", value: 4 },
];
let data = sales.map((d) => ({ ...d, date: new Date(d.date) }));

const Home = () => {
  return (
    <div className='flex flex-row bg-black'>
      <div className="w-[50vw] h-screen overflow-y-scroll">
        <McqIframe />
      </div>
      <div className="w-[50vw] h-screen overflow-y-scroll">
        <iframe src="https://demo-text-v1.s3.ap-south-1.amazonaws.com/stock-market.pdf" className="w-full h-full" />
      </div>
    </div>
  )
}

export default Home