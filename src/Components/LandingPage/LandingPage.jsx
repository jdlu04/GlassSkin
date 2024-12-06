import React, {useState} from "react";
import './LandingPage.css';

const LandingPage = () => {
    return(
        <>
        <div className='h-screen w-screen relative z-0 bg-yellow-50 bg-opacity-75'>
            <div class='absolute h-screen w-1/3 z-10 bg-lime-500 bg-opacity-25'>
            </div>
            <div className="text-center py-20 px-10 text-8xl "> 
                <h1> Curated for your look </h1>

                <h1 className="text-5xl p-2 text-neutral-500">Express your inner beauty</h1>
            </div>
            <div className="text-center">
                <button className="button"> Join today</button>
            </div>
        </div>
        <div className= 'h-screen'>
  
        </div>
        </>
    

    )
}

export default LandingPage
