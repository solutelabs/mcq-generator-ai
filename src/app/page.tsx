import McqIframe from '@/components/custom/McqIframe'
import React from 'react'

const Home = () => {
  return (
    <div className='flex flex-row'>
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