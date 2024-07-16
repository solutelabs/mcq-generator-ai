import McqIframe from '@/components/custom/McqIframe'
import React from 'react'

const Home = () => {
  return (
    <div className='flex flex-row'>
      <div className="w-[50vw] h-screen overflow-y-scroll">
        <McqIframe />
      </div>
      <div className="w-[50vw] h-screen overflow-y-scroll">
        <iframe src="https://zerodha-common.s3.ap-south-1.amazonaws.com/Varsity/Modules/Module%201_Introduction%20to%20Stock%20Markets.pdf" className="w-full h-full" />
      </div>
    </div>
  )
}

export default Home