import React, {useState} from "react";
import './LandingPage.css';

const LandingPage = () => {
    return(
        <>
        <div className='h-screen w-screen relative bg-yellow-50 bg-opacity-75'>
            <div class='min-h-75 w-screen bg-lime-500 bg-opacity-25'>
                <div className="text-center py-20 px-10 text-8xl"> 
                    <h1>Curated for your look</h1>
                <h1 className="text-5xl p-2 text-neutral-500 py-10">Express your inner beauty</h1>
            </div>
            </div>
            <div className="text-center py-10">
                <button className="button">Join today</button>
                <div className="p-5"> 
                    <h1>Already have an account?</h1>
                    <button>Sign in</button>
                </div>
            
            </div>
            <div>

            </div>
        </div>
        <div className= 'h-screen'>
  
        </div>
        </>
    

    );
};

export default LandingPage;
