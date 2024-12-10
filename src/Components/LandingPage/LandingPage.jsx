import React, {useState} from "react";
import './LandingPage.css';
import makeupSpread from '../../assets/Images/makeupSpread.jpg';
import '../Animations/Animations.css';
import cat from '../../assets/Images/cat.png';
import makeupKit from '../../assets/Images/makeupKit.png'
import {useNavigate} from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return(
        <>
        <div className='h-screen w-screen bg-cream'>
            {/*<img className="bounce"src={cat}></img>*/}
            <div class='min-h-75 w-screen bg-green'>
                <div className="text-center py-20 px-10 text-8xl"> 
                    <h1 className="fade-in">Curated for your look</h1>
                <h1 className="text-5xl p-2 text-dark_green py-10 fade-in">Express your inner beauty</h1>
            </div>
            </div>
            <div className="text-center py-10">
                <button className="button bounce"
                    onClick={() => navigate('/quiz')}>
                    Join Today
                </button>
                <div className="p-5"> 
                    <h1>Already have an account?</h1>
                    <button>Sign in</button>
                </div>
            </div>
        </div>
        <div className= 'h-screen w-screen relative z-0 justify-between flex items-center  bg-white'>
            <div className="h-screen w-4/5 relative z-10">
                <h1 className="text-8xl m-14">About Us</h1>
                <h2 className="text-4xl bg-gray-50 m-14 p-10 pulse-animation2"> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna 
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit 
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
                    occaecat cupidatat non proident, sunt in culpa qui officia 
                    deserunt mollit anim id est laborum.</h2>
            </div>
            <img className='relative z-10 m-10'src={makeupSpread}></img>
        </div>
        </>

    );
};

export default LandingPage;
